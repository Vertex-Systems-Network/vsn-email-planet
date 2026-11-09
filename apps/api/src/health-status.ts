export function getProcessHealth() {
  return {
    status: "ok",
    service: "vsn-email-planet-api",
    verification: "process-only",
    providerConnections: false,
    persistence: false,
  } as const;
}
