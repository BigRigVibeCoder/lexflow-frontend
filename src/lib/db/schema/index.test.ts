import { describe, it, expect } from "vitest";
import { users, sessions, auditLogs, userRoleEnum, userStatusEnum } from "./index";

describe("schema barrel exports", () => {
  it("exports users", () => { expect(users).toBeDefined(); });
  it("exports sessions", () => { expect(sessions).toBeDefined(); });
  it("exports auditLogs", () => { expect(auditLogs).toBeDefined(); });
  it("exports userRoleEnum", () => { expect(userRoleEnum).toBeDefined(); });
  it("exports userStatusEnum", () => { expect(userStatusEnum).toBeDefined(); });
});
