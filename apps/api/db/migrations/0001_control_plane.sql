CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (slug = lower(slug)),
  CHECK (length(slug) BETWEEN 2 AND 63),
  CHECK (length(trim(display_name)) > 0)
);

CREATE TABLE platform_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  display_name text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (email = lower(email)),
  CHECK (email LIKE '%_@_%._%'),
  CHECK (status IN ('active', 'disabled', 'pending'))
);

CREATE TABLE organization_memberships (
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES platform_users(id) ON DELETE RESTRICT,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id),
  CHECK (role IN ('owner', 'admin', 'operator', 'auditor', 'viewer')),
  CHECK (status IN ('active', 'suspended', 'invited'))
);

CREATE INDEX organization_memberships_user_idx ON organization_memberships (user_id, organization_id);

CREATE TABLE provider_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  provider_key text NOT NULL,
  external_account_id text NOT NULL,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  credential_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, provider_key, external_account_id),
  CHECK (provider_key IN ('cpanel', 'whm', 'plesk', 'directadmin', 'google', 'microsoft', 'imap')),
  CHECK (status IN ('pending', 'active', 'reauth_required', 'suspended', 'disconnected')),
  CHECK (length(trim(display_name)) > 0)
);

CREATE INDEX provider_connections_org_status_idx ON provider_connections (organization_id, status);

CREATE TABLE connection_scopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  provider_connection_id uuid NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  access_level text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (organization_id, provider_connection_id)
    REFERENCES provider_connections (organization_id, id) ON DELETE RESTRICT,
  UNIQUE (organization_id, provider_connection_id, resource_type, resource_id),
  CHECK (resource_type IN ('organization', 'domain', 'mailbox', 'folder')),
  CHECK (access_level IN ('metadata_read', 'content_read', 'draft_write', 'send', 'admin'))
);

CREATE INDEX connection_scopes_resource_idx ON connection_scopes (organization_id, resource_type, resource_id);

CREATE TABLE connector_capabilities (
  organization_id uuid NOT NULL,
  provider_connection_id uuid NOT NULL,
  capability_key text NOT NULL,
  availability text NOT NULL,
  observed_at timestamptz NOT NULL DEFAULT now(),
  evidence_reference text,
  PRIMARY KEY (organization_id, provider_connection_id, capability_key),
  FOREIGN KEY (organization_id, provider_connection_id)
    REFERENCES provider_connections (organization_id, id) ON DELETE CASCADE,
  CHECK (availability IN ('supported', 'unsupported', 'unknown', 'permission_required', 'temporarily_unavailable'))
);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  actor_user_id uuid REFERENCES platform_users(id) ON DELETE SET NULL,
  action_key text NOT NULL,
  outcome text NOT NULL,
  target_type text,
  target_id text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  safe_attributes jsonb NOT NULL DEFAULT '{}'::jsonb,
  CHECK (outcome IN ('allowed', 'denied', 'succeeded', 'failed')),
  CHECK (jsonb_typeof(safe_attributes) = 'object')
);

CREATE INDEX audit_events_org_time_idx ON audit_events (organization_id, occurred_at DESC, id DESC);
CREATE INDEX audit_events_actor_time_idx ON audit_events (organization_id, actor_user_id, occurred_at DESC);
