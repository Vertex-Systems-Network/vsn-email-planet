import test from "node:test";
import assert from "node:assert/strict";
import { validateBacklog } from "../scripts/validate-backlog.mjs";

function task(overrides = {}) {
  return {
    id: "P1-01", epic: "P1", phase: "P1", title: "Example", outcome: "Example outcome", description: "Example task",
    scope: ["one bounded increment"], priority: "P1", complexity: "S", owner_agent: null, dependencies: [],
    current_status: "READY", acceptance_criteria: ["Observable result"], test_plan: ["npm test"], evidence_paths: [],
    verification_level: "NOT_YET_TESTED", target_environment: "LOCAL", last_verified_commit: null, created_at: "2026-11-10",
    updated_at: "2026-11-10", started_at: null, completed_at: null, blockers: [], external_requirements: [], risks: [], decisions: [],
    next_action: "Add an integration test for the bounded behavior", notes: "No completion claimed.",
    status_history: [{ from: null, to: "READY", changed_at: "2026-11-10T00:00:00Z", actor: "test", evidence: "fixture" }],
    ...overrides,
  };
}

function backlog(tasks) {
  return {
    allowed_statuses: ["READY", "BLOCKED_TECHNICAL", "VERIFIED"],
    status_transitions: { READY: ["BLOCKED_TECHNICAL", "VERIFIED"], BLOCKED_TECHNICAL: ["READY"], VERIFIED: ["READY"] },
    tasks,
  };
}

test("accepts an actionable task without stale or duplicated evidence", () => {
  assert.deepEqual(validateBacklog(backlog([task()])), []);
});

test("rejects repeated evidence paths", () => {
  const errors = validateBacklog(backlog([task({ evidence_paths: ["docs/report.md", "docs/report.md"] })]));
  assert.ok(errors.some((error) => error.includes("duplicate evidence path")));
});

test("rejects a blocked task with no recorded blocker", () => {
  const blocked = task({
    current_status: "BLOCKED_TECHNICAL",
    next_action: "Try the local fallback after the browser connection fails",
    status_history: [
      { from: null, to: "READY", changed_at: "2026-11-10T00:00:00Z", actor: "test", evidence: "fixture" },
      { from: "READY", to: "BLOCKED_TECHNICAL", changed_at: "2026-11-10T00:01:00Z", actor: "test", evidence: "fixture" },
    ],
  });
  assert.ok(validateBacklog(backlog([blocked])).some((error) => error.includes("blocked status requires a blocker")));
});

test("rejects vague active actions and dependency cycles", () => {
  const a = task({ dependencies: ["P1-02"], next_action: "Inspect upstream requirements and implement the task" });
  const b = task({ id: "P1-02", dependencies: ["P1-01"], status_history: [{ from: null, to: "READY", changed_at: "2026-11-10T00:00:00Z", actor: "test", evidence: "fixture" }] });
  const errors = validateBacklog(backlog([a, b]));
  assert.ok(errors.some((error) => error.includes("placeholder next_action")));
  assert.ok(errors.some((error) => error.includes("Dependency cycle")));
});
