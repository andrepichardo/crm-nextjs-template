import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Phone, Mail, MessageSquare, Calendar, AlertCircle } from "lucide-react"

const activityIcons = {
  note: MessageSquare,
  call: Phone,
  email: Mail,
  meeting: Calendar,
  status_change: AlertCircle,
}

export default async function ActivitiesPage() {
  const supabase = await createClient()

  const { data: activities } = await supabase
    .from("activities")
    .select(
      `
      *,
      created_by:profiles!activities_created_by_fkey(full_name, email)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
        <p className="text-muted-foreground">View all activity history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Recent activities from your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activities && activities.length > 0 ? (
              activities.map((activity) => {
                const Icon = activityIcons[activity.activity_type as keyof typeof activityIcons] || MessageSquare
                const initials =
                  activity.created_by?.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() ||
                  activity.created_by?.email?.[0].toUpperCase() ||
                  "U"

                return (
                  <div key={activity.id} className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{activity.title}</span>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {activity.activity_type}
                        </Badge>
                      </div>
                      {activity.description && <p className="text-sm text-muted-foreground">{activity.description}</p>}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.created_by?.full_name || activity.created_by?.email || "Unknown user"}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
                        {activity.related_to_type && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{activity.related_to_type}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-muted-foreground">No activities yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
