import { Controller, Get } from "@nestjs/common";
import { getProcessHealth } from "./health-status.js";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return getProcessHealth();
  }
}
