import { describe, it, expect } from "vitest";
import { getTableName } from "drizzle-orm";
import { clients } from "./clients";

describe("clients schema", () => {
  it("exports clients table", () => { expect(clients).toBeDefined(); });
  it("has correct table name", () => { expect(getTableName(clients)).toBe("clients"); });
});
