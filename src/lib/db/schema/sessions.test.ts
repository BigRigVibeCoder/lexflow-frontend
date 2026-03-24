import { describe, it, expect } from "vitest";
import { getTableName } from "drizzle-orm";
import { sessions } from "./sessions";

describe("sessions schema", () => {
  it("exports sessions table", () => { expect(sessions).toBeDefined(); });
  it("has correct table name", () => { expect(getTableName(sessions)).toBe("sessions"); });
});
