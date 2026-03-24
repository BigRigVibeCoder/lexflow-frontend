import { describe, it, expect } from "vitest";
import { getTableName } from "drizzle-orm";
import { auditLogs } from "./audit-logs";

describe("auditLogs schema", () => {
  it("exports auditLogs table", () => { expect(auditLogs).toBeDefined(); });
  it("has correct table name", () => { expect(getTableName(auditLogs)).toBe("audit_logs"); });
});
