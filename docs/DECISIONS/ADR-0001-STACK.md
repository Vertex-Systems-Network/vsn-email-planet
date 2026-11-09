# ADR-0001: Stack direction and proof-of-concept

- Status: `PROPOSED`, not production locked.
- Date: 2026-11-09.
- Context: broad provider surface, self-hostable web-first product, live provider access not yet authorized/configured.
- Decision: use dependency-free Node.js 22+ to serve the first synthetic dashboard and built-in test suite. Keep production as a portable TypeScript modular monolith candidate, subject to P0 scorecard.
- Rationale: creates a runnable and testable prototype without introducing dependencies or claiming integration. Stack scorecard must compare Next.js/React + NestJS, DB/ORM, Redis queue, storage, connectors, deployment and maintenance/security factors before pinning production packages.
- Alternatives: Python/Django; Go API with separate TypeScript UI; Next.js full-stack; selected no production winner yet.
- Consequences: no auth/database/provider integration in prototype; test runner works with Node only. Production decisions remain a P0 dependency.
- Revisit when: scorecard, provider SDK audit, self-host constraints and prototype benchmarks are complete.
