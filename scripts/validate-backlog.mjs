import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const required = ["id", "epic", "phase", "title", "outcome", "description", "scope", "priority", "complexity", "owner_agent", "dependencies", "current_status", "acceptance_criteria", "test_plan", "evidence_paths", "verification_level", "target_environment", "last_verified_commit", "created_at", "updated_at", "started_at", "completed_at", "blockers", "external_requirements", "risks", "decisions", "next_action", "notes"];
const blockedStatuses = new Set(["BLOCKED_EXTERNAL_VALIDATION", "BLOCKED_AUTH", "BLOCKED_TECHNICAL"]);
const placeholderActions = [
  /^inspect upstream requirements and implement\b/i,
  /^continue resolving documented setup and infrastructure gaps\b/i,
  /^do not start until dependencies and phase gate are met; inspect the master spec\b/i,
];

export function validateBacklog(backlog) {
  const errors = [];
  const tasks = Array.isArray(backlog?.tasks) ? backlog.tasks : [];
  const statuses = Array.isArray(backlog?.allowed_statuses) ? backlog.allowed_statuses : [];
  const transitions = backlog?.status_transitions ?? {};
  const byId = new Map();

  if (!tasks.length) errors.push("No backlog tasks found");
  for (const task of tasks) {
    const id = task?.id ?? "<unknown>";
    if (byId.has(id)) errors.push(`Duplicate task ID: ${id}`);
    byId.set(id, task);
    for (const field of required) if (!(field in (task ?? {}))) errors.push(`${id}: missing ${field}`);
    if (!statuses.includes(task?.current_status)) errors.push(`${id}: illegal status ${task?.current_status}`);
    for (const field of ["dependencies", "acceptance_criteria", "test_plan", "evidence_paths", "blockers", "external_requirements", "risks", "decisions"]) {
      if (!Array.isArray(task?.[field])) errors.push(`${id}: ${field} must be an array`);
    }
    const evidence = Array.isArray(task?.evidence_paths) ? task.evidence_paths : [];
    if (new Set(evidence).size !== evidence.length) errors.push(`${id}: duplicate evidence path`);
    if (evidence.some((path) => typeof path !== "string" || path.startsWith("/"))) errors.push(`${id}: evidence path must be a repository-relative string`);
    const deps = Array.isArray(task?.dependencies) ? task.dependencies : [];
    if (new Set(deps).size !== deps.length) errors.push(`${id}: duplicate dependency`);
    if (deps.includes(id)) errors.push(`${id}: task cannot depend on itself`);

    if (typeof task?.next_action !== "string" || task.next_action.trim().length < 12) {
      errors.push(`${id}: next_action must name a concrete next step`);
    } else if (["READY", "IN_PROGRESS", "IMPLEMENTED_UNVERIFIED", "TESTING", "PARTIALLY_VERIFIED"].includes(task.current_status)
      && placeholderActions.some((pattern) => pattern.test(task.next_action.trim()))) {
      errors.push(`${id}: active task has a placeholder next_action`);
    }

    const blockers = Array.isArray(task?.blockers) ? task.blockers : [];
    if (blockedStatuses.has(task?.current_status) && blockers.length === 0) errors.push(`${id}: blocked status requires a blocker`);
    if (["VERIFIED", "DONE"].includes(task?.current_status) && blockers.length > 0) errors.push(`${id}: verified task cannot retain blockers`);
    if (task?.current_status === "DONE" && (!task.last_verified_commit || evidence.length === 0)) errors.push(`${id}: DONE requires verified commit and evidence`);

    // status_history is optional in backlog schema v1; when present it must be complete.
    if (task?.status_history !== undefined) {
      if (!Array.isArray(task.status_history)) errors.push(`${id}: status_history must be an array`);
      let lastStatus = null;
      for (const event of Array.isArray(task.status_history) ? task.status_history : []) {
        if (event.from !== lastStatus) errors.push(`${id}: broken status history at ${event.to}`);
        if (event.from !== null && !transitions[event.from]?.includes(event.to)) errors.push(`${id}: illegal status history transition ${event.from} -> ${event.to}`);
        if (!statuses.includes(event.to)) errors.push(`${id}: history has unknown status ${event.to}`);
        if (event.evidence == null || event.evidence === "") errors.push(`${id}: status transition ${event.to} has no evidence`);
        lastStatus = event.to;
      }
      if (lastStatus !== task.current_status) errors.push(`${id}: status history does not end at current_status`);
    }
  }

  for (const task of tasks) {
    for (const dependency of Array.isArray(task?.dependencies) ? task.dependencies : []) {
      if (!byId.has(dependency)) errors.push(`${task.id}: unknown dependency ${dependency}`);
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const visit = (id, path = []) => {
    if (visiting.has(id)) {
      errors.push(`Dependency cycle: ${[...path, id].join(" -> ")}`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dependency of byId.get(id)?.dependencies ?? []) if (byId.has(dependency)) visit(dependency, [...path, id]);
    visiting.delete(id);
    visited.add(id);
  };
  for (const id of byId.keys()) visit(id);

  for (const [from, targets] of Object.entries(transitions)) {
    if (!statuses.includes(from)) errors.push(`Transition source ${from} is not an allowed status`);
    if (!Array.isArray(targets)) errors.push(`Transitions from ${from} must be an array`);
    for (const target of Array.isArray(targets) ? targets : []) if (!statuses.includes(target)) errors.push(`Transition target ${target} is not an allowed status`);
  }
  return errors;
}

async function main() {
  const backlog = JSON.parse(await readFile(new URL("../backlog/tasks.json", import.meta.url), "utf8"));
  const errors = validateBacklog(backlog);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`Backlog valid: ${backlog.tasks.length} tasks; no duplicate evidence, stale blocking state, or dependency cycles.`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
