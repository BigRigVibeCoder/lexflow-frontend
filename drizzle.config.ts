import type { Config } from "drizzle-kit";

/**
 * @file drizzle.config.ts
 * @description Drizzle Kit configuration for database migrations.
 *
 * Points to the lexflow_main database and the schema directory.
 * Used by `npx drizzle-kit migrate` and `npx drizzle-kit generate`.
 *
 * REF: AGT-002-FE §6 (database ownership)
 */
export default {
  schema: "./src/lib/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://lexflow_web:lexflow_web@localhost:5432/lexflow_main",
  },
} satisfies Config;
