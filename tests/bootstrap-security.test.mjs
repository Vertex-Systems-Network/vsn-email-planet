import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import { isCanonicalOrigin, isValidBootstrapSecret, matchesBootstrapSecret } from "../apps/api/src/bootstrap-security.js";

test("bootstrap secret accepts only canonical 256-bit base64url values", () => {
  const secret = randomBytes(32).toString("base64url");
  assert.equal(isValidBootstrapSecret(secret), true);
  assert.equal(isValidBootstrapSecret("short-secret"), false);
  assert.equal(isValidBootstrapSecret(`${secret}=`), false);
  assert.equal(isValidBootstrapSecret("A".repeat(42) + "B"), false);
});

test("bootstrap secret comparison accepts exact matches and rejects malformed or different tokens", () => {
  const secret = randomBytes(32).toString("base64url");
  const other = randomBytes(32).toString("base64url");
  assert.equal(matchesBootstrapSecret(secret, secret), true);
  assert.equal(matchesBootstrapSecret(other, secret), false);
  assert.equal(matchesBootstrapSecret(null, secret), false);
  assert.equal(matchesBootstrapSecret(secret, "invalid"), false);
});

test("bootstrap origin comparison requires an exact canonical HTTP(S) origin", () => {
  assert.equal(isCanonicalOrigin("https://mail.example.test"), true);
  assert.equal(isCanonicalOrigin("http://127.0.0.1:4001"), true);
  assert.equal(isCanonicalOrigin("https://mail.example.test/"), false);
  assert.equal(isCanonicalOrigin("https://mail.example.test/path"), false);
  assert.equal(isCanonicalOrigin("https://user@mail.example.test"), false);
  assert.equal(isCanonicalOrigin("null"), false);
});
