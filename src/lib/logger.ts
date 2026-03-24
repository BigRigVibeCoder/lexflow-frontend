/**
 * @file logger.ts
 * @description Structured JSON logger for LexFlow Web Service.
 *
 * Uses pino per GOV-006 §6.1. All log records include service name,
 * timestamp, and structured key-value context. No `console.log` allowed
 * in production code.
 *
 * Used by: all API routes, middleware, server components.
 *
 * READING GUIDE FOR INCIDENT RESPONDERS:
 * 1. If logs aren't appearing       → check LOG_LEVEL env var
 * 2. If service name is "unknown"   → check SERVICE_NAME env var
 * 3. If structured fields missing   → check pino formatters config
 *
 * REF: GOV-006 §6.1 (pino setup)
 * REF: GOV-004 §8 (correlation IDs)
 */

import pino from "pino";

/**
 * Default log level for the application.
 *
 * DECISION: Default to "warn" in production to reduce noise.
 * ALTERNATIVES CONSIDERED: "info" (too verbose for production), "error" (misses warnings).
 * TRADEOFF: Some lifecycle events missed, but LOG_LEVEL=info override available.
 * REF: GOV-006 §2.2 (production level override)
 */
const DEFAULT_LOG_LEVEL = "warn";

/**
 * Service name included in every log record for filtering.
 * REF: GOV-006 §3.1 (required fields)
 */
const SERVICE_NAME = process.env.SERVICE_NAME ?? "lexflow-web";

/**
 * Application-wide structured logger instance.
 *
 * PRECONDITION: None — safe to call at module import time.
 * POSTCONDITION: Returns a pino logger configured per GOV-006.
 * SIDE EFFECTS: None.
 *
 * @example
 * ```ts
 * import { logger } from "@/lib/logger";
 * logger.info({ port: 3000 }, "server.started");
 * ```
 */
const logger = pino({
  level: process.env.LOG_LEVEL?.toLowerCase() ?? DEFAULT_LOG_LEVEL,
  formatters: {
    level: (label: string) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: SERVICE_NAME,
  },
});

export { logger };
export default logger;
