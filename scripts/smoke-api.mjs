import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const child = spawn(process.execPath, ["apps/api/dist/main.js"], {
  cwd: new URL("../", import.meta.url),
  env: { ...process.env, API_PORT: "4000" },
  stdio: "ignore",
});

try {
  let response;
  let lastError;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`API exited before responding (${child.exitCode}).`);
    try {
      response = await fetch("http://127.0.0.1:4000/health");
      break;
    } catch (error) {
      lastError = error;
      await delay(100);
    }
  }
  if (!response) throw new Error(`API health request did not connect: ${lastError}`);
  const body = await response.json();
  if (!response.ok || body.status !== "ok" || body.verification !== "process-only" || body.providerConnections !== false || body.persistence !== false) {
    throw new Error(`Unexpected API health result: ${JSON.stringify(body)}`);
  }
  console.log("API HTTP smoke passed: /health confirms process status only; no provider/database health claimed.");
} finally {
  child.kill("SIGTERM");
}
