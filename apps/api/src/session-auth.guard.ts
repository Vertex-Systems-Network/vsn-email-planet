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

export const SESSION_COOKIE_NAME = "__Host-vsn_session";
export const CSRF_COOKIE_NAME = "__Host-vsn_csrf";
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

export function readCookieValue(header: unknown, name: string): string | null {
  if (typeof header !== "string") return null;
  const matches: string[] = [];
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() === name) matches.push(part.slice(separator + 1).trim());
  }
  return matches.length === 1 ? matches[0] : null;
}

function readSessionCookie(header: unknown): string | null {
  const value = readCookieValue(header, SESSION_COOKIE_NAME);
  return value && SESSION_SECRET_PATTERN.test(value) ? value : null;
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

    let result: Awaited<ReturnType<typeof resolveSessionActor>>;
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
