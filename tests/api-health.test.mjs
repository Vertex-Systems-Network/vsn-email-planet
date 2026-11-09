import test from "node:test";
import assert from "node:assert/strict";
import { getProcessHealth } from "../apps/api/src/health-status.ts";

test("API health response claims process health only", () => {
  assert.deepEqual(getProcessHealth(), {
    status: "ok",
    service: "vsn-email-planet-api",
    verification: "process-only",
    providerConnections: false,
    persistence: false,
  });
});
