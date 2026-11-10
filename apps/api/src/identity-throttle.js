import { createHmac } from 'node:crypto';

const PURPOSES = new Set(['login', 'mfa', 'recovery']);
const POLICIES = Object.freeze({
  login: { account: { max: 10, window: 900000, block: 900000 }, network: { max: 60, window: 900000, block: 300000 } },
  mfa: { account: { max: 5, window: 600000, block: 900000 }, network: { max: 30, window: 600000, block: 300000 } },
  recovery: { account: { max: 5, window: 1800000, block: 1800000 }, network: { max: 30, window: 1800000, block: 600000 } },
});
const RETENTION_MS = 86400000;
const KEY_RE = /^[A-Za-z0-9_-]{43}$/;

export function decodeIdentityThrottleKey(encoded) {
  if (typeof encoded !== 'string' || !KEY_RE.test(encoded)) throw new TypeError('Identity throttle key must be canonical 32-byte base64url.');
  const bytes = Buffer.from(encoded, 'base64url');
  if (bytes.length !== 32 || bytes.toString('base64url') !== encoded) throw new TypeError('Identity throttle key must be canonical 32-byte base64url.');
  return bytes;
}

function normalizedInput(input) {
  if (!input || !PURPOSES.has(input.purpose)) throw new TypeError('Invalid identity throttle purpose.');
  if (typeof input.accountIdentifier !== 'string' || !input.accountIdentifier.trim() || input.accountIdentifier.trim().length > 320) throw new TypeError('Invalid identity throttle account identifier.');
  if (typeof input.clientNetwork !== 'string' || !input.clientNetwork.trim() || input.clientNetwork.length > 128 || /[\u0000-\u001f\u007f]/.test(input.clientNetwork)) throw new TypeError('Invalid trusted client network identifier.');
  const encodedKeys = [input.key, ...(input.previousKeys ?? [])];
  if (encodedKeys.length > 2 || new Set(encodedKeys).size !== encodedKeys.length) throw new TypeError('At most one distinct previous identity throttle key is supported.');
  const keys = encodedKeys.map(decodeIdentityThrottleKey);
  const now = input.now instanceof Date ? input.now : new Date();
  if (!Number.isFinite(now.getTime())) throw new TypeError('Invalid identity throttle time.');
  return { purpose: input.purpose, account: input.accountIdentifier.trim().toLowerCase(), network: input.clientNetwork.trim().toLowerCase(), keys, now };
}

function digest(key, purpose, dimension, value) {
  return createHmac('sha256', key).update('vsn-email-planet:identity-throttle:v1\0').update(purpose).update('\0').update(dimension).update('\0').update(value).digest('hex');
}

function getBuckets(input) {
  const x = normalizedInput(input);
  const policy = POLICIES[x.purpose];
  const buckets = x.keys.flatMap(key => [
    { purpose: x.purpose, dimension: 'account', keyDigest: digest(key, x.purpose, 'account', x.account), policy: policy.account },
    { purpose: x.purpose, dimension: 'network', keyDigest: digest(key, x.purpose, 'network', x.network), policy: policy.network },
  ]);
  buckets.sort((a, b) => a.dimension.localeCompare(b.dimension) || a.keyDigest.localeCompare(b.keyDigest));
  return { x, buckets };
}

export async function consumeIdentityAttempt(pool, input) {
  const { x, buckets } = getBuckets(input);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'DELETE FROM platform_identity_attempt_throttles WHERE ctid IN (SELECT ctid FROM platform_identity_attempt_throttles WHERE expires_at <= $1 ORDER BY expires_at LIMIT 100)',
      [x.now],
    );
    const rows = [];
    for (const bucket of buckets) {
      const p = bucket.policy;
      const sql =
        "INSERT INTO platform_identity_attempt_throttles (purpose, dimension, key_digest, attempt_count, window_started_at, blocked_until, expires_at) " +
        "VALUES ($1, $2, $3, 1, $4, CASE WHEN 1 > $6 THEN $4 + ($7 * interval '1 millisecond') ELSE NULL END, $4 + (($5 + $7 + $8) * interval '1 millisecond')) " +
        "ON CONFLICT (purpose, dimension, key_digest) DO UPDATE SET " +
        "attempt_count = CASE WHEN platform_identity_attempt_throttles.window_started_at <= $4 - ($5 * interval '1 millisecond') THEN 1 ELSE platform_identity_attempt_throttles.attempt_count + 1 END, " +
        "window_started_at = CASE WHEN platform_identity_attempt_throttles.window_started_at <= $4 - ($5 * interval '1 millisecond') THEN $4 ELSE platform_identity_attempt_throttles.window_started_at END, " +
        "blocked_until = CASE WHEN platform_identity_attempt_throttles.window_started_at <= $4 - ($5 * interval '1 millisecond') THEN CASE WHEN 1 > $6 THEN $4 + ($7 * interval '1 millisecond') ELSE NULL END WHEN platform_identity_attempt_throttles.blocked_until > $4 THEN platform_identity_attempt_throttles.blocked_until WHEN platform_identity_attempt_throttles.attempt_count + 1 > $6 THEN platform_identity_attempt_throttles.window_started_at + (($5 + $7) * interval '1 millisecond') ELSE NULL END, " +
        "expires_at = CASE WHEN platform_identity_attempt_throttles.window_started_at <= $4 - ($5 * interval '1 millisecond') THEN $4 + (($5 + $7 + $8) * interval '1 millisecond') ELSE platform_identity_attempt_throttles.expires_at END " +
        "RETURNING dimension, attempt_count, blocked_until";
      const result = await client.query(sql, [x.purpose, bucket.dimension, bucket.keyDigest, x.now, p.window, p.max, p.block, RETENTION_MS]);
      rows.push(result.rows[0]);
    }
    await client.query('COMMIT');
    const retryAfterSeconds = Math.max(0, ...rows.map(row => row.blocked_until ? Math.max(0, Math.ceil((new Date(row.blocked_until).getTime() - x.now.getTime()) / 1000)) : 0));
    return Object.freeze({ allowed: retryAfterSeconds === 0, retryAfterSeconds });
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch {}
    throw error;
  } finally {
    client.release();
  }
}

export async function clearIdentityAttempts(pool, input) {
  const { x, buckets } = getBuckets(input);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const bucket of buckets) {
      await client.query('DELETE FROM platform_identity_attempt_throttles WHERE purpose = $1 AND dimension = $2 AND key_digest = $3', [x.purpose, bucket.dimension, bucket.keyDigest]);
    }
    await client.query('COMMIT');
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch {}
    throw error;
  } finally {
    client.release();
  }
}
