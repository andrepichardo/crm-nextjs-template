"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { UserPlus, MoreVertical, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { type Role, getRoleLabel, getRoleDescription } from "@/lib/permissions"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createStaffUser, updateUserProfile, updateUserRole, deleteUser } from "./actions"

interface User {
  id: string
  full_name: string | null
  email: string | null
  role: Role | null
  user_type: string
  created_at: string
  updated_at: string | null
}

interface UsersClientProps {
  users: User[]
}

export function UsersClient({ users: initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editUserName, setEditUserName] = useState("")
  const [editUserRole, setEditUserRole] = useState<Role>("sales_rep")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [newUserRole, setNewUserRole] = useState<Role>("sales_rep")
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
      }
    }
    getCurrentUser()
  }, [])

  const handleCreateStaffUser = async () => {
    setIsCreating(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await createStaffUser(newUserEmail, newUserName, newUserRole)

      if (!result.success) {
        throw new Error(result.error)
      }

      setSuccess(result.message)
      setNewUserEmail("")
      setNewUserName("")
      setNewUserRole("sales_rep")

      router.refresh()

      setTimeout(() => {
        setIsAddUserOpen(false)
        setSuccess(null)
      }, 1500)
    } catch (err) {
      console.error("[v0] Error creating user:", err)
      setError(err instanceof Error ? err.message : "Failed to create staff account")
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditUserName(user.full_name || "")
    setEditUserRole(user.role || "sales_rep")
    setIsEditUserOpen(true)
  }

  const handleChangeRole = (user: User) => {
    const adminCount = users.filter((u) => u.role === "admin" && u.user_type === "staff").length

    if (user.role === "admin" && adminCount === 1) {
      setError("Cannot change the role of the last administrator. Please assign another admin first.")
      setTimeout(() => setError(null), 5000)
      return
    }

    setSelectedUser(user)
    setEditUserRole(user.role || "sales_rep")
    setIsChangeRoleOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    setIsUpdating(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await updateUserProfile(selectedUser.id, editUserName, editUserRole)

      if (!result.success) {
        throw new Error(result.error)
      }

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, full_name: editUserName, role: editUserRole, updated_at: new Date().toISOString() }
            : u,
        ),
      )

      setSuccess(result.message)

      setTimeout(() => {
        setIsEditUserOpen(false)
        setSuccess(null)
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!selectedUser) return

    const adminCount = users.filter((u) => u.role === "admin" && u.user_type === "staff").length

    if (selectedUser.role === "admin" && editUserRole !== "admin" && adminCount === 1) {
      setError("Cannot change the role of the last administrator. Please assign another admin first.")
      return
    }

    setIsUpdating(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await updateUserRole(selectedUser.id, editUserRole)

      if (!result.success) {
        throw new Error(result.error)
      }

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, role: editUserRole, updated_at: new Date().toISOString() } : u,
        ),
      )

      setSuccess(result.message)

      setTimeout(() => {
        setIsChangeRoleOpen(false)
        setSuccess(null)
      }, 1500)
    } catch (err) {
      console.error("[v0] Error updating role:", err)
      setError(err instanceof Error ? err.message : "Failed to update role")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (user.id === currentUserId) {
      setError("You cannot delete your own account")
      setTimeout(() => setError(null), 3000)
      return
    }

    if (
      !confirm(
        `Are you sure you want to permanently delete ${user.full_name || user.email}? This action cannot be undone.`,
      )
    ) {
      return
    }

    setError(null)
    setSuccess(null)

    try {
      const result = await deleteUser(user.id)

      if (!result.success) {
        throw new Error(result.error)
      }

      setUsers(users.filter((u) => u.id !== user.id))
      setSuccess(result.message)

      setTimeout(() => {
        setSuccess(null)
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error("[v0] Error deleting user:", err)
      setError(err instanceof Error ? err.message : "Failed to delete user")
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleDeactivateUser = async (user: User) => {
    if (user.id === currentUserId) {
      setError("You cannot deactivate your own account")
      return
    }

    if (!confirm(`Are you sure you want to deactivate ${user.full_name || user.email}?`)) {
      return
    }

    setError(null)
    try {
      alert("User deactivation requires admin API access. This feature will be implemented with server actions.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deactivate user")
    }
  }

  const handleResendConfirmation = async (user: User) => {
    if (!user.email) return

    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()

      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (resendError) throw resendError

      setSuccess(`Confirmation email resent to ${user.email}`)

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error("[v0] Error resending confirmation:", err)
      setError(err instanceof Error ? err.message : "Failed to resend confirmation email")
    }
  }

  const getRoleBadgeVariant = (role: Role | null) => {
    switch (role) {
      case "admin":
        return "default"
      case "manager":
        return "secondary"
      case "sales_rep":
        return "outline"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const currentUser = users.find((u) => u.id === currentUserId)
  const isAdmin = currentUser?.role === "admin"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage team members and their permissions</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Staff User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Staff Account</DialogTitle>
              <DialogDescription>
                Add a new staff member to your CRM. They will receive an email to set their password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  disabled={isCreating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  disabled={isCreating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUserRole}
                  onValueChange={(value) => setNewUserRole(value as Role)}
                  disabled={isCreating}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{getRoleLabel("admin")}</span>
                        <span className="text-xs text-muted-foreground">{getRoleDescription("admin")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="manager">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{getRoleLabel("manager")}</span>
                        <span className="text-xs text-muted-foreground">{getRoleDescription("manager")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="sales_rep">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{getRoleLabel("sales_rep")}</span>
                        <span className="text-xs text-muted-foreground">{getRoleDescription("sales_rep")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{getRoleLabel("viewer")}</span>
                        <span className="text-xs text-muted-foreground">{getRoleDescription("viewer")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={handleCreateStaffUser}
                disabled={isCreating || !newUserEmail || !newUserName}
              >
                {isCreating ? "Creating Account..." : "Create Staff Account"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>{users.length} users in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {user.full_name
                      ? user.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : user.email?.[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.full_name || "No name"}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {user.role ? (
                      <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        No role assigned
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">Created {getTimeAgo(user.created_at)}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit User</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeRole(user)}>Change Role</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert("View Permissions - Coming soon")}>
                        View Permissions
                      </DropdownMenuItem>
                      {isAdmin && user.id !== currentUserId && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user)}>
                            Delete User
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions
          </CardTitle>
          <CardDescription>Overview of permissions for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {(["admin", "manager", "sales_rep", "viewer"] as Role[]).map((role) => (
              <div key={role} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{getRoleLabel(role)}</h4>
                  <Badge variant={getRoleBadgeVariant(role)}>{role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{getRoleDescription(role)}</p>
                <div className="flex flex-wrap gap-1">
                  {role === "admin" && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        Full Access
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        User Management
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Settings
                      </Badge>
                    </>
                  )}
                  {role === "manager" && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        Edit All
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Reports
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Team View
                      </Badge>
                    </>
                  )}
                  {role === "sales_rep" && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        Create Records
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Edit Own
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        View Reports
                      </Badge>
                    </>
                  )}
                  {role === "viewer" && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        Read Only
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        View Reports
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and role</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={editUserRole}
                onValueChange={(value) => setEditUserRole(value as Role)}
                disabled={isUpdating}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{getRoleLabel("admin")}</SelectItem>
                  <SelectItem value="manager">{getRoleLabel("manager")}</SelectItem>
                  <SelectItem value="sales_rep">{getRoleLabel("sales_rep")}</SelectItem>
                  <SelectItem value="viewer">{getRoleLabel("viewer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleUpdateUser} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isChangeRoleOpen} onOpenChange={setIsChangeRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>Update the role for {selectedUser?.full_name || selectedUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="change-role">Role</Label>
              <Select
                value={editUserRole}
                onValueChange={(value) => setEditUserRole(value as Role)}
                disabled={isUpdating}
              >
                <SelectTrigger id="change-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{getRoleLabel("admin")}</span>
                      <span className="text-xs text-muted-foreground">{getRoleDescription("admin")}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{getRoleLabel("manager")}</span>
                      <span className="text-xs text-muted-foreground">{getRoleDescription("manager")}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sales_rep">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{getRoleLabel("sales_rep")}</span>
                      <span className="text-xs text-muted-foreground">{getRoleDescription("sales_rep")}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{getRoleLabel("viewer")}</span>
                      <span className="text-xs text-muted-foreground">{getRoleDescription("viewer")}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleUpdateRole} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
