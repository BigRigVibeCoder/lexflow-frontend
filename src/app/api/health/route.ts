/**
 * @file api/health/route.ts
 * @description Health check endpoint for LexFlow Web Service.
 *
 * Returns a simple JSON response indicating the service is running.
 * This endpoint does NOT check database connectivity — it only confirms
 * the Next.js process is alive and responding to HTTP requests.
 *
 * Used by: load balancers, PM2 health checks, deployment scripts, monitoring.
 *
 * READING GUIDE FOR INCIDENT RESPONDERS:
 * 1. If this returns non-200  → Next.js process is down or unresponsive
 * 2. If timestamp is stale    → check system clock (NTP)
 *
 * FAILURE MODE: If this handler throws, Next.js returns 500 automatically.
 * BLAST RADIUS: Health check failures trigger PM2 restart and deployment rollback.
 * MITIGATION: Handler is stateless and has no external dependencies.
 *
 * REF: SPR-001 T-002 (health endpoint)
 * REF: GOV-008 §3 (PM2 health checks)
 */

import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Health check response shape.
 * Returned as JSON by the GET handler.
 */
interface HealthResponse {
  /** Service status — always "ok" if the handler executes */
  readonly status: "ok";
  /** ISO 8601 timestamp of the response */
  readonly timestamp: string;
}

/**
 * GET /api/health
 *
 * Returns service health status. Stateless, no auth required.
 *
 * PRECONDITION: None.
 * POSTCONDITION: Returns 200 with `{ status: "ok", timestamp: "<ISO>" }`.
 * SIDE EFFECTS: Emits a debug-level log event.
 *
 * @returns JSON response with status and timestamp
 *
 * @example
 * ```sh
 * curl http://localhost:3000/api/health
 * # => { "status": "ok", "timestamp": "2026-03-24T16:00:00.000Z" }
 * ```
 */
export function GET(): NextResponse<HealthResponse> {
  const response: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  logger.debug(
    { event: "health.check", timestamp: response.timestamp },
    "health.check.ok",
  );

  return NextResponse.json(response);
}
