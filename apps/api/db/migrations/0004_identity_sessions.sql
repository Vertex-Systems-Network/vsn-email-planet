ALTER TABLE organization_memberships
  ADD COLUMN version integer NOT NULL DEFAULT 1 CHECK (version > 0);

CREATE FUNCTION increment_membership_version() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.version := OLD.version + 1;
  RETURN NEW;
END;
$$;

CREATE TRIGGER organization_membership_version_update
BEFORE UPDATE OF role, status ON organization_memberships
FOR EACH ROW
EXECUTE FUNCTION increment_membership_version();

CREATE TABLE auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  secret_digest bytea NOT NULL UNIQUE,
  membership_version integer NOT NULL CHECK (membership_version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  idle_expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  revocation_reason text,
  FOREIGN KEY (organization_id, user_id)
    REFERENCES organization_memberships (organization_id, user_id) ON DELETE CASCADE,
  CHECK (octet_length(secret_digest) = 32),
  CHECK (expires_at > created_at),
  CHECK (idle_expires_at > created_at),
  CHECK (revocation_reason IS NULL OR length(trim(revocation_reason)) > 0),
  CHECK (revoked_at IS NOT NULL OR revocation_reason IS NULL)
);

CREATE INDEX auth_sessions_user_active_idx
  ON auth_sessions (user_id, organization_id, expires_at)
  WHERE revoked_at IS NULL;

CREATE INDEX auth_sessions_org_expiry_idx
  ON auth_sessions (organization_id, expires_at)
  WHERE revoked_at IS NULL;
