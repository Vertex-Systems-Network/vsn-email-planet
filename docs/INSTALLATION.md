# Local prototype installation

Prerequisite: Node.js 24.15.0 or newer. From repository root run `npm run dev` and open `http://127.0.0.1:4173`. This serves the dashboard and a read-only local synthetic API. Fixture bearer tokens model tenant boundaries for tests only; they are not real authentication. It does not configure a production database, queue, provider OAuth, TLS, or mail server. Production deployment is not supported yet; normal restricted shared hosting is not an assumed target.
