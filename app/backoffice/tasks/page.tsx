import { createClient } from "@/lib/supabase/server"
import { TasksTable } from "./tasks-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TaskForm } from "@/components/backoffice/task-form"

export default async function TasksPage() {
  const supabase = await createClient()

  const [{ data: tasks }, { data: users }] = await Promise.all([
    supabase.from("tasks").select("*").order("due_date", { ascending: true }),
    supabase.from("profiles").select("id, full_name, email").eq("user_type", "staff").order("full_name"),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and to-dos</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your list</DialogDescription>
            </DialogHeader>
            <TaskForm users={users || []} />
          </DialogContent>
        </Dialog>
      </div>

      <TasksTable tasks={tasks || []} users={users || []} />
    </div>
  )
}
