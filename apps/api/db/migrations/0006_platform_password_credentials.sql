CREATE TABLE platform_password_credentials (
  user_id uuid PRIMARY KEY REFERENCES platform_users(id) ON DELETE CASCADE,
  password_verifier text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  password_changed_at timestamptz NOT NULL DEFAULT now(),
  CHECK (password_verifier ~ '^scrypt-v1[$]32768[$]8[$]3[$][A-Za-z0-9_-]{22}[$][A-Za-z0-9_-]{43}$')
);
