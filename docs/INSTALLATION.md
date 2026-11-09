# Installation

## Local demo

Requires Node `>=22.14 <25` and npm `>=11 <12`. Run `npm ci`, then `npm run dev`; open `http://localhost:3000`. This launches a synthetic dashboard with no provider connectivity. `npm run dev:api` starts an independent health process at `http://localhost:4000/health`.

This is not a production installation. Database, Redis, authentication, TLS, secret management, backups, workers and provider connections are not implemented yet.
