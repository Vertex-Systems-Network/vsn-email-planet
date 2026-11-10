import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

const KEY_BYTES = 32;
const SALT_BYTES = 16;
const SCRYPT = Object.freeze({ N: 2 ** 15, r: 8, p: 3, maxmem: 64 * 1024 * 1024 });
const COMMON_PASSWORDS = new Set([
  '123456789012345',
  'passwordpassword',
  'qwertyuiopasdfg',
  'welcome12345678',
  'letmeinletmein1',
  'changemechangeme',
  'adminadminadmin',
]);

function derive(password, salt) {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, KEY_BYTES, SCRYPT, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

function canonicalBase64Url(value, expectedBytes) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const decoded = Buffer.from(value, 'base64url');
  if (decoded.length !== expectedBytes || decoded.toString('base64url') !== value) return null;
  return decoded;
}

/** Passwords are exact UTF-8 inputs: do not trim or normalize before hashing. */
export function isPasswordAllowed(password, { email, blocklist = [] } = {}) {
  if (typeof password !== 'string') return false;
  const points = Array.from(password);
  if (points.length < 15 || points.length > 1024 || Buffer.byteLength(password, 'utf8') > 4096) return false;

  const comparison = password.normalize('NFKC').toLowerCase();
  if (COMMON_PASSWORDS.has(comparison)) return false;
  if (Array.isArray(blocklist) && blocklist.some(value => typeof value === 'string'
    && value.normalize('NFKC').toLowerCase() === comparison)) return false;

  if (typeof email === 'string') {
    const local = email.split('@', 1)[0]?.normalize('NFKC').toLowerCase();
    if (local && (comparison === local || comparison === email.normalize('NFKC').toLowerCase())) return false;
  }
  return true;
}

/** Produce a versioned scrypt verifier. The raw password and salt are never returned. */
export async function createPasswordVerifier(password, options = {}) {
  if (!isPasswordAllowed(password, options)) {
    throw new TypeError('Password does not meet the account password policy.');
  }
  const salt = randomBytes(SALT_BYTES);
  const derivedKey = await derive(password, salt);
  return `scrypt-v1$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
}

/** Verify only the exact supported scrypt profile; malformed or unknown formats fail closed. */
export async function verifyPassword(password, verifier) {
  if (typeof password !== 'string' || Buffer.byteLength(password, 'utf8') > 4096
    || typeof verifier !== 'string') return false;

  const parts = verifier.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt-v1'
    || parts[1] !== String(SCRYPT.N) || parts[2] !== String(SCRYPT.r) || parts[3] !== String(SCRYPT.p)) {
    return false;
  }
  const salt = canonicalBase64Url(parts[4], SALT_BYTES);
  const expected = canonicalBase64Url(parts[5], KEY_BYTES);
  if (!salt || !expected) return false;

  const actual = await derive(password, salt);
  return timingSafeEqual(actual, expected);
}
