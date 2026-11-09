# Research papers and standards

This register separates peer-reviewed/research papers from normative standards. Findings are scoped to the cited work; they are inputs to design, not proof that VSN's implementation is correct.

## Reviewed research

### Delivery, consistency, and determinism: rethinking guarantees in distributed stream processing

- Citation: Tyler Akidau et al., arXiv:1907.06250 (2019), [paper](https://arxiv.org/abs/1907.06250).
- Finding: “Exactly once” is not a sufficient standalone description of processing guarantees. The paper offers a framework for reasoning about delivery, consistency, and determinism separately.
- Application: represent provider ingestion as replayable work with explicit deduplication/idempotency keys, checkpoint progress, and externally visible side-effect policy. A retry must not silently imply that provider mutations were exactly once.
- Limitation: this is a stream-processing framework discussion, not an email-provider implementation or a correctness proof for our schema/worker design. Provider APIs may have different cursor, replay, and mutation semantics.

### Efficient Synchronization of State-based CRDTs

- Citation: Almeida et al., arXiv:1803.02750 (2018), [paper](https://arxiv.org/abs/1803.02750).
- Finding: state-based CRDT synchronization can reduce communication by transmitting suitable deltas, while preserving the algebraic merge properties under the paper's assumptions.
- Application: useful background when evaluating offline or multi-replica synchronization for user-owned metadata such as labels or local annotations.
- Limitation: email provider state is authoritative, mutable, and API-specific; this paper does not justify merging provider flags, deletion state, folder membership, or message bodies as CRDTs. No CRDT is selected for the current architecture.

### Fine-Grained Isolation for Scalable, Dynamic, Multi-tenant Edge Clouds

- Citation: Ren et al., USENIX ATC 2020, [paper](https://www.usenix.org/conference/atc20/presentation/ren).
- Finding: multi-tenant systems need explicit isolation boundaries across shared resources; the work studies fine-grained isolation for a constrained edge-cloud environment.
- Application: reinforces treating tenant boundaries as a cross-layer invariant (database relationships, authorization, cache/job keys, object storage, logs), not merely a UI filter. The existing composite foreign keys cover only relational linkage and do not establish complete tenant isolation.
- Limitation: its system and threat model differ from a SaaS email control plane. It does not prescribe a PostgreSQL row-level security design or validate VSN's authorization model.

## Normative security references

### OAuth 2.0 Security Best Current Practice

- Citation: RFC 9700, IETF (January 2025), [RFC](https://datatracker.ietf.org/doc/html/rfc9700).
- Finding: consolidates current OAuth threat mitigations and recommends protections including authorization code flow with PKCE and secure client authentication.
- Application: use as a baseline when designing provider authorization, redirect handling, token storage and refresh. Pair with the more specific browser-app guidance in `STANDARDS.md` and each provider's policy.
- Limitation: an RFC recommendation is not provider approval, a security assessment, or a substitute for implementation review and testing.

## Remaining coverage gaps

Research remains open for email MIME/parser security, backup/restore and retention, human approval and human-AI interaction, email threading, search indexing, drift detection, and accessibility. No result in this register closes buyer validation, provider sandbox validation, or the P0 exit gate.
