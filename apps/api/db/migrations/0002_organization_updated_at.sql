ALTER TABLE organizations
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

COMMENT ON COLUMN organizations.updated_at IS 'UTC timestamp of the most recent organization metadata update.';
