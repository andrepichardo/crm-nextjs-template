"use client"

import { useState } from "react"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { type Role, getRoleLabel, getRoleDescription } from "@/lib/permissions"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: string
  name: string
  email: string
  role: Role
  status: "active" | "inactive"
  lastActive: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "sarah@example.com",
    role: "manager",
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Mike Sales",
    email: "mike@example.com",
    role: "sales_rep",
    status: "active",
    lastActive: "5 minutes ago",
  },
  {
    id: "4",
    name: "Lisa Viewer",
    email: "lisa@example.com",
    role: "viewer",
    status: "inactive",
    lastActive: "1 week ago",
  },
]

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [newUserRole, setNewUserRole] = useState<Role>("sales_rep")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleCreateStaffUser = async () => {
    setIsCreating(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: Math.random().toString(36).slice(-12) + "A1!",
        options: {
          data: {
            full_name: newUserName,
            user_type: "staff",
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        const { error: roleError } = await supabase.from("user_roles").upsert({
          user_id: data.user.id,
          role: newUserRole,
        })

        if (roleError) throw roleError
      }

      setSuccess(`Staff account created successfully! An email has been sent to ${newUserEmail} to set their password.`)
      setNewUserEmail("")
      setNewUserName("")
      setNewUserRole("sales_rep")

      setTimeout(() => {
        setIsAddUserOpen(false)
        setSuccess(null)
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create staff account")
    } finally {
      setIsCreating(false)
    }
  }

  const getRoleBadgeVariant = (role: Role) => {
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
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">Last active {user.lastActive}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem>View Permissions</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Deactivate User</DropdownMenuItem>
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
    </div>
  )
}
