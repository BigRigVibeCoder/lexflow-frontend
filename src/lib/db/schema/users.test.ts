import { describe, it, expect } from "vitest";
import { getTableName } from "drizzle-orm";
import { users, userRoleEnum, userStatusEnum } from "./users";

describe("users schema", () => {
  it("exports users table", () => { expect(users).toBeDefined(); });
  it("has correct table name", () => { expect(getTableName(users)).toBe("users"); });
  it("exports userRoleEnum", () => { expect(userRoleEnum).toBeDefined(); });
  it("exports userStatusEnum", () => { expect(userStatusEnum).toBeDefined(); });
});
