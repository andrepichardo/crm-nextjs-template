"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DataTable } from "@/components/ui/data-table"
import { createTaskColumns } from "./columns"
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasErrors, setHasErrors] = useState(false)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const [{ data: tasksData, error: tasksError }, { data: usersData, error: usersError }] = await Promise.all([
        supabase.from("tasks").select("*").order("due_date", { ascending: true }),
        supabase.from("profiles").select("id, full_name, email").eq("user_type", "staff").order("full_name"),
      ])

      if (tasksError) {
        console.error("[v0] Error fetching tasks:", tasksError)
        setHasErrors(true)
      }

      if (usersError) {
        console.error("[v0] Error fetching users:", usersError)
        setHasErrors(true)
      }

      setTasks(tasksData || [])
      setUsers(usersData || [])
      setLoading(false)
    }

    loadData()
  }, [])

  const columns = createTaskColumns(users)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    )
  }

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
            <TaskForm users={users} />
          </DialogContent>
        </Dialog>
      </div>

      {hasErrors ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load tasks. Please check your database permissions and ensure all migrations have been run.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={tasks} searchKey="title" searchPlaceholder="Search tasks..." />
      )}
    </div>
  )
}
