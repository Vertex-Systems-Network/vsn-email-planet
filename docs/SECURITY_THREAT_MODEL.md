# Initial threat model

## Assets
OAuth/API tokens, IMAP credentials, tenant membership/policy, message metadata/body/attachments, drafts, provider mutation authority, encryption keys, audit trails and backup manifests.

## Threat boundaries
Untrusted browser inputs; tenant-supplied provider endpoints (SSRF/DNS rebinding); email HTML/MIME and attachments; webhook callers; queue payloads; model outputs; shared object/search stores; operator access.

## Required controls before live mail data
OAuth authorization-code + PKCE and state/nonce checks; least privilege; encrypted secrets; tenant authorization on every request/job/query/object; request and webhook replay protection; outbound action policy and idempotency; safe MIME/HTML and attachment handling; egress controls; log redaction; key recovery; adversarial isolation tests. RFC 9700 is the OAuth security baseline. The synthetic prototype uses publicly visible fixture bearer tokens and in-memory records; its tenant-filtering policy is a testable skeleton, not authentication or production isolation. It has no live-data capability and must not be represented as secure production software.

## Open risks
Gmail restricted-scope verification/assessment cost; provider admin delegation differences; arbitrary IMAP SSRF; key-loss recovery; migration fidelity; operational requirements for long-lived workers. Track in `backlog/tasks.json` and research docs.
