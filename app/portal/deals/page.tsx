import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const stageProgress = {
  lead: 10,
  qualified: 30,
  proposal: 50,
  negotiation: 75,
  closed_won: 100,
  closed_lost: 0,
}

const stageColors = {
  lead: "secondary",
  qualified: "default",
  proposal: "default",
  negotiation: "default",
  closed_won: "default",
  closed_lost: "destructive",
}

export default async function PortalDeals() {
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

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("contact_id", contact?.id || "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Deals</h1>
        <p className="text-muted-foreground">View and track your deals</p>
      </div>

      <div className="grid gap-4">
        {deals && deals.length > 0 ? (
          deals.map((deal) => (
            <Card key={deal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{deal.title}</CardTitle>
                    <CardDescription className="mt-1">{deal.description || "No description provided"}</CardDescription>
                  </div>
                  <Badge variant={stageColors[deal.stage as keyof typeof stageColors] as any} className="capitalize">
                    {deal.stage.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deal Value</span>
                  <span className="text-lg font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: deal.currency || "USD",
                    }).format(Number(deal.value))}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{stageProgress[deal.stage as keyof typeof stageProgress]}%</span>
                  </div>
                  <Progress value={stageProgress[deal.stage as keyof typeof stageProgress]} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {deal.probability !== null && (
                    <div>
                      <span className="text-muted-foreground">Probability</span>
                      <p className="font-medium">{deal.probability}%</p>
                    </div>
                  )}
                  {deal.expected_close_date && (
                    <div>
                      <span className="text-muted-foreground">Expected Close</span>
                      <p className="font-medium">{new Date(deal.expected_close_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">No deals found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
