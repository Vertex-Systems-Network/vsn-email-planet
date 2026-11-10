export type PasswordPolicyOptions = {
  email?: string;
  blocklist?: string[];
};

export function isPasswordAllowed(password: unknown, options?: PasswordPolicyOptions): boolean;
export function createPasswordVerifier(password: string, options?: PasswordPolicyOptions): Promise<string>;
export function verifyPassword(password: string, verifier: string): Promise<boolean>;
