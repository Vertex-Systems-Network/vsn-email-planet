CREATE TABLE platform_identity_attempt_throttles (
  purpose text NOT NULL CHECK (purpose IN ('login', 'mfa', 'recovery')),
  dimension text NOT NULL CHECK (dimension IN ('account', 'network')),
  key_digest char(64) NOT NULL CHECK (key_digest ~ '^[a-f0-9]{64}$'),
  attempt_count integer NOT NULL CHECK (attempt_count > 0),
  window_started_at timestamptz NOT NULL,
  blocked_until timestamptz,
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (purpose, dimension, key_digest),
  CHECK (expires_at > window_started_at)
);
CREATE INDEX platform_identity_attempt_throttles_expiry_idx
  ON platform_identity_attempt_throttles (expires_at);
