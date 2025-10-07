import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, TrendingUp } from "lucide-react"
import { redirect } from "next/navigation"

export default async function PortalOverview() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: contact } = await supabase
    .from("contacts")
    .select("*")
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .limit(1)
    .maybeSingle()

  console.log("[v0] Contact found:", contact ? "yes" : "no", "for user:", user.email)

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("contact_id", contact?.id || "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false })

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("related_to_id", contact?.id || "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false })
    .limit(5)

  const activeDeals = deals?.filter((d) => !["closed_won", "closed_lost"].includes(d.stage)) || []
  const totalValue = deals?.reduce((sum, deal) => sum + Number(deal.value), 0) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {contact?.first_name || user.email?.split("@")[0] || "Customer"}!
        </h1>
        <p className="text-muted-foreground">Here's an overview of your account</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals.length}</div>
            <p className="text-xs text-muted-foreground">Deals in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities?.length || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Active Deals</CardTitle>
            <CardDescription>Deals currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            {activeDeals.length > 0 ? (
              <div className="space-y-4">
                {activeDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{deal.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">{deal.stage.replace("_", " ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: deal.currency || "USD",
                        }).format(Number(deal.value))}
                      </p>
                      {deal.expected_close_date && (
                        <p className="text-xs text-muted-foreground">
                          Close: {new Date(deal.expected_close_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active deals</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Latest activities on your account</CardDescription>
          </CardHeader>
          <CardContent>
            {activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {activity.activity_type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activities</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
