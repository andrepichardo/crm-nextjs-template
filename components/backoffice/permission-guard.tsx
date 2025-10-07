"use client"

import type React from "react"

import { type Permission, hasPermission, type Role } from "@/lib/permissions"

interface PermissionGuardProps {
  permission: Permission
  userRole: Role
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ permission, userRole, children, fallback = null }: PermissionGuardProps) {
  if (!hasPermission(userRole, permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
