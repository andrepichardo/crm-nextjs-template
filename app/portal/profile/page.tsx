import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function PortalProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: contact } = await supabase
    .from("contacts")
    .select("*")
    .or(`user_id.eq.${user?.id},email.eq.${user?.email}`)
    .limit(1)
    .maybeSingle()

  const { data: company } = contact?.company_id
    ? await supabase.from("companies").select("*").eq("id", contact.company_id).maybeSingle()
    : { data: null }

  const initials = contact
    ? `${contact.first_name[0]}${contact.last_name[0]}`.toUpperCase()
    : user?.email?.[0].toUpperCase() || "U"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your profile information</p>
      </div>

      {!contact && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your profile information is not yet available. Please contact your account manager to set up your profile.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">
                  {contact ? `${contact.first_name} ${contact.last_name}` : user?.email?.split("@")[0] || "User"}
                </p>
                <Badge variant="secondary" className="capitalize">
                  {contact?.status || "Active"}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={contact?.email || user?.email || ""} disabled />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue={contact?.phone || ""} disabled />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" defaultValue={contact?.position || ""} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {company && (
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label>Company Name</Label>
                  <p className="mt-1 font-medium">{company.name}</p>
                </div>

                {company.website && (
                  <div>
                    <Label>Website</Label>
                    <p className="mt-1">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                    </p>
                  </div>
                )}

                {company.industry && (
                  <div>
                    <Label>Industry</Label>
                    <p className="mt-1">{company.industry}</p>
                  </div>
                )}

                {company.size && (
                  <div>
                    <Label>Company Size</Label>
                    <p className="mt-1">{company.size} employees</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
