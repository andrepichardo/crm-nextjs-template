export type Role = "admin" | "manager" | "sales_rep" | "viewer"
export type UserType = "staff" | "customer"

export type Permission =
  | "contacts.view"
  | "contacts.create"
  | "contacts.edit"
  | "contacts.delete"
  | "companies.view"
  | "companies.create"
  | "companies.edit"
  | "companies.delete"
  | "deals.view"
  | "deals.create"
  | "deals.edit"
  | "deals.delete"
  | "tasks.view"
  | "tasks.create"
  | "tasks.edit"
  | "tasks.delete"
  | "reports.view"
  | "settings.view"
  | "settings.edit"
  | "users.manage"

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  user_type: UserType
  role?: Role
}

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "contacts.delete",
    "companies.view",
    "companies.create",
    "companies.edit",
    "companies.delete",
    "deals.view",
    "deals.create",
    "deals.edit",
    "deals.delete",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "tasks.delete",
    "reports.view",
    "settings.view",
    "settings.edit",
    "users.manage",
  ],
  manager: [
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "contacts.delete",
    "companies.view",
    "companies.create",
    "companies.edit",
    "companies.delete",
    "deals.view",
    "deals.create",
    "deals.edit",
    "deals.delete",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "tasks.delete",
    "reports.view",
    "settings.view",
  ],
  sales_rep: [
    "contacts.view",
    "contacts.create",
    "contacts.edit",
    "companies.view",
    "companies.create",
    "deals.view",
    "deals.create",
    "deals.edit",
    "tasks.view",
    "tasks.create",
    "tasks.edit",
    "reports.view",
  ],
  viewer: ["contacts.view", "companies.view", "deals.view", "tasks.view", "reports.view"],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}

export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role] ?? []
}

export function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    admin: "Administrator",
    manager: "Manager",
    sales_rep: "Sales Representative",
    viewer: "Viewer",
  }
  return labels[role]
}

export function getRoleDescription(role: Role): string {
  const descriptions: Record<Role, string> = {
    admin: "Full access to all features and settings",
    manager: "Manage team, view reports, and edit all records",
    sales_rep: "Create and manage own contacts, deals, and tasks",
    viewer: "Read-only access to contacts, deals, and reports",
  }
  return descriptions[role]
}

export function canAccessBackoffice(userType: UserType): boolean {
  return userType === "staff"
}

export function canAccessPortal(userType: UserType): boolean {
  return userType === "customer"
}
