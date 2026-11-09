import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";

const root = fileURLToPath(new URL("../", import.meta.url));
const baseRevision = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).stdout.trim();
const dirty = spawnSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).stdout.trim().length > 0;
const commands = [
  ["npm ci", ["ci"]],
  ["npm run typecheck", ["run", "typecheck"]],
  ["npm test", ["test"]],
  ["npm run check:backlog", ["run", "check:backlog"]],
  ["npm run build", ["run", "build"]],
  ["npm run smoke:web", ["run", "smoke:web"]],
  ["npm run smoke:api", ["run", "smoke:api"]],
  ["npm audit --audit-level=high", ["audit", "--audit-level=high"]],
];
const results = [];

for (const [label, args] of commands) {
  const started = new Date().toISOString();
  const run = spawnSync("npm", args, { cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  const ended = new Date().toISOString();
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
  results.push({ label, started, ended, exitCode: run.status ?? 1, output });
  console.log(`${run.status === 0 ? "PASS" : "FAIL"} ${label} (${started} – ${ended})`);
  if (run.status !== 0) console.log(output.split("\n").slice(-18).join("\n"));
}

const lines = [
  "# Local verification evidence",
  "",
  `Recorded: ${new Date().toISOString()}`,
  `Node: ${process.version}`,
  `npm: ${spawnSync("npm", ["--version"], { cwd: root, encoding: "utf8" }).stdout.trim()}`,
  `Git base revision at run: ${baseRevision || "unknown"}.`,
  `Working tree at verification start: ${dirty ? "contains uncommitted changes" : "clean"}.`,
  "Environment: local synthetic development environment; no external provider credentials or private mailbox data.",
  "",
];

for (const result of results) {
  lines.push(`## ${result.label}`, "", `- Status: ${result.exitCode === 0 ? "PASS" : "FAIL"}`, `- Started: ${result.started}`, `- Ended: ${result.ended}`, `- Exit code: ${result.exitCode}`, "", "```text", ...(result.output ? result.output.split("\n").slice(-24) : ["No command output."]), "```", "");
}

const reportDate = new Date().toISOString();
const reportStamp = reportDate.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const reportSha = (baseRevision || "uncommitted").slice(0, 7);
const reportPath = new URL(`../docs/TEST_EVIDENCE/verification-${reportStamp}-${reportSha}.md`, import.meta.url);
await mkdir(new URL("../docs/TEST_EVIDENCE/", import.meta.url), { recursive: true });
await writeFile(reportPath, `${lines.join("\n").trimEnd()}\n`);
if (results.some((result) => result.exitCode !== 0)) process.exitCode = 1;
