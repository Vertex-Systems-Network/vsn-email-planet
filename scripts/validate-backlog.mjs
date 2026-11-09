import { readFile } from "node:fs/promises";

const backlog = JSON.parse(await readFile(new URL("../backlog/tasks.json", import.meta.url), "utf8"));
const required = ["id", "epic", "phase", "title", "outcome", "description", "scope", "priority", "complexity", "owner_agent", "dependencies", "current_status", "acceptance_criteria", "test_plan", "evidence_paths", "verification_level", "target_environment", "last_verified_commit", "created_at", "updated_at", "started_at", "completed_at", "blockers", "external_requirements", "risks", "decisions", "next_action", "notes"];
const ids = new Set();
const errors = [];

for (const task of backlog.tasks ?? []) {
  if (ids.has(task.id)) errors.push(`Duplicate task ID: ${task.id}`);
  ids.add(task.id);
  for (const field of required) {
    if (!(field in task)) errors.push(`${task.id ?? "<unknown>"}: missing ${field}`);
  }
  if (!backlog.allowed_statuses.includes(task.current_status)) errors.push(`${task.id}: illegal status ${task.current_status}`);
  if (task.evidence_paths.some((path) => path.startsWith("/"))) errors.push(`${task.id}: evidence path must be repository-relative`);
  if (task.current_status === "DONE" && (!task.last_verified_commit || !task.evidence_paths.length)) errors.push(`${task.id}: DONE requires verified commit and evidence`);
}

for (const task of backlog.tasks ?? []) {
  for (const dependency of task.dependencies) {
    if (!ids.has(dependency)) errors.push(`${task.id}: unknown dependency ${dependency}`);
  }
  // `status_history` is optional in schema v1; when present, validate it fully.
  if (task.status_history !== undefined) {
    if (!Array.isArray(task.status_history)) errors.push(`${task.id}: status_history must be an array`);
    let lastStatus = null;
    for (const event of task.status_history ?? []) {
    if (event.from !== lastStatus) errors.push(`${task.id}: broken status history at ${event.to}`);
    if (event.from !== null && !backlog.status_transitions[event.from]?.includes(event.to)) {
      errors.push(`${task.id}: illegal status history transition ${event.from} -> ${event.to}`);
    }
    if (!backlog.allowed_statuses.includes(event.to)) errors.push(`${task.id}: history has unknown status ${event.to}`);
      lastStatus = event.to;
    }
    if (lastStatus !== task.current_status) errors.push(`${task.id}: status history does not end at current_status`);
  }
}

for (const [from, targets] of Object.entries(backlog.status_transitions ?? {})) {
  if (!backlog.allowed_statuses.includes(from)) errors.push(`Transition source ${from} is not an allowed status`);
  for (const target of targets) if (!backlog.allowed_statuses.includes(target)) errors.push(`Transition target ${target} is not an allowed status`);
}

if (!backlog.tasks?.length) errors.push("No backlog tasks found");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Backlog valid: ${backlog.tasks.length} tasks, ${ids.size} unique IDs.`);
}
