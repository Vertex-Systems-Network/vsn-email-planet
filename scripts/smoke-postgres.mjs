import assert from "node:assert/strict";
import pg from "pg";
import { randomUUID } from "node:crypto";
import {
  claimNextOperationJob,
  claimOutboxEvents,
  completeOperationJob,
  enqueueOperationJob,
  markOutboxEventPublished,
} from "../apps/api/db/jobs.mjs";
import { migrateDatabase } from "../apps/api/db/migrate.mjs";
import { runWorkerOnce } from "../apps/api/db/worker.mjs";

const databaseUrl = process.env.DATABASE_URL;
if (process.env.VSN_TEST_DATABASE !== "1" || !databaseUrl || !new URL(databaseUrl).pathname.endsWith("/vsn_test")) {
  throw new Error("Refusing native PostgreSQL smoke test: set VSN_TEST_DATABASE=1 and use a disposable database named vsn_test.");
}

const client = new pg.Client({ connectionString: databaseUrl, application_name: "vsn-email-planet-migration-smoke" });
await client.connect();
try {
  const first = await migrateDatabase(client);
  const second = await migrateDatabase(client);
  assert.ok(first.checked >= 1);
  assert.equal(second.checked, first.checked);
  assert.deepEqual(second.applied, []);

  const organizationA = "00000000-0000-4000-8000-000000000011";
  const organizationB = "00000000-0000-4000-8000-000000000012";
  const connectionId = "10000000-0000-4000-8000-000000000011";
  await client.query("BEGIN");
  try {
    await client.query("INSERT INTO organizations (id, slug, display_name) VALUES ($1, 'ci-tenant-a', 'CI tenant A'), ($2, 'ci-tenant-b', 'CI tenant B')", [organizationA, organizationB]);
    await client.query(
      "INSERT INTO provider_connections (id, organization_id, provider_key, external_account_id, display_name) VALUES ($1, $2, 'imap', 'ci-acct-a', 'CI mailbox server A')",
      [connectionId, organizationA],
    );
    await client.query("SAVEPOINT cross_tenant_check");
    await assert.rejects(client.query(
      "INSERT INTO connection_scopes (organization_id, provider_connection_id, resource_type, resource_id, access_level) VALUES ($1, $2, 'mailbox', 'ci-mailbox-b', 'metadata_read')",
      [organizationB, connectionId],
    ), /foreign key constraint/i);
    await client.query("ROLLBACK TO SAVEPOINT cross_tenant_check");
  } finally {
    await client.query("ROLLBACK");
  }

  const pool = new pg.Pool({ connectionString: databaseUrl, application_name: "vsn-email-planet-jobs-smoke" });
  const queueOrganizationA = randomUUID();
  const queueOrganizationB = randomUUID();
  const queueConnectionId = randomUUID();
  const workerA = randomUUID();
  const workerB = randomUUID();
  const workerAfter = randomUUID();
  try {
    await pool.query("INSERT INTO organizations (id, slug, display_name) VALUES ($1, $2, 'Queue tenant A'), ($3, $4, 'Queue tenant B')", [queueOrganizationA, `queue-a-${queueOrganizationA.slice(0, 8)}`, queueOrganizationB, `queue-b-${queueOrganizationB.slice(0, 8)}`]);
    await pool.query(
      "INSERT INTO provider_connections (id, organization_id, provider_key, external_account_id, display_name) VALUES ($1, $2, 'imap', 'queue-acct-a', 'Queue mailbox server A')",
      [queueConnectionId, queueOrganizationA],
    );
    const input = { organizationId: queueOrganizationA, providerConnectionId: queueConnectionId, mailboxKey: "queue-mailbox", operationType: "smoke.sync", effectClass: "read_only", idempotencyKey: `queue:${queueOrganizationA}:one` };
    const first = await enqueueOperationJob(pool, input);
    const duplicate = await enqueueOperationJob(pool, input);
    const second = await enqueueOperationJob(pool, { ...input, idempotencyKey: `queue:${queueOrganizationA}:two` });
    assert.equal(first.created, true);
    assert.equal(duplicate.created, false);
    assert.equal(duplicate.job.id, first.job.id);
    const concurrentClaims = await Promise.all([
      claimNextOperationJob(pool, { organizationId: queueOrganizationA, workerId: workerA, leaseDurationMs: 5_000 }),
      claimNextOperationJob(pool, { organizationId: queueOrganizationA, workerId: workerB, leaseDurationMs: 5_000 }),
    ]);
    const firstClaim = concurrentClaims.find((claim) => claim.job);
    assert.ok(firstClaim);
    assert.equal(concurrentClaims.filter((claim) => claim.job).length, 1);
    assert.equal((await claimNextOperationJob(pool, { organizationId: queueOrganizationA, workerId: workerAfter, leaseDurationMs: 5_000 })).job, null);
    assert.equal((await claimNextOperationJob(pool, { organizationId: queueOrganizationB, workerId: workerAfter, leaseDurationMs: 5_000 })).job, null);
    assert.equal(await completeOperationJob(pool, { jobId: firstClaim.job.id, organizationId: queueOrganizationA, workerId: firstClaim.job.lease_owner, leaseGeneration: firstClaim.job.lease_generation }), true);
    const secondClaim = await claimNextOperationJob(pool, { organizationId: queueOrganizationA, workerId: workerAfter, leaseDurationMs: 5_000 });
    assert.ok(secondClaim.job);
    assert.notEqual(secondClaim.job.id, firstClaim.job.id);
    assert.equal(await completeOperationJob(pool, { jobId: secondClaim.job.id, organizationId: queueOrganizationA, workerId: workerAfter, leaseGeneration: secondClaim.job.lease_generation }), true);
    const workerJob = await enqueueOperationJob(pool, { ...input, operationType: "smoke.worker", idempotencyKey: `queue:${queueOrganizationA}:worker` });
    const workerResult = await runWorkerOnce({
      database: pool,
      organizationId: queueOrganizationA,
      workerId: workerA,
      handlers: { "smoke.worker": async () => {} },
    });
    assert.deepEqual(workerResult, { status: "succeeded", jobId: workerJob.job.id });
    const events = await claimOutboxEvents(pool, { organizationId: queueOrganizationA, workerId: workerA, leaseDurationMs: 5_000 });
    assert.equal(events.length, 3);
    for (const event of events) {
      assert.equal(await markOutboxEventPublished(pool, { eventId: event.id, organizationId: queueOrganizationA, workerId: workerA, leaseGeneration: event.publish_lease_generation }), true);
    }
  } finally {
    await pool.query("DELETE FROM event_outbox WHERE organization_id = ANY($1::uuid[])", [[queueOrganizationA, queueOrganizationB]]);
    await pool.query("DELETE FROM operation_jobs WHERE organization_id = ANY($1::uuid[])", [[queueOrganizationA, queueOrganizationB]]);
    await pool.query("DELETE FROM provider_connections WHERE organization_id = ANY($1::uuid[])", [[queueOrganizationA, queueOrganizationB]]);
    await pool.query("DELETE FROM organizations WHERE id = ANY($1::uuid[])", [[queueOrganizationA, queueOrganizationB]]);
    await pool.end();
  }

  console.log("Native PostgreSQL smoke passed: migrations are idempotent, tenant keys reject cross-organization links, simultaneous workers serialize mailbox jobs, the handler-driven worker completes a job, enqueue is idempotent, and outbox acknowledgement is fenced.");
} finally {
  await client.end();
}
