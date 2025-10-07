import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AvatarUpload } from "@/components/backoffice/avatar-upload" // Import AvatarUpload component

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id || "")
    .single()

  const initials =
    profile?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    profile?.email?.[0].toUpperCase() ||
    "U"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AvatarUpload userId={user?.id || ""} currentAvatarUrl={profile?.avatar_url} initials={initials} />

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" defaultValue={profile?.full_name || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={profile?.email || ""} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue={profile?.role || ""} disabled />
              </div>
            </div>

            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Account Status</p>
                <p className="text-sm text-muted-foreground">Your account is active</p>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
