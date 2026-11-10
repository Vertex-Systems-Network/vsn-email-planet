import {
  Inject,
  Injectable,
  type CanActivate,
  type ExecutionContext,
  type OnModuleDestroy,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import type { Pool } from "pg";
import { resolveSessionActor } from "./session-auth.js";
import { createSessionRepository, SESSION_DATABASE_POOL } from "./session-repository.js";

const SESSION_COOKIE_NAME = "__Host-vsn_session";
const SESSION_SECRET_PATTERN = /^[A-Za-z0-9_-]{43}$/;

type SessionRequest = {
  headers?: { cookie?: string };
  actor?: Readonly<{
    userId: string;
    sessionId: string;
    organizationId: string;
    membershipRole: string;
    membershipVersion: number;
  }>;
};

function readSessionCookie(header: unknown): string | null {
  if (typeof header !== "string") return null;
  const matches: string[] = [];
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === SESSION_COOKIE_NAME) {
      matches.push(part.slice(separator + 1).trim());
    }
  }
  if (matches.length !== 1 || !SESSION_SECRET_PATTERN.test(matches[0])) return null;
  return matches[0];
}

function authError() {
  return new UnauthorizedException({
    error: { code: "AUTH_REQUIRED", message: "A valid session is required." },
  });
}

@Injectable()
export class SessionAuthGuard implements CanActivate, OnModuleDestroy {
  constructor(@Inject(SESSION_DATABASE_POOL) private readonly pool: Pool) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SessionRequest>();
    const sessionSecret = readSessionCookie(request.headers?.cookie);
    if (!sessionSecret) throw authError();

    const encodedKey = process.env.SESSION_DIGEST_KEY;
    if (!process.env.DATABASE_URL || !encodedKey || !SESSION_SECRET_PATTERN.test(encodedKey)) {
      throw new ServiceUnavailableException({
        error: { code: "SESSION_AUTH_NOT_CONFIGURED", message: "Session verification is not configured." },
      });
    }

    let result;
    try {
      result = await resolveSessionActor({
        sessionSecret,
        digestKey: Buffer.from(encodedKey, "base64url"),
        repository: createSessionRepository(this.pool),
      });
    } catch {
      throw new ServiceUnavailableException({
        error: { code: "SESSION_AUTH_UNAVAILABLE", message: "Session verification is temporarily unavailable." },
      });
    }
    if (!result.ok) throw authError();
    request.actor = result.actor;
    return true;
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
