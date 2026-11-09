import { readFile } from 'node:fs/promises';
const load = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [tasks, epics, gates, banks] = await Promise.all([
  load('../backlog/tasks.json'), load('../backlog/epics.json'), load('../backlog/phase-gates.json'), load('../knowledge/banks.json')
]);
const errors = [];
const taskIds = new Set();
for (const task of tasks.tasks) {
  if (taskIds.has(task.id)) errors.push(`Duplicate task id: ${task.id}`);
  taskIds.add(task.id);
  for (const field of ['id','epic','phase','title','outcome','description','priority','complexity','current_status','acceptance_criteria','test_plan','evidence_paths','verification_level','target_environment','next_action']) {
    if (!(field in task)) errors.push(`${task.id}: missing ${field}`);
  }
  if (!tasks.allowed_statuses.includes(task.current_status)) errors.push(`${task.id}: invalid status ${task.current_status}`);
  for (const dependency of task.dependencies) if (!tasks.tasks.some(item => item.id === dependency)) errors.push(`${task.id}: missing dependency ${dependency}`);
  if (['DONE','VERIFIED'].includes(task.current_status) && task.evidence_paths.length === 0) errors.push(`${task.id}: verified task has no evidence paths`);
}
for (const epic of epics.epics) for (const id of epic.tasks) if (!taskIds.has(id)) errors.push(`${epic.id}: unknown task ${id}`);
for (const gate of gates.phases) if (!['IN_PROGRESS','NOT_STARTED','DONE','BLOCKED'].includes(gate.status)) errors.push(`${gate.id}: invalid gate status`);
const bankIds = new Set();
for (const bank of banks.banks) {
  if (bankIds.has(bank.id)) errors.push(`Duplicate bank id: ${bank.id}`);
  bankIds.add(bank.id);
  for (const field of ['topic','description','current_state','applicability','source','alternatives','tradeoffs','priority','dependencies','last_reviewed','decision_status','docs','tests']) if (!(field in bank)) errors.push(`${bank.id}: missing ${field}`);
  if (!bank.current_state || bank.current_state.length < 20) errors.push(`${bank.id}: state description is too short`);
}
if (banks.banks.length !== 20) errors.push(`Expected 20 knowledge banks, found ${banks.banks.length}`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`State valid: ${tasks.tasks.length} tasks, ${epics.epics.length} epics, ${gates.phases.length} phase gates, ${banks.banks.length} knowledge banks.`);
