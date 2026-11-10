import { timingSafeEqual } from "node:crypto";

const SECRET_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function canonicalSecret(value) {
  if (typeof value !== "string" || !SECRET_PATTERN.test(value)) return null;
  const decoded = Buffer.from(value, "base64url");
  return decoded.byteLength === 32 && decoded.toString("base64url") === value ? decoded : null;
}

export function isValidBootstrapSecret(value) {
  return canonicalSecret(value) !== null;
}

export function matchesBootstrapSecret(candidate, configured) {
  if (typeof candidate !== "string") return false;
  const expectedBytes = canonicalSecret(configured);
  const candidateBytes = canonicalSecret(candidate);
  if (!expectedBytes || !candidateBytes || candidateBytes.byteLength !== expectedBytes.byteLength) return false;
  return timingSafeEqual(candidateBytes, expectedBytes);
}

export function isCanonicalOrigin(value) {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "https:" || parsed.protocol === "http:")
      && value === parsed.origin
      && parsed.username === ""
      && parsed.password === "";
  } catch {
    return false;
  }
}
