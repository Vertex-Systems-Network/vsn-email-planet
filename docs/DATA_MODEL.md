# Data model boundary draft

The first implementation schema is not yet selected. Every tenant-owned entity will carry an authoritative organization/tenant key. Provider resource IDs are namespaced by provider, connection, mailbox and generation; RFC Message-ID is metadata, not a unique database key. Credentials use encrypted secret references and never appear in logs.

Core groups from the specification: identity/tenancy; provider connections/capabilities; domain/mailbox inventory; message/folder/label/sync cursor; outbox/job lease; incidents; migration/backup; workflow/AI trace; audit. Message content, metadata, credentials and public DNS observations have distinct classification, retention and access policies.
