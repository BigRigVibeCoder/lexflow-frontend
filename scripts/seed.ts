import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { hash } from "argon2";
import { users } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

const S = { email: "owner@lexflow.dev", password: "LexFlow2026!", fullName: "System Owner", role: "owner" as const };

async function seed(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL ?? "postgresql://lexflow_web:lexflow_web@localhost:5432/lexflow_main" });
  const db = drizzle(pool);
  const [e] = await db.select({ id: users.id }).from(users).where(eq(users.email, S.email)).limit(1);
  if (e) { console.info("[seed] Owner exists."); await pool.end(); return; }
  const ph = await hash(S.password, { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 1 });
  const [c] = await db.insert(users).values({ email: S.email, passwordHash: ph, fullName: S.fullName, role: S.role, status: "active" }).returning({ id: users.id, email: users.email });
  console.info("[seed] Created: " + c.email);
  await pool.end();
}
seed().catch((e: unknown) => { console.error("[seed] Failed:", e); process.exit(1); });
