import assert from "node:assert/strict";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import {
  claimNextOperationJob,
  claimOutboxEvents,
  completeOperationJob,
  enqueueOperationJob,
  failOperationJob,
  heartbeatOperationJob,
  markExternalDispatchStarted,
  markOutboxEventPublished,
  resolveUnknownExternalMutation,
} from "../apps/api/db/jobs.mjs";
import { migrateDatabase } from "../apps/api/db/migrate.mjs";

const organizationId = "00000000-0000-4000-8000-000000000001";
const connectionId = "10000000-0000-4000-8000-000000000001";
const workerA = "20000000-0000-4000-8000-000000000001";
const workerB = "20000000-0000-4000-8000-000000000002";

async function setup() {
  const db = new PGlite();
  await migrateDatabase(db, { executeSql: (sql) => db.exec(sql) });
  await db.query("INSERT INTO organizations (id, slug, display_name) VALUES ($1, 'tenant-a', 'Tenant A')", [organizationId]);
  await db.query(
    "INSERT INTO provider_connections (id, organization_id, provider_key, external_account_id, display_name) VALUES ($1, $2, 'imap', 'acct-a', 'Mailbox server A')",
    [connectionId, organizationId],
  );
  return db;
}

const mailboxJob = (idempotencyKey, operationType = "mailbox.sync", effectClass = "read_only") => ({
  organizationId,
  providerConnectionId: connectionId,
  mailboxKey: "mbx-a",
  operationType,
  effectClass,
  idempotencyKey,
});

test("job enqueue is tenant-scoped and idempotent with an atomic outbox event", async () => {
  const db = await setup();
  try {
    const first = await enqueueOperationJob(db, mailboxJob("sync:mbx-a:cursor-1"));
    const duplicate = await enqueueOperationJob(db, mailboxJob("sync:mbx-a:cursor-1"));
    assert.equal(first.created, true);
    assert.equal(duplicate.created, false);
    assert.equal(duplicate.job.id, first.job.id);
    const jobs = await db.query("SELECT count(*)::int AS count FROM operation_jobs");
    const events = await db.query("SELECT count(*)::int AS count FROM event_outbox");
    assert.equal(jobs.rows[0].count, 1);
    assert.equal(events.rows[0].count, 1);
    await assert.rejects(
      enqueueOperationJob(db, mailboxJob("sync:mbx-a:cursor-1", "mailbox.delete", "external_mutation")),
      /already bound to a different operation/,
    );
    const afterConflict = await db.query("SELECT count(*)::int AS count FROM operation_jobs");
    assert.equal(afterConflict.rows[0].count, 1);
  } finally {
    await db.close();
  }
});

test("mailbox lease serializes active jobs and stale fencing tokens cannot complete", async () => {
  const db = await setup();
  try {
    const first = await enqueueOperationJob(db, mailboxJob("sync:first"));
    const second = await enqueueOperationJob(db, mailboxJob("sync:second"));
    const claimA = await claimNextOperationJob(db, { organizationId, workerId: workerA, leaseDurationMs: 5_000 });
    assert.equal(claimA.job.id, first.job.id);
    assert.equal((await claimNextOperationJob(db, { organizationId, workerId: workerB, leaseDurationMs: 5_000 })).job, null);
    assert.equal(await heartbeatOperationJob(db, { jobId: claimA.job.id, organizationId, workerId: workerA, leaseGeneration: claimA.job.lease_generation, leaseDurationMs: 5_000 }), true);
    assert.equal(await completeOperationJob(db, { jobId: claimA.job.id, organizationId, workerId: workerA, leaseGeneration: claimA.job.lease_generation }), true);
    const claimB = await claimNextOperationJob(db, { organizationId, workerId: workerB, leaseDurationMs: 5_000 });
    assert.equal(claimB.job.id, second.job.id);
    assert.equal(await completeOperationJob(db, { jobId: claimB.job.id, organizationId, workerId: workerA, leaseGeneration: claimB.job.lease_generation }), false);
  } finally {
    await db.close();
  }
});

test("expired read leases are reclaimed with a higher generation", async () => {
  const db = await setup();
  try {
    const { job } = await enqueueOperationJob(db, mailboxJob("sync:expired"));
    const first = await claimNextOperationJob(db, { organizationId, workerId: workerA, leaseDurationMs: 5_000 });
    await db.query("UPDATE operation_jobs SET lease_expires_at = now() - interval '1 second' WHERE id = $1", [job.id]);
    const reclaimed = await claimNextOperationJob(db, { organizationId, workerId: workerB, leaseDurationMs: 5_000 });
    assert.equal(reclaimed.reclaimed, 1);
    assert.equal(reclaimed.job.id, job.id);
    assert.equal(Number(reclaimed.job.lease_generation), Number(first.job.lease_generation) + 1);
    assert.equal(await completeOperationJob(db, { jobId: job.id, organizationId, workerId: workerA, leaseGeneration: first.job.lease_generation }), false);
  } finally {
    await db.close();
  }
});

test("expired dispatched mutations become unknown and block automatic replay until reconciliation", async () => {
  const db = await setup();
  try {
    const { job } = await enqueueOperationJob(db, mailboxJob("delete:op-1", "mailbox.delete", "external_mutation"));
    const first = await claimNextOperationJob(db, { organizationId, workerId: workerA, leaseDurationMs: 5_000 });
    assert.equal(await markExternalDispatchStarted(db, { jobId: job.id, organizationId, workerId: workerA, leaseGeneration: first.job.lease_generation }), true);
    await db.query("UPDATE operation_jobs SET lease_expires_at = now() - interval '1 second' WHERE id = $1", [job.id]);
    const secondMutation = await enqueueOperationJob(db, mailboxJob("delete:op-2", "mailbox.delete", "external_mutation"));
    const result = await claimNextOperationJob(db, { organizationId, workerId: workerB, leaseDurationMs: 5_000 });
    assert.equal(result.job, null);
    assert.equal(result.reclaimed, 1);
    const state = await db.query("SELECT status FROM operation_jobs WHERE id = $1", [job.id]);
    assert.equal(state.rows[0].status, "unknown");
    assert.equal(await resolveUnknownExternalMutation(db, { jobId: job.id, organizationId, outcome: "confirmed_not_applied" }), true);
    const retried = await claimNextOperationJob(db, { organizationId, workerId: workerB, leaseDurationMs: 5_000 });
    assert.equal(retried.job.id, secondMutation.job.id);
  } finally {
    await db.close();
  }
});

test("outbox claims are fenced and can be acknowledged exactly once", async () => {
  const db = await setup();
  try {
    await enqueueOperationJob(db, mailboxJob("sync:outbox"));
    const events = await claimOutboxEvents(db, { organizationId, workerId: workerA, leaseDurationMs: 5_000 });
    assert.equal(events.length, 1);
    assert.equal(await markOutboxEventPublished(db, { eventId: events[0].id, organizationId, workerId: workerA, leaseGeneration: events[0].publish_lease_generation }), true);
    assert.equal(await markOutboxEventPublished(db, { eventId: events[0].id, organizationId, workerId: workerA, leaseGeneration: events[0].publish_lease_generation }), false);
    const pending = await db.query("SELECT count(*)::int AS count FROM event_outbox WHERE published_at IS NULL");
    assert.equal(pending.rows[0].count, 0);
  } finally {
    await db.close();
  }
});

test("worker claims require a tenant and do not cross organization boundaries", async () => {
  const db = await setup();
  try {
    const otherOrganization = "00000000-0000-4000-8000-000000000002";
    const otherConnection = "10000000-0000-4000-8000-000000000002";
    await db.query("INSERT INTO organizations (id, slug, display_name) VALUES ($1, 'tenant-b', 'Tenant B')", [otherOrganization]);
    await db.query(
      "INSERT INTO provider_connections (id, organization_id, provider_key, external_account_id, display_name) VALUES ($1, $2, 'imap', 'acct-b', 'Mailbox server B')",
      [otherConnection, otherOrganization],
    );
    const jobA = await enqueueOperationJob(db, mailboxJob("tenant-a:sync"));
    const jobB = await enqueueOperationJob(db, {
      ...mailboxJob("tenant-b:sync"), organizationId: otherOrganization, providerConnectionId: otherConnection,
    });
    await assert.rejects(claimNextOperationJob(db, { workerId: workerA, leaseDurationMs: 5_000 }), /organizationId/);
    const claimA = await claimNextOperationJob(db, { organizationId, workerId: workerA, leaseDurationMs: 5_000 });
    assert.equal(claimA.job.id, jobA.job.id);
    assert.notEqual(claimA.job.id, jobB.job.id);
    const outboxB = await claimOutboxEvents(db, { organizationId: otherOrganization, workerId: workerB, leaseDurationMs: 5_000 });
    assert.equal(outboxB.length, 1);
    assert.equal(outboxB[0].organization_id, otherOrganization);
  } finally {
    await db.close();
  }
});

test("transient retry is bounded and dispatched mutations cannot be blindly retried", async () => {
  const db = await setup();
  try {
    const bounded = await enqueueOperationJob(db, { ...mailboxJob("sync:bounded"), maxAttempts: 2 });
    const first = await claimNextOperationJob(db, { organizationId, workerId: workerA, leaseDurationMs: 5_000 });
    assert.equal(first.job.id, bounded.job.id);
    assert.equal(await failOperationJob(db, {
      jobId: bounded.job.id, organizationId, workerId: workerA, leaseGeneration: first.job.lease_generation,
      errorCode: "provider.temporary", retryable: true,
    }), "retry_wait");
    const scheduled = await db.query("SELECT available_at > now() AS delayed FROM operation_jobs WHERE id = $1", [bounded.job.id]);
    assert.equal(scheduled.rows[0].delayed, true);
    await db.query("UPDATE operation_jobs SET available_at = now() - interval '1 second' WHERE id = $1", [bounded.job.id]);
    const retry = await claimNextOperationJob(db, { organizationId, workerId: workerB, leaseDurationMs: 5_000 });
    assert.equal(retry.job.id, bounded.job.id);
    assert.equal(retry.job.attempt_count, 2);
    assert.equal(await failOperationJob(db, {
      jobId: bounded.job.id, organizationId, workerId: workerB, leaseGeneration: retry.job.lease_generation,
      errorCode: "provider.temporary", retryable: true,
    }), "dead");

    const mutation = await enqueueOperationJob(db, mailboxJob("delete:ambiguous", "mailbox.delete", "external_mutation"));
    const second = await claimNextOperationJob(db, { organizationId, workerId: workerB, leaseDurationMs: 5_000 });
    assert.equal(second.job.id, mutation.job.id);
    assert.equal(await markExternalDispatchStarted(db, { jobId: mutation.job.id, organizationId, workerId: workerB, leaseGeneration: second.job.lease_generation }), true);
    assert.equal(await failOperationJob(db, {
      jobId: mutation.job.id, organizationId, workerId: workerB, leaseGeneration: second.job.lease_generation,
      errorCode: "provider.response_lost", retryable: true,
    }), "unknown");
  } finally {
    await db.close();
  }
});
