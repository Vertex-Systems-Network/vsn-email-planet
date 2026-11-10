import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { SessionAuthGuard } from "./session-auth.guard.js";

type AuthenticatedRequest = {
  actor: Readonly<{
    userId: string;
    sessionId: string;
    organizationId: string;
    membershipRole: string;
    membershipVersion: number;
  }>;
};

@Controller("api/session")
@UseGuards(SessionAuthGuard)
export class SessionController {
  @Get("me")
  getCurrentSession(@Req() request: AuthenticatedRequest) {
    return { data: request.actor };
  }
}
