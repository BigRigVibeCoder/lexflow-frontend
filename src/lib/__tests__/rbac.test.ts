import { describe, it, expect } from "vitest";
import { hasPermission, ALL_ROLES, ALL_PERMISSIONS, ROLE_PERMISSIONS, type UserRole, type Permission } from "../rbac";

describe("RBAC", () => {
  it("grants OWNER all permissions", () => { for (const p of ALL_PERMISSIONS) expect(hasPermission("owner", p)).toBe(true); });
  it("grants ATTORNEY matter:create", () => expect(hasPermission("attorney", "matter:create")).toBe(true));
  it("denies ATTORNEY matter:delete", () => expect(hasPermission("attorney", "matter:delete")).toBe(false));
  it("denies ATTORNEY user:manage", () => expect(hasPermission("attorney", "user:manage")).toBe(false));
  it("grants PARALEGAL document:upload", () => expect(hasPermission("paralegal", "document:upload")).toBe(true));
  it("denies PARALEGAL trust:deposit", () => expect(hasPermission("paralegal", "trust:deposit")).toBe(false));
  it("grants BOOKKEEPER trust:admin", () => expect(hasPermission("bookkeeper", "trust:admin")).toBe(true));
  it("denies BOOKKEEPER matter:create", () => expect(hasPermission("bookkeeper", "matter:create")).toBe(false));
  it("grants INTAKE client:create", () => expect(hasPermission("intake_specialist", "client:create")).toBe(true));
  it("denies INTAKE trust:read", () => expect(hasPermission("intake_specialist", "trust:read")).toBe(false));
  it("exhaustive matrix", () => {
    const r: Array<{role:UserRole;perm:Permission;ok:boolean}> = [];
    for (const role of ALL_ROLES) for (const p of ALL_PERMISSIONS) { r.push({role,perm:p,ok:hasPermission(role,p)}); expect(hasPermission(role,p)).toBe(ROLE_PERMISSIONS[role].includes(p)); }
    expect(r.length).toBe(ALL_ROLES.length * ALL_PERMISSIONS.length);
  });
  it("invalid role returns false", () => expect(hasPermission("nope" as UserRole, "matter:read")).toBe(false));
});
