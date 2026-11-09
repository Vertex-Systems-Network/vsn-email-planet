CREATE TABLE operation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  provider_connection_id uuid,
  operation_id uuid NOT NULL DEFAULT gen_random_uuid(),
  mailbox_key text,
  operation_type text NOT NULL,
  effect_class text NOT NULL,
  idempotency_key text NOT NULL,
  payload_reference text,
  status text NOT NULL DEFAULT 'queued',
  priority smallint NOT NULL DEFAULT 0,
  attempt_count integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 5,
  available_at timestamptz NOT NULL DEFAULT now(),
  lease_owner uuid,
  lease_generation bigint NOT NULL DEFAULT 0,
  lease_expires_at timestamptz,
  dispatch_started_at timestamptz,
  last_error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  FOREIGN KEY (organization_id, provider_connection_id)
    REFERENCES provider_connections (organization_id, id) ON DELETE RESTRICT,
  UNIQUE (organization_id, idempotency_key),
  UNIQUE (organization_id, idempotency_key, id),
  CHECK (length(trim(operation_type)) > 0),
  CHECK (effect_class IN ('read_only', 'internal_mutation', 'external_mutation')),
  CHECK (length(trim(idempotency_key)) BETWEEN 1 AND 255),
  CHECK (mailbox_key IS NULL OR length(trim(mailbox_key)) > 0),
  CHECK (mailbox_key IS NULL OR provider_connection_id IS NOT NULL),
  CHECK (status IN ('queued', 'running', 'retry_wait', 'succeeded', 'dead', 'unknown')),
  CHECK (attempt_count >= 0 AND max_attempts BETWEEN 1 AND 20),
  CHECK (lease_generation >= 0),
  CHECK ((lease_owner IS NULL) = (lease_expires_at IS NULL)),
  CHECK ((status = 'running') = (lease_owner IS NOT NULL AND lease_expires_at IS NOT NULL)),
  CHECK (status <> 'unknown' OR (effect_class = 'external_mutation' AND dispatch_started_at IS NOT NULL)),
  CHECK (status <> 'succeeded' OR completed_at IS NOT NULL)
);

CREATE INDEX operation_jobs_ready_idx ON operation_jobs (priority DESC, available_at, created_at, id)
  WHERE status IN ('queued', 'retry_wait');
CREATE INDEX operation_jobs_expired_lease_idx ON operation_jobs (lease_expires_at, id)
  WHERE status = 'running';
CREATE UNIQUE INDEX operation_jobs_one_running_per_mailbox_idx
  ON operation_jobs (organization_id, provider_connection_id, mailbox_key)
  WHERE status = 'running' AND mailbox_key IS NOT NULL;
CREATE INDEX operation_jobs_unknown_mutation_idx
  ON operation_jobs (organization_id, provider_connection_id, mailbox_key)
  WHERE status = 'unknown' AND effect_class = 'external_mutation' AND mailbox_key IS NOT NULL;

CREATE TABLE event_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  event_type text NOT NULL,
  idempotency_key text NOT NULL,
  event_version smallint NOT NULL DEFAULT 1,
  event_sequence integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  publish_attempts integer NOT NULL DEFAULT 0,
  publish_lease_owner uuid,
  publish_lease_generation bigint NOT NULL DEFAULT 0,
  publish_lease_expires_at timestamptz,
  last_error_code text,
  FOREIGN KEY (organization_id, idempotency_key, aggregate_id)
    REFERENCES operation_jobs (organization_id, idempotency_key, id) ON DELETE RESTRICT,
  UNIQUE (organization_id, idempotency_key, event_type, event_sequence),
  CHECK (length(trim(aggregate_type)) > 0),
  CHECK (length(trim(event_type)) > 0),
  CHECK (event_version > 0),
  CHECK (event_sequence >= 0),
  CHECK (publish_attempts >= 0),
  CHECK (publish_lease_generation >= 0),
  CHECK ((publish_lease_owner IS NULL) = (publish_lease_expires_at IS NULL))
);

CREATE INDEX event_outbox_pending_idx ON event_outbox (created_at, id)
  WHERE published_at IS NULL;
