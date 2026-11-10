import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
const load = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const [tasks, epics, gates, banks] = await Promise.all([load('../backlog/tasks.json'),load('../backlog/epics.json'),load('../backlog/phase-gates.json'),load('../knowledge/banks.json')]);
const errors=[]; const taskById=new Map(); const phaseIds=Array.from({length:13},(_,i)=>`P${i}`);
for(const task of tasks.tasks){
 if(taskById.has(task.id)) errors.push(`Duplicate task id: ${task.id}`); taskById.set(task.id,task);
 for(const field of ['id','epic','phase','title','outcome','description','priority','complexity','current_status','acceptance_criteria','test_plan','evidence_paths','verification_level','target_environment','next_action']) if(!(field in task)) errors.push(`${task.id}: missing ${field}`);
 if(!tasks.allowed_statuses.includes(task.current_status)) errors.push(`${task.id}: invalid status ${task.current_status}`);
 for(const dependency of task.dependencies??[]) if(!tasks.tasks.some(item=>item.id===dependency)) errors.push(`${task.id}: missing dependency ${dependency}`);
 if(['DONE','VERIFIED'].includes(task.current_status)&&(!Array.isArray(task.evidence_paths)||!task.evidence_paths.length)) errors.push(`${task.id}: verified task has no evidence paths`);
 if(task.phase!==task.id.match(/^P\d{1,2}/)?.[0]) errors.push(`${task.id}: phase does not match task ID`);
 if(!Array.isArray(task.acceptance_criteria)||!task.acceptance_criteria.length) errors.push(`${task.id}: acceptance criteria are empty`);
 if(!Array.isArray(task.test_plan)||!task.test_plan.length) errors.push(`${task.id}: test plan is empty`);
 for(const evidence of task.evidence_paths??[]){try{await access(new URL(`../${evidence}`,import.meta.url),constants.R_OK)}catch{errors.push(`${task.id}: evidence path does not exist: ${evidence}`)}}
}
const gateByPhase=new Map(gates.phases.map(g=>[g.id,g]));
for(const phase of phaseIds) if(!gateByPhase.has(phase)) errors.push(`Missing phase gate ${phase}`);
for(const gate of gates.phases){
 if(!phaseIds.includes(gate.id)) errors.push(`Unexpected or combined phase gate: ${gate.id}`);
 if(!['IN_PROGRESS','NOT_STARTED','DONE','BLOCKED'].includes(gate.status)) errors.push(`${gate.id}: invalid gate status`);
 if(!Array.isArray(gate.task_ids)||!gate.task_ids.length) errors.push(`${gate.id}: task_ids must be non-empty`);
 if(!Array.isArray(gate.exit_criteria)||gate.exit_criteria.length<3) errors.push(`${gate.id}: add at least three observable exit criteria`);
 for(const id of gate.task_ids??[]){const task=taskById.get(id);if(!task)errors.push(`${gate.id}: unknown task ${id}`);else if(task.phase!==gate.id)errors.push(`${gate.id}: task ${id} belongs to phase ${task.phase}`)}
 const expected=tasks.tasks.filter(t=>t.phase===gate.id).map(t=>t.id).sort(), actual=[...(gate.task_ids??[])].sort();
 if(JSON.stringify(expected)!==JSON.stringify(actual)) errors.push(`${gate.id}: gate task mapping differs from task ledger`);
}
const membership=new Map();
for(const epic of epics.epics){
 if(!phaseIds.includes(epic.phase))errors.push(`${epic.id}: invalid phase ${epic.phase}`);
 if(epic.id!==`${epic.phase}-PHASE`)errors.push(`${epic.id}: epic ID must be canonical for its phase`);
 if(epic.status!==gateByPhase.get(epic.phase)?.status)errors.push(`${epic.id}: status differs from phase gate`);
 for(const id of epic.tasks??[]){if(!taskById.has(id))errors.push(`${epic.id}: unknown task ${id}`);membership.set(id,(membership.get(id)??0)+1)}
}
for(const [id,task] of taskById){if(membership.get(id)!==1)errors.push(`${id}: must belong to exactly one epic`);if(task.epic!==`${task.phase}-PHASE`)errors.push(`${id}: task epic does not match its phase epic`);if(!gateByPhase.get(task.phase)?.task_ids.includes(id))errors.push(`${id}: missing from phase gate mapping`)}
const bankIds=new Set(); for(const bank of banks.banks){if(bankIds.has(bank.id))errors.push(`Duplicate bank id: ${bank.id}`);bankIds.add(bank.id);for(const field of ['topic','description','current_state','applicability','source','alternatives','tradeoffs','priority','dependencies','last_reviewed','decision_status','docs','tests'])if(!(field in bank))errors.push(`${bank.id}: missing ${field}`);if(!bank.current_state||bank.current_state.length<20)errors.push(`${bank.id}: state description is too short`)}
if(banks.banks.length!==20)errors.push(`Expected 20 knowledge banks, found ${banks.banks.length}`);
if(epics.epics.length!==13)errors.push(`Expected 13 phase epics, found ${epics.epics.length}`);
if(gates.phases.length!==13)errors.push(`Expected 13 individual phase gates, found ${gates.phases.length}`);
if(errors.length){console.error(errors.join('\\n'));process.exitCode=1}else console.log(`State valid: ${tasks.tasks.length} tasks, 13 aligned phase epics/gates, ${banks.banks.length} knowledge banks.`);
