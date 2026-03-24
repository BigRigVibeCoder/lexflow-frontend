export type UserRole = "owner" | "attorney" | "paralegal" | "bookkeeper" | "intake_specialist";
export const ALL_ROLES: readonly UserRole[] = ["owner", "attorney", "paralegal", "bookkeeper", "intake_specialist"];

export type Permission =
  | "matter:create" | "matter:read" | "matter:update" | "matter:delete" | "matter:assign"
  | "client:create" | "client:read" | "client:update" | "client:delete"
  | "contact:create" | "contact:read" | "contact:update" | "contact:delete"
  | "trust:read" | "trust:deposit" | "trust:disburse" | "trust:reconcile" | "trust:admin"
  | "document:upload" | "document:read" | "document:delete" | "document:admin"
  | "time:create" | "time:read" | "time:read_all" | "time:update" | "time:delete"
  | "invoice:create" | "invoice:read" | "invoice:send" | "invoice:void"
  | "user:manage" | "settings:manage" | "audit:read";

export const ALL_PERMISSIONS: readonly Permission[] = [
  "matter:create", "matter:read", "matter:update", "matter:delete", "matter:assign",
  "client:create", "client:read", "client:update", "client:delete",
  "contact:create", "contact:read", "contact:update", "contact:delete",
  "trust:read", "trust:deposit", "trust:disburse", "trust:reconcile", "trust:admin",
  "document:upload", "document:read", "document:delete", "document:admin",
  "time:create", "time:read", "time:read_all", "time:update", "time:delete",
  "invoice:create", "invoice:read", "invoice:send", "invoice:void",
  "user:manage", "settings:manage", "audit:read",
];

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  owner: [...ALL_PERMISSIONS],
  attorney: ["matter:create","matter:read","matter:update","matter:assign","client:create","client:read","client:update","contact:create","contact:read","contact:update","trust:read","trust:deposit","trust:disburse","document:upload","document:read","document:delete","time:create","time:read","time:read_all","time:update","invoice:create","invoice:read","invoice:send","audit:read"],
  paralegal: ["matter:create","matter:read","matter:update","client:create","client:read","client:update","contact:create","contact:read","contact:update","trust:read","document:upload","document:read","time:create","time:read","time:update","invoice:read"],
  bookkeeper: ["matter:read","client:read","trust:read","trust:deposit","trust:disburse","trust:reconcile","trust:admin","time:read","time:read_all","invoice:create","invoice:read","invoice:send","invoice:void"],
  intake_specialist: ["matter:create","matter:read","client:create","client:read","client:update","contact:create","contact:read","contact:update","document:upload","document:read"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(permission);
}
