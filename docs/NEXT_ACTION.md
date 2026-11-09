# Exact next action

**Canonical repo:** [Vertex-Systems-Network/vsn-email-planet](https://github.com/Vertex-Systems-Network/vsn-email-planet)  
**Source of truth:** GitHub remote only. Do not implement or test from a local clone/worktree.

## Active work

1. Continue **P1-06 identity/session runtime**. The identity contract and framework-neutral resolver are already documented and tested.
2. Add a checksummed PostgreSQL session migration and repository adapter.
3. Wire `resolveSessionActor` into a NestJS API guard before protected handlers.
4. Add and run remote CI cases for unauthenticated denial, cross-tenant denial, and membership revocation against native PostgreSQL.
5. Update task evidence and this handoff only when the remote checks pass. Keep P1-06 open until then.

## Parallel P0 work

- Continue dated, primary-source provider retention/permission research under P0-02.
- Add automated viewport and keyboard checks for P0-04 if they can run in GitHub Actions. Keep interactive visual/screen-reader evidence explicitly pending until a supported remote browser runner is available.
- Do not treat interviews, browser access, provider credentials, or live mailboxes as prerequisites for unrelated, reversible work.
- P0 remains open until every P0 exit criterion in `backlog/phase-gates.json` has evidence. P2/P3 connector and mail-data-plane work remains gated by the P1 authorization criteria.

## Remote-only publication

- Read the current remote `main` ref and the target files before editing.
- Create the change directly in GitHub; publish it to this repository and verify the new remote SHA.
- Use GitHub Actions for checks. Record the run URL, tested commit, result, and any check unavailable remotely.
- If `main` advances during an edit, stop the ref update, reread the changed files, and reapply only the intended change.
