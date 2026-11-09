import test from "node:test";
import assert from "node:assert/strict";
import { canPerformCapability, canReadMailboxContent, scopeTenantResources } from "../packages/domain/src/index.ts";

const mailboxA = { id: "mailbox-a", organizationId: "org-a" };
const mailboxB = { id: "mailbox-b", organizationId: "org-b" };

test("tenant scoping excludes resources owned by another organization", () => {
  assert.deepEqual(scopeTenantResources("org-a", [mailboxA, mailboxB]), [mailboxA]);
});

test("admin or tenant context alone does not grant mailbox-content access", () => {
  const adminWithoutContentGrant = { organizationId: "org-a", mailboxContentGrantIds: [] };
  assert.equal(canReadMailboxContent(adminWithoutContentGrant, mailboxA), false);
  assert.equal(canReadMailboxContent(adminWithoutContentGrant, mailboxB), false);
});

test("content grant is scoped to one mailbox and tenant", () => {
  const delegated = { organizationId: "org-a", mailboxContentGrantIds: ["mailbox-a"] };
  assert.equal(canReadMailboxContent(delegated, mailboxA), true);
  assert.equal(canReadMailboxContent(delegated, mailboxB), false);
});

test("read-only capability cannot be used for a mutation", () => {
  const capability = { action: "list_mailboxes", state: "READ_ONLY", checkedAt: "2026-11-09T00:00:00Z", source: "synthetic-test" };
  assert.equal(canPerformCapability(capability), true);
  assert.equal(canPerformCapability(capability, true), false);
  assert.equal(canPerformCapability(undefined), false);
});
