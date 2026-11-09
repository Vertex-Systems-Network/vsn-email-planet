# Upgrade and rollback plan

No persistent production schema exists. Once introduced, upgrades require an explicit supported-version matrix, preflight, verified backup, idempotent migrations, compatible rollback strategy, maintenance/worker coordination and post-upgrade health checks. Never infer rollback safety from reversible application code when data migrations or external provider state changed.
