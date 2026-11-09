import {
  claimNextOperationJob,
  completeOperationJob,
  failOperationJob,
  heartbeatOperationJob,
  markExternalDispatchStarted,
} from "./jobs.mjs";

const validDuration = (name, value, minimum = 1_000, maximum = 15 * 60_000) => {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be an integer from ${minimum} through ${maximum}.`);
  }
  return value;
};

const safeErrorCode = (value) => typeof value === "string" && /^[a-z][a-z0-9_.-]{0,95}$/.test(value)
  ? value
  : "worker.operation_failed";

function abortableDelay(milliseconds, signal) {
  return new Promise((resolve) => {
    if (signal?.aborted) return resolve();
    const timer = setTimeout(done, milliseconds);
    function done() {
      clearTimeout(timer);
      signal?.removeEventListener("abort", done);
      resolve();
    }
    signal?.addEventListener("abort", done, { once: true });
  });
}

export async function runWorkerOnce({
  database,
  organizationId,
  workerId,
  handlers,
  leaseDurationMs = 30_000,
  heartbeatIntervalMs = Math.floor(leaseDurationMs / 3),
  signal,
}) {
  if (!database || !organizationId || !workerId || !handlers) throw new TypeError("database, organizationId, workerId and handlers are required.");
  validDuration("leaseDurationMs", leaseDurationMs);
  validDuration("heartbeatIntervalMs", heartbeatIntervalMs, 100, Math.floor(leaseDurationMs / 2));
  if (signal?.aborted) return { status: "stopped" };

  const claim = await claimNextOperationJob(database, { organizationId, workerId, leaseDurationMs });
  const job = claim.job;
  if (!job) return { status: signal?.aborted ? "stopped" : "idle", reclaimed: claim.reclaimed };

  const handler = handlers[job.operation_type];
  const lease = { jobId: job.id, organizationId, workerId, leaseGeneration: job.lease_generation };
  if (typeof handler !== "function") {
    const failed = await failOperationJob(database, { ...lease, errorCode: "worker.handler_unregistered", retryable: false });
    return { status: failed ?? "lease_lost", jobId: job.id };
  }

  const controller = new AbortController();
  let leaseLost = false;
  let heartbeatInFlight = null;
  const abortForShutdown = () => controller.abort(signal?.reason ?? new Error("Worker is shutting down."));
  signal?.addEventListener("abort", abortForShutdown, { once: true });

  const heartbeatTimer = setInterval(() => {
    if (heartbeatInFlight || controller.signal.aborted) return;
    heartbeatInFlight = heartbeatOperationJob(database, { ...lease, leaseDurationMs })
      .then((alive) => {
        if (!alive) {
          leaseLost = true;
          controller.abort(new Error("Worker lease was lost."));
        }
      })
      .catch(() => {
        leaseLost = true;
        controller.abort(new Error("Worker lease heartbeat failed."));
      })
      .finally(() => { heartbeatInFlight = null; });
  }, heartbeatIntervalMs);

  const context = {
    signal: controller.signal,
    markExternalDispatchStarted: async () => {
      if (controller.signal.aborted) return false;
      const accepted = await markExternalDispatchStarted(database, lease);
      if (!accepted) {
        leaseLost = true;
        controller.abort(new Error("Worker lease is no longer current."));
      }
      return accepted;
    },
  };

  try {
    await handler(job, context);
    if (heartbeatInFlight) await heartbeatInFlight;
    if (leaseLost) return { status: "lease_lost", jobId: job.id };
    const completed = await completeOperationJob(database, lease);
    return { status: completed ? "succeeded" : "lease_lost", jobId: job.id };
  } catch (error) {
    if (heartbeatInFlight) await heartbeatInFlight;
    if (leaseLost) return { status: "lease_lost", jobId: job.id };
    const retryable = controller.signal.aborted || error?.retryable === true;
    const status = await failOperationJob(database, {
      ...lease,
      errorCode: safeErrorCode(error?.code),
      retryable,
    });
    return { status: status ?? "lease_lost", jobId: job.id };
  } finally {
    clearInterval(heartbeatTimer);
    signal?.removeEventListener("abort", abortForShutdown);
  }
}

export async function runWorker({
  database,
  organizationId,
  workerId,
  handlers,
  leaseDurationMs = 30_000,
  heartbeatIntervalMs = Math.floor(leaseDurationMs / 3),
  pollIntervalMs = 1_000,
  signal,
  onResult = () => {},
}) {
  validDuration("pollIntervalMs", pollIntervalMs, 50, 60_000);
  const results = [];
  while (!signal?.aborted) {
    const result = await runWorkerOnce({ database, organizationId, workerId, handlers, leaseDurationMs, heartbeatIntervalMs, signal });
    results.push(result);
    onResult(result);
    if (result.status === "idle") await abortableDelay(pollIntervalMs, signal);
  }
  return results;
}
