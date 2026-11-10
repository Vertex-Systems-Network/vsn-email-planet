import type { Pool } from 'pg';
export type IdentityThrottlePurpose = 'login' | 'mfa' | 'recovery';
export type IdentityThrottleInput = Readonly<{
  purpose: IdentityThrottlePurpose;
  accountIdentifier: string;
  /** Derive from socket peer or a deployment-allowlisted proxy; never trust arbitrary forwarding headers. */
  clientNetwork: string;
  /** Current canonical 32-byte base64url HMAC key from secret configuration. */
  key: string;
  /** Optional prior key during rotation; keep until 24-hour throttle rows expire. */
  previousKeys?: readonly string[];
  now?: Date;
}>;
export function decodeIdentityThrottleKey(encoded: string): Buffer;
export function consumeIdentityAttempt(pool: Pick<Pool, 'connect'>, input: IdentityThrottleInput): Promise<Readonly<{ allowed: boolean; retryAfterSeconds: number }>>;
export function clearIdentityAttempts(pool: Pick<Pool, 'connect'>, input: IdentityThrottleInput): Promise<void>;
