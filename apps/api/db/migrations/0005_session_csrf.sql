ALTER TABLE auth_sessions
  ADD COLUMN csrf_digest bytea;

ALTER TABLE auth_sessions
  ADD CONSTRAINT auth_sessions_csrf_digest_length_check
  CHECK (csrf_digest IS NULL OR octet_length(csrf_digest) = 32);

CREATE INDEX auth_sessions_active_csrf_lookup_idx
  ON auth_sessions (id, user_id, organization_id)
  WHERE revoked_at IS NULL AND csrf_digest IS NOT NULL;
