# Upgrade and rollback plan

No persistent database schema or production upgrade exists yet. Future releases must preflight versions and storage, take/verify an application backup, use forward-compatible migrations, record progress, support safe re-entry after interruption and document conditions where rollback is unsafe. Test from each supported previous version before release.
