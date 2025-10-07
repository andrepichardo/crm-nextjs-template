"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "task" | "meeting" | "deadline"
  priority?: "low" | "medium" | "high"
}

const mockEvents: CalendarEvent[] = [
  { id: "1", title: "Follow up with Acme Corp", date: new Date(2025, 0, 15), type: "task", priority: "high" },
  { id: "2", title: "Product demo for TechStart", date: new Date(2025, 0, 18), type: "meeting", priority: "medium" },
  { id: "3", title: "Proposal deadline - GlobalTech", date: new Date(2025, 0, 20), type: "deadline", priority: "high" },
  { id: "4", title: "Check in with Sarah Johnson", date: new Date(2025, 0, 22), type: "task", priority: "low" },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getEventsForDate = (day: number) => {
    return mockEvents.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      )
    })
  }

  const getEventColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "task":
        return "bg-primary"
      case "meeting":
        return "bg-accent"
      case "deadline":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const events = getEventsForDate(day)
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  className={cn(
                    "min-h-20 p-2 border rounded-lg hover:bg-accent/50 transition-colors text-left",
                    isToday && "border-primary bg-primary/5",
                  )}
                >
                  <div className={cn("text-sm font-medium mb-1", isToday && "text-primary")}>{day}</div>
                  <div className="space-y-1">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={cn("text-xs p-1 rounded text-white truncate", getEventColor(event.type))}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-muted-foreground">+{events.length - 2} more</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEvents
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((event) => (
                <div key={event.id} className="flex gap-3 p-3 border rounded-lg">
                  <div className={cn("w-1 rounded-full", getEventColor(event.type))} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{event.type}</span>
                      {event.priority && (
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full capitalize",
                            event.priority === "high" && "bg-destructive/10 text-destructive",
                            event.priority === "medium" && "bg-accent/10 text-accent",
                            event.priority === "low" && "bg-muted",
                          )}
                        >
                          {event.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
