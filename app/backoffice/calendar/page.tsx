import { CalendarView } from "@/components/backoffice/calendar-view"

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">View and manage your tasks, meetings, and deadlines</p>
      </div>

      <CalendarView />
    </div>
  )
}
