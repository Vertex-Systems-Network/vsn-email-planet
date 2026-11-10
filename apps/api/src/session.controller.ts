import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Header,
  Inject,
  Post,
  Req,
  Res,
  ServiceUnavailableException,
  UseGuards,
} from "@nestjs/common";
import type { Pool } from "pg";
import { SessionAuthGuard } from "./session-auth.guard.js";
import { SessionCsrfGuard } from "./session-csrf.guard.js";
import { createSessionRepository, SESSION_DATABASE_POOL } from "./session-repository.js";

type SessionActor = Readonly<{
  userId: string;
  sessionId: string;
  organizationId: string;
  membershipRole: string;
  membershipVersion: number;
}>;
type AuthenticatedRequest = { actor: SessionActor };
type CookieResponse = { setHeader(name: string, value: string | string[]): void };

@Controller("api/session")
@UseGuards(SessionAuthGuard)
export class SessionController {
  constructor(@Inject(SESSION_DATABASE_POOL) private readonly pool: Pool) {}

  @Get("me")
  @Header("Cache-Control", "no-store")
  getCurrentSession(@Req() request: AuthenticatedRequest) {
    return { data: request.actor };
  }

  @Post("logout")
  @Header("Cache-Control", "no-store")
  @UseGuards(SessionCsrfGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() request: AuthenticatedRequest, @Res({ passthrough: true }) response: CookieResponse): Promise<void> {
    try {
      await createSessionRepository(this.pool).revokeSession(request.actor);
    } catch {
      throw new ServiceUnavailableException({
        error: { code: "SESSION_LOGOUT_UNAVAILABLE", message: "The session could not be safely revoked." },
      });
    }
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Set-Cookie", [
      "__Host-vsn_session=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax",
      "__Host-vsn_csrf=; Max-Age=0; Path=/; Secure; SameSite=Strict",
    ]);
  }
}
