# Installation wizard specification

The full planned sequence follows master section 40: welcome/deployment, system preflight, database, queue, storage, key/TLS security, initial admin, URLs/webhooks, optional first provider, verification and finish, plus repair/upgrade/restore. It must be re-enterable and non-destructive, never log an initial admin password, and must work without a provider account. No wizard UI or production setup is implemented yet.
