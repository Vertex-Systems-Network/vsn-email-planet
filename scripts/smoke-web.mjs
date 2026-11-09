import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const nextBin = new URL("../node_modules/next/dist/bin/next", import.meta.url);
const child = spawn(process.execPath, [nextBin.pathname, "start", "--hostname", "127.0.0.1", "--port", "3000"], {
  cwd: new URL("../apps/web/", import.meta.url),
  stdio: "ignore",
});

try {
  let response;
  let lastError;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Web server exited before responding (${child.exitCode}).`);
    try {
      response = await fetch("http://127.0.0.1:3000/");
      break;
    } catch (error) {
      lastError = error;
      await delay(100);
    }
  }
  if (!response) throw new Error(`Web home route did not connect: ${lastError}`);
  const html = await response.text();
  const requiredText = ["VSN Email Planet", "Demo workspace", "No providers are connected.", "Mailbox inventory"];
  const missing = requiredText.filter((text) => !html.includes(text));
  if (!response.ok || missing.length) throw new Error(`Web route check failed (HTTP ${response.status}); missing: ${missing.join(", ")}`);
  console.log(`Web HTTP smoke passed: / returned ${response.status} with persistent synthetic-data notice and inventory screen.`);
} finally {
  child.kill("SIGTERM");
  await Promise.race([new Promise((resolve) => child.once("exit", resolve)), delay(1500)]);
}
