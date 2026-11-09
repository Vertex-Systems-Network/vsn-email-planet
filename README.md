# VSN Email Planet

VSN Email Planet is a web-first, self-hostable email operations control plane. It is designed to coordinate provider administration and separately authorized mailbox access without pretending that one credential grants every capability.

> **Early development:** the current web app is a local synthetic-data prototype. It does not connect to mail providers, read or send email, administer real mailboxes, or provide production authentication. Every sample metric is labeled as demo data.

## Start locally

Requirements: Node.js `>=22.14 <25`, npm `>=11 <12`.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The API health service can be started separately with `npm run dev:api` at `http://localhost:4000/health`.

## Verify

```sh
npm run typecheck
npm test
npm run check:backlog
npm run build
```

## Project state

Read the [project state](docs/PROJECT_STATE.md), [exact next action](docs/NEXT_ACTION.md), [handoff](docs/HANDOFF.md), [roadmap](docs/ROADMAP.md), and [master specification](AI_Native_Central_Email_Platform_Master_Prompt.md). No real provider connection or live mailbox access is available or claimed.
