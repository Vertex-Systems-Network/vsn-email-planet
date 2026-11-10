CREATE TABLE platform_bootstrap_claims (
  id smallint PRIMARY KEY DEFAULT 1,
  organization_id uuid NOT NULL,
  user_id uuid NOT NULL,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  CHECK (id = 1),
  FOREIGN KEY (organization_id, user_id)
    REFERENCES organization_memberships (organization_id, user_id) ON DELETE RESTRICT,
  UNIQUE (organization_id, user_id)
);
