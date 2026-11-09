const leaseDurationMs = (value) => {
  if (!Number.isSafeInteger(value) || value < 1_000 || value > 15 * 60_000) {
    throw new RangeError("leaseDurationMs must be an integer from 1000 through 900000.");
  }
  return value;
};
const affectedRows = (result) => result.rowCount ?? result.affectedRows ?? 0;

async function withTransaction(database, callback) {
  const client = typeof database.connect === "function" ? await database.connect() : database;
  const release = client !== database && typeof client.release === "function";
  await client.query("BEGIN");
  try {
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    if (release) client.release();
  }
}

const jobIdentityMatches = (row, input) => row.operation_type === input.operationType
  && row.effect_class === input.effectClass
  && row.mailbox_key === (input.mailboxKey ?? null)
  && row.provider_connection_id === (input.providerConnectionId ?? null);

export async function enqueueOperationJob(database, input) {
  const { organizationId, operationType, effectClass, idempotencyKey } = input;
  if (!organizationId || !operationType?.trim() || !idempotencyKey?.trim()) throw new TypeError("organizationId, operationType, and idempotencyKey are required.");
  if (!["read_only", "internal_mutation", "external_mutation"].includes(effectClass)) throw new TypeError("Unsupported effectClass.");
  if (input.mailboxKey && !input.providerConnectionId) throw new TypeError("Mailbox jobs require a providerConnectionId.");
  const maxAttempts = input.maxAttempts ?? 5;
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 20) throw new RangeError("maxAttempts must be from 1 through 20.");
  const priority = input.priority ?? 0;
  if (!Number.isInteger(priority) || priority < -100 || priority > 100) throw new RangeError("priority must be from -100 through 100.");

  return withTransaction(database, async (client) => {
    const inserted = await client.query(
      `INSERT INTO operation_jobs
        (organization_id, provider_connection_id, mailbox_key, operation_type, effect_class, idempotency_key, payload_reference, max_attempts, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (organization_id, idempotency_key) DO NOTHING
       RETURNING *`,
      [organizationId, input.providerConnectionId ?? null, input.mailboxKey ?? null, operationType, effectClass, idempotencyKey, input.payloadReference ?? null, maxAttempts, priority],
    );

    if (inserted.rows[0]) {
      await client.query(
        `INSERT INTO event_outbox (organization_id, aggregate_type, aggregate_id, event_type, idempotency_key)
         VALUES ($1, 'operation_job', $2, 'operation.job.queued', $3)`,
        [organizationId, inserted.rows[0].id, idempotencyKey],
      );
      return { job: inserted.rows[0], created: true };
    }

    const existing = await client.query(
      "SELECT * FROM operation_jobs WHERE organization_id = $1 AND idempotency_key = $2 FOR UPDATE",
      [organizationId, idempotencyKey],
    );
    const job = existing.rows[0];
    if (!job || !jobIdentityMatches(job, input)) throw new Error("Idempotency key is already bound to a different operation.");
    return { job, created: false };
  });
}

export async function claimNextOperationJob(database, { workerId, leaseDurationMs: duration, organizationId } = {}) {
  if (!workerId || !organizationId) throw new TypeError("workerId and organizationId are required.");
  const durationMs = leaseDurationMs(duration);
  return withTransaction(database, async (client) => {
    const reclaimedMutations = await client.query(
      `UPDATE operation_jobs
       SET status = 'unknown', lease_owner = NULL, lease_expires_at = NULL,
           last_error_code = 'lease_expired_after_dispatch', updated_at = now()
       WHERE status = 'running' AND lease_expires_at <= now()
         AND effect_class = 'external_mutation' AND dispatch_started_at IS NOT NULL
         AND organization_id = $1
       RETURNING id`,
      [organizationId],
    );
    const reclaimedSafeJobs = await client.query(
      `UPDATE operation_jobs
       SET status = CASE WHEN attempt_count < max_attempts THEN 'retry_wait' ELSE 'dead' END,
           available_at = CASE WHEN attempt_count < max_attempts THEN now() ELSE available_at END,
           lease_owner = NULL, lease_expires_at = NULL,
           dispatch_started_at = NULL, last_error_code = 'lease_expired_before_external_effect', updated_at = now()
       WHERE status = 'running' AND lease_expires_at <= now()
         AND (effect_class <> 'external_mutation' OR dispatch_started_at IS NULL)
         AND organization_id = $1
       RETURNING id`,
      [organizationId],
    );

    const candidate = await client.query(
      `SELECT job.id
       FROM operation_jobs AS job
       WHERE job.status IN ('queued', 'retry_wait') AND job.available_at <= now()
         AND job.attempt_count < job.max_attempts
         AND job.organization_id = $1
         AND NOT EXISTS (
           SELECT 1 FROM operation_jobs AS active
           WHERE active.status = 'running'
             AND active.organization_id = job.organization_id
             AND active.provider_connection_id IS NOT DISTINCT FROM job.provider_connection_id
             AND active.mailbox_key IS NOT DISTINCT FROM job.mailbox_key
             AND job.mailbox_key IS NOT NULL
         )
         AND NOT (
           job.effect_class = 'external_mutation' AND job.mailbox_key IS NOT NULL
           AND EXISTS (
             SELECT 1 FROM operation_jobs AS uncertain
             WHERE uncertain.status = 'unknown' AND uncertain.effect_class = 'external_mutation'
               AND uncertain.organization_id = job.organization_id
               AND uncertain.provider_connection_id IS NOT DISTINCT FROM job.provider_connection_id
               AND uncertain.mailbox_key = job.mailbox_key
           )
         )
       ORDER BY job.priority DESC, job.available_at, job.created_at, job.id
       FOR UPDATE OF job SKIP LOCKED LIMIT 1`,
      [organizationId],
    );

    if (!candidate.rows[0]) return { job: null, reclaimed: affectedRows(reclaimedMutations) + affectedRows(reclaimedSafeJobs) };
    const claimed = await client.query(
      `UPDATE operation_jobs
       SET status = 'running', lease_owner = $2, lease_generation = lease_generation + 1,
           lease_expires_at = now() + ($3::bigint * interval '1 millisecond'),
           attempt_count = attempt_count + 1, updated_at = now()
       WHERE id = $1 AND status IN ('queued', 'retry_wait')
       RETURNING *`,
      [candidate.rows[0].id, workerId, durationMs],
    );
    return { job: claimed.rows[0] ?? null, reclaimed: affectedRows(reclaimedMutations) + affectedRows(reclaimedSafeJobs) };
  });
}

export async function heartbeatOperationJob(database, { jobId, organizationId, workerId, leaseGeneration, leaseDurationMs: duration }) {
  const result = await database.query(
    `UPDATE operation_jobs
     SET lease_expires_at = now() + ($5::bigint * interval '1 millisecond'), updated_at = now()
     WHERE id = $1 AND organization_id = $2 AND status = 'running' AND lease_owner = $3 AND lease_generation = $4 AND lease_expires_at > now()
     RETURNING lease_expires_at`,
    [jobId, organizationId, workerId, leaseGeneration, leaseDurationMs(duration)],
  );
  return affectedRows(result) === 1;
}

export async function markExternalDispatchStarted(database, { jobId, organizationId, workerId, leaseGeneration }) {
  const result = await database.query(
    `UPDATE operation_jobs
     SET dispatch_started_at = now(), updated_at = now()
     WHERE id = $1 AND organization_id = $2 AND status = 'running' AND effect_class = 'external_mutation'
       AND lease_owner = $3 AND lease_generation = $4 AND lease_expires_at > now()
     RETURNING id`,
    [jobId, organizationId, workerId, leaseGeneration],
  );
  return affectedRows(result) === 1;
}

export async function completeOperationJob(database, { jobId, organizationId, workerId, leaseGeneration }) {
  const result = await database.query(
    `UPDATE operation_jobs
     SET status = 'succeeded', completed_at = now(), lease_owner = NULL, lease_expires_at = NULL, updated_at = now()
     WHERE id = $1 AND organization_id = $2 AND status = 'running' AND lease_owner = $3
       AND lease_generation = $4 AND lease_expires_at > now()
       AND (effect_class <> 'external_mutation' OR dispatch_started_at IS NOT NULL)
     RETURNING id`,
    [jobId, organizationId, workerId, leaseGeneration],
  );
  return affectedRows(result) === 1;
}

export async function failOperationJob(database, { jobId, organizationId, workerId, leaseGeneration, errorCode, retryable }) {
  if (!/^[a-z][a-z0-9_.-]{0,95}$/.test(errorCode ?? "")) throw new TypeError("errorCode must be a safe lowercase code.");
  const result = await database.query(
    `UPDATE operation_jobs
     SET status = CASE
           WHEN effect_class = 'external_mutation' AND dispatch_started_at IS NOT NULL THEN 'unknown'
           WHEN $5::boolean AND attempt_count < max_attempts THEN 'retry_wait'
           ELSE 'dead'
         END,
         available_at = CASE WHEN $5::boolean AND attempt_count < max_attempts THEN now() + (LEAST(300000::numeric, 1000 * power(2::numeric, LEAST(attempt_count, 8)))::double precision * interval '1 millisecond') ELSE available_at END,
         lease_owner = NULL, lease_expires_at = NULL, last_error_code = $6, updated_at = now()
     WHERE id = $1 AND organization_id = $2 AND status = 'running' AND lease_owner = $3
       AND lease_generation = $4 AND lease_expires_at > now()
     RETURNING status`,
    [jobId, organizationId, workerId, leaseGeneration, Boolean(retryable), errorCode],
  );
  return result.rows[0]?.status ?? null;
}

export async function resolveUnknownExternalMutation(database, { jobId, organizationId, outcome }) {
  if (!['applied', 'confirmed_not_applied'].includes(outcome)) throw new TypeError("outcome must be applied or confirmed_not_applied.");
  const status = outcome === "applied" ? "succeeded" : "queued";
  const result = await database.query(
    `UPDATE operation_jobs
     SET status = $3, completed_at = CASE WHEN $3 = 'succeeded' THEN now() ELSE NULL END,
         dispatch_started_at = NULL, available_at = now(), last_error_code = NULL, updated_at = now()
     WHERE id = $1 AND organization_id = $2 AND status = 'unknown' AND effect_class = 'external_mutation'
     RETURNING id`,
    [jobId, organizationId, status],
  );
  return affectedRows(result) === 1;
}

export async function claimOutboxEvents(database, { organizationId, workerId, limit = 50, leaseDurationMs: duration = 30_000 }) {
  if (!organizationId || !workerId) throw new TypeError("organizationId and workerId are required.");
  if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new RangeError("limit must be from 1 through 500.");
  return withTransaction(database, async (client) => {
    const claimed = await client.query(
      `WITH candidates AS (
         SELECT id FROM event_outbox
         WHERE organization_id = $2 AND published_at IS NULL
           AND (publish_lease_expires_at IS NULL OR publish_lease_expires_at <= now())
         ORDER BY created_at, id FOR UPDATE SKIP LOCKED LIMIT $1
       )
       UPDATE event_outbox AS event
       SET publish_lease_owner = $3, publish_lease_generation = publish_lease_generation + 1,
           publish_lease_expires_at = now() + ($4::bigint * interval '1 millisecond'),
           publish_attempts = publish_attempts + 1
       FROM candidates WHERE event.id = candidates.id
       RETURNING event.*`,
       [limit, organizationId, workerId, leaseDurationMs(duration)],
    );
    return claimed.rows;
  });
}

export async function markOutboxEventPublished(database, { eventId, organizationId, workerId, leaseGeneration }) {
  const result = await database.query(
    `UPDATE event_outbox
     SET published_at = now(), publish_lease_owner = NULL, publish_lease_expires_at = NULL
     WHERE id = $1 AND organization_id = $2 AND publish_lease_owner = $3 AND publish_lease_generation = $4
       AND publish_lease_expires_at > now() AND published_at IS NULL
     RETURNING id`,
    [eventId, organizationId, workerId, leaseGeneration],
  );
  return affectedRows(result) === 1;
}
