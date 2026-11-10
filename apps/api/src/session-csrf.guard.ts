import {
  ForbiddenException,
  Inject,
  Injectable,
  type CanActivate,
  type ExecutionContext,
  ServiceUnavailableException,
} from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";
import type { Pool } from "pg";
import { digestCsrfToken } from "./session-auth.js";
import { createSessionRepository, SESSION_DATABASE_POOL } from "./session-repository.js";
import { CSRF_COOKIE_NAME, readCookieValue } from "./session-auth.guard.js";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

type CsrfRequest = {
  headers?: {
    cookie?: string;
    origin?: string;
    "x-csrf-token"?: string;
  };
  actor?: {
    userId: string;
    sessionId: string;
    organizationId: string;
  };
};

function forbidden() {
  return new ForbiddenException({
    error: { code: "CSRF_INVALID", message: "The request origin or CSRF token is invalid." },
  });
}

function sameConfiguredOrigin(origin: unknown, configuredOrigin: unknown): boolean {
  if (typeof origin !== "string" || typeof configuredOrigin !== "string") return false;
  try {
    const actual = new URL(origin);
    const expected = new URL(configuredOrigin);
    return origin === actual.origin
      && configuredOrigin === expected.origin
      && actual.origin === expected.origin
      && !expected.username
      && !expected.password;
  } catch {
    return false;
  }
}

function constantTimeMatch(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.byteLength === b.byteLength && timingSafeEqual(a, b);
}

@Injectable()
export class SessionCsrfGuard implements CanActivate {
  constructor(@Inject(SESSION_DATABASE_POOL) private readonly pool: Pool) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CsrfRequest>();
    const actor = request.actor;
    const configuredOrigin = process.env.APP_ORIGIN;
    const encodedKey = process.env.SESSION_DIGEST_KEY;
    if (!process.env.DATABASE_URL || !configuredOrigin || !encodedKey || !TOKEN_PATTERN.test(encodedKey)) {
      throw new ServiceUnavailableException({
        error: { code: "SESSION_CSRF_NOT_CONFIGURED", message: "Session CSRF verification is not configured." },
      });
    }
    if (!actor || !sameConfiguredOrigin(request.headers?.origin, configuredOrigin)) throw forbidden();

    const cookieToken = readCookieValue(request.headers?.cookie, CSRF_COOKIE_NAME);
    const headerToken = request.headers?.["x-csrf-token"];
    if (!cookieToken || !headerToken || !TOKEN_PATTERN.test(cookieToken)
      || !TOKEN_PATTERN.test(headerToken) || !constantTimeMatch(cookieToken, headerToken)) {
      throw forbidden();
    }

    try {
      const digestKey = Buffer.from(encodedKey, "base64url");
      const candidate = digestCsrfToken(cookieToken, digestKey);
      const stored = await createSessionRepository(this.pool)
        .findCsrfDigestForSession(actor.sessionId, actor.userId, actor.organizationId);
      if (!stored || !candidate || candidate.byteLength !== stored.byteLength
        || !timingSafeEqual(candidate, Buffer.from(stored))) throw forbidden();
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new ServiceUnavailableException({
        error: { code: "SESSION_CSRF_UNAVAILABLE", message: "Session CSRF verification is temporarily unavailable." },
      });
    }
  }
}
