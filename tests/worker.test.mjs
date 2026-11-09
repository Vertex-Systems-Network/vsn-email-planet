import assert from "node:assert/strict";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { enqueueOperationJob } from "../apps/api/db/jobs.mjs";
import { migrateDatabase } from "../apps/api/db/migrate.mjs";
import { runWorker, runWorkerOnce } from "../apps/api/db/worker.mjs";

const organizationId = "00000000-0000-4000-8000-000000000031";
const connectionId = "10000000-0000-4000-8000-000000000031";
const workerId = "20000000-0000-4000-8000-000000000031";

async function setup() {
  const db = new PGlite();
  await migrateDatabase(db, { executeSql: (sql) => db.exec(sql) });
  await db.query("INSERT INTO organizations (id, slug, display_name) VALUES ($1, 'worker-tenant', 'Worker tenant')", [organizationId]);
  await db.query(
    "INSERT INTO provider_connections (id, organization_id, provider_key, external_account_id, display_name) VALUES ($1, $2, 'imap', 'worker-acct', 'Worker mailbox server')",
    [connectionId, organizationId],
  );
  return db;
}

const job = (key, effectClass = "read_only", operationType = "test.operation") => ({
  organizationId,
  providerConnectionId: connectionId,
  mailboxKey: "worker-mailbox",
  operationType,
  effectClass,
  idempotencyKey: key,
});

test("worker runs a handler with lease heartbeats and completes the claimed job", async () => {
  const db = await setup();
  try {
    const { job: queued } = await enqueueOperationJob(db, job("worker:heartbeat"));
    let handled = 0;
    const result = await runWorkerOnce({
      database: db,
      organizationId,
      workerId,
      leaseDurationMs: 1_000,
      heartbeatIntervalMs: 100,
      handlers: {
        "test.operation": async (_operation, context) => {
          handled++;
          await new Promise((resolve) => setTimeout(resolve, 1_150));
          assert.equal(context.signal.aborted, false);
        },
      },
    });
    assert.deepEqual(result, { status: "succeeded", jobId: queued.id });
    assert.equal(handled, 1);
    const persisted = await db.query("SELECT status, lease_generation FROM operation_jobs WHERE id = $1", [queued.id]);
    assert.equal(persisted.rows[0].status, "succeeded");
    assert.ok(Number(persisted.rows[0].lease_generation) >= 1);
  } finally {
    await db.close();
  }
});

test("worker marks dispatched mutation failures unknown instead of retrying them", async () => {
  const db = await setup();
  try {
    const { job: queued } = await enqueueOperationJob(db, job("worker:external-unknown", "external_mutation"));
    const result = await runWorkerOnce({
      database: db,
      organizationId,
      workerId,
      handlers: {
        "test.operation": async (_operation, context) => {
          assert.equal(await context.markExternalDispatchStarted(), true);
          const error = new Error("Provider response was lost.");
          error.code = "provider.response_lost";
          error.retryable = true;
          throw error;
        },
      },
    });
    assert.deepEqual(result, { status: "unknown", jobId: queued.id });
    const persisted = await db.query("SELECT status, last_error_code FROM operation_jobs WHERE id = $1", [queued.id]);
    assert.equal(persisted.rows[0].status, "unknown");
    assert.equal(persisted.rows[0].last_error_code, "provider.response_lost");
  } finally {
    await db.close();
  }
});

test("worker shutdown aborts a safe handler and returns its job to bounded retry", async () => {
  const db = await setup();
  const controller = new AbortController();
  try {
    const { job: queued } = await enqueueOperationJob(db, job("worker:shutdown"));
    const running = runWorkerOnce({
      database: db,
      organizationId,
      workerId,
      handlers: {
        "test.operation": async (_operation, context) => new Promise((resolve, reject) => {
          context.signal.addEventListener("abort", () => reject(context.signal.reason), { once: true });
        }),
      },
      signal: controller.signal,
    });
    setTimeout(() => controller.abort(new Error("SIGTERM")), 50);
    assert.deepEqual(await running, { status: "retry_wait", jobId: queued.id });
    const persisted = await db.query("SELECT status, attempt_count FROM operation_jobs WHERE id = $1", [queued.id]);
    assert.equal(persisted.rows[0].status, "retry_wait");
    assert.equal(persisted.rows[0].attempt_count, 1);
  } finally {
    await db.close();
  }
});

test("worker polling stops promptly on abort", async () => {
  const db = await setup();
  const controller = new AbortController();
  try {
    const run = runWorker({ database: db, organizationId, workerId, handlers: {}, pollIntervalMs: 500, signal: controller.signal });
    setTimeout(() => controller.abort(), 50);
    assert.deepEqual(await run, [{ status: "idle", reclaimed: 0 }]);
  } finally {
    await db.close();
  }
});
