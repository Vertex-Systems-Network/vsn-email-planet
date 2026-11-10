import {
  BadRequestException,
  ConflictException,
  Controller,
  ForbiddenException,
  Header,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  ServiceUnavailableException,
} from "@nestjs/common";
import type { Pool } from "pg";
import { isPasswordAllowed, createPasswordVerifier } from "./password-auth.js";
import { bootstrapFirstAdmin } from "./bootstrap-repository.js";
import { isCanonicalOrigin, isValidBootstrapSecret, matchesBootstrapSecret } from "./bootstrap-security.js";
import { SESSION_DATABASE_POOL } from "./session-repository.js";

type BootstrapRequest = {
  headers?: {
    origin?: unknown;
    "x-vsn-bootstrap-token"?: unknown;
  };
  body?: unknown;
};
type NoStoreResponse = { setHeader(name: string, value: string): void };

const ALLOWED_FIELDS = new Set([
  "email",
  "displayName",
  "organizationSlug",
  "organizationDisplayName",
  "password",
]);

function invalidInput() {
  return new BadRequestException({
    error: { code: "BOOTSTRAP_INPUT_INVALID", message: "The bootstrap input is invalid." },
  });
}

@Controller("api/auth")
export class BootstrapController {
  constructor(@Inject(SESSION_DATABASE_POOL) private readonly pool: Pool) {}

  @Post("bootstrap")
  @Header("Cache-Control", "no-store")
  @Header("Pragma", "no-cache")
  @HttpCode(HttpStatus.CREATED)
  async bootstrap(
    @Req() request: BootstrapRequest,
    @Res({ passthrough: true }) response: NoStoreResponse,
  ) {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Pragma", "no-cache");
    const configuredOrigin = process.env.APP_ORIGIN;
    const configuredSecret = process.env.PLATFORM_BOOTSTRAP_TOKEN;
    if (!process.env.DATABASE_URL || !isValidBootstrapSecret(configuredSecret)
      || !isCanonicalOrigin(configuredOrigin)) {
      throw new ServiceUnavailableException({
        error: { code: "BOOTSTRAP_NOT_CONFIGURED", message: "First-admin bootstrap is not configured." },
      });
    }

    if (!isCanonicalOrigin(request.headers?.origin)
      || request.headers?.origin !== configuredOrigin
      || !matchesBootstrapSecret(request.headers?.["x-vsn-bootstrap-token"], configuredSecret)) {
      throw new ForbiddenException({
        error: { code: "BOOTSTRAP_FORBIDDEN", message: "The bootstrap request is not authorized." },
      });
    }

    const body = request.body;
    if (!body || typeof body !== "object" || Array.isArray(body)
      || Object.keys(body).some(key => !ALLOWED_FIELDS.has(key))) throw invalidInput();
    const input = body as Record<string, unknown>;
    if (typeof input.email !== "string" || typeof input.displayName !== "string"
      || typeof input.organizationSlug !== "string" || typeof input.organizationDisplayName !== "string"
      || typeof input.password !== "string") throw invalidInput();

    const email = input.email.trim().toLowerCase();
    const displayName = input.displayName.trim();
    const organizationSlug = input.organizationSlug;
    const organizationDisplayName = input.organizationDisplayName.trim();
    if (email.length < 6 || email.length > 320 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
      || displayName.length < 1 || displayName.length > 160
      || organizationSlug.length < 2 || organizationSlug.length > 63
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(organizationSlug)
      || organizationDisplayName.length < 1 || organizationDisplayName.length > 160
      || !isPasswordAllowed(input.password, { email })) throw invalidInput();

    try {
      const passwordVerifier = await createPasswordVerifier(input.password, { email });
      const created = await bootstrapFirstAdmin(this.pool, {
        email,
        displayName,
        organizationSlug,
        organizationDisplayName,
        passwordVerifier,
      });
      if (!created) {
        throw new ConflictException({
          error: { code: "BOOTSTRAP_ALREADY_CLAIMED", message: "First-admin bootstrap is unavailable." },
        });
      }
      return { data: { ...created, mfaEnrollmentRequired: true } };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) throw error;
      throw new ServiceUnavailableException({
        error: { code: "BOOTSTRAP_UNAVAILABLE", message: "First-admin bootstrap is temporarily unavailable." },
      });
    }
  }
}
