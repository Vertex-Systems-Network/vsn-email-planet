import { Module } from "@nestjs/common";
import { Pool } from "pg";
import { HealthController } from "./health.controller.js";
import { SessionAuthGuard } from "./session-auth.guard.js";
import { SESSION_DATABASE_POOL } from "./session-repository.js";
import { SessionController } from "./session.controller.js";

@Module({
  controllers: [HealthController, SessionController],
  providers: [
    {
      provide: SESSION_DATABASE_POOL,
      useFactory: () => new Pool({
        connectionString: process.env.DATABASE_URL,
        application_name: "vsn-email-planet-api",
        max: 10,
      }),
    },
    SessionAuthGuard,
  ],
})
export class AppModule {}
