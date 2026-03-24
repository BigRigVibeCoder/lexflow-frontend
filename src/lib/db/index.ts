/**
 * @file db/index.ts
 * @description Drizzle ORM database connection for LexFlow Web Service.
 *
 * Connects to `lexflow_main` on localhost:5432 using the pg driver.
 * This module owns the primary database connection used by all
 * tRPC procedures and server-side data access.
 *
 * Used by: tRPC routers, server actions, migration scripts.
 *
 * READING GUIDE FOR INCIDENT RESPONDERS:
 * 1. If DB connection fails         → check DATABASE_URL env var
 * 2. If queries hang                → check PostgreSQL service status
 * 3. If schema mismatch             → run `npx drizzle-kit migrate`
 *
 * FAILURE MODE: If the connection pool fails to initialize, all
 * data access will fail. The health endpoint does NOT depend on this.
 * BLAST RADIUS: All tRPC procedures, all data reads/writes.
 * MITIGATION: Application logs CRITICAL and exits per GOV-004 §7.1.
 *
 * REF: AGT-002-FE §6 (database ownership)
 * REF: BLU-ARCH-001 §2 (schema definitions)
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { logger } from "@/lib/logger";

/**
 * Default database URL for local development.
 * DECISION: Use localhost:5432 per GOV-008 infrastructure standard.
 * REF: AGT-002-FE §1 (service config)
 */
const DEFAULT_DATABASE_URL = "postgresql://lexflow_web:lexflow_web@localhost:5432/lexflow_main";

/**
 * PostgreSQL connection pool.
 *
 * PRECONDITION: DATABASE_URL env var must be a valid PostgreSQL connection string.
 * POSTCONDITION: Pool is created but not yet connected (lazy connection).
 * SIDE EFFECTS: Creates a connection pool that must be cleaned up on shutdown.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
});

/* Log pool errors to prevent silent failures (GOV-004 Law #1) */
pool.on("error", (err: Error) => {
  logger.error({ err: err.message, component: "db" }, "database.pool.error");
});

/**
 * Drizzle ORM database instance.
 *
 * @example
 * ```ts
 * import { db } from "@/lib/db";
 * const users = await db.select().from(usersTable);
 * ```
 */
export const db = drizzle(pool);

export { pool };
