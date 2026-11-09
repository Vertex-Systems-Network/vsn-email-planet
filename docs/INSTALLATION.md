# Local development

Prerequisites: Node.js 24.15.0 or newer and npm 11. Run `npm ci` from the repository root.

- `npm run dev` starts the Next.js web app at `http://localhost:3000`.
- `npm run dev:api` starts the NestJS health API at `http://localhost:4000/health`.
- `node scripts/dev-server.mjs` starts the synthetic provider/domain/mailbox prototype at `http://localhost:4173`.

The prototype uses published synthetic fixtures only. Fixture bearer identities are public test values, not authentication. No live provider, OAuth, or mailbox-content access is performed.

For PostgreSQL migration/runtime checks, configure `DATABASE_URL` to an authorized disposable PostgreSQL database. `npm run test:postgres` is the real-server smoke path; PGlite unit tests do not replace it. Production deployment is not supported yet; restricted shared hosting is not an assumed target.
