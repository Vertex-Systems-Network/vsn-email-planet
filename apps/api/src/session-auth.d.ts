export type SessionActor = {
  userId: string;
  sessionId: string;
  organizationId: string;
  membershipRole: string;
  membershipVersion: number;
};

export type SessionResolution =
  | { ok: true; actor: Readonly<SessionActor> }
  | { ok: false; reason: string };

export type SessionRepository = {
  findSessionByDigest(digest: Uint8Array): Promise<{
    id: string;
    userId: string;
    organizationId: string;
    membershipVersion: number;
    revokedAt: Date | string | null;
    expiresAt: Date | string;
    idleExpiresAt: Date | string;
  } | null>;
  findUserById(userId: string): Promise<{ id: string; status: string } | null>;
  findMembership(userId: string, organizationId: string): Promise<{
    organizationId: string;
    role: string;
    status: string;
    version: number;
  } | null>;
};

export function resolveSessionActor(input: {
  sessionSecret: string;
  digestKey: Uint8Array;
  repository: SessionRepository;
  now?: Date;
}): Promise<SessionResolution>;
