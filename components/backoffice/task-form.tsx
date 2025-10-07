"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { taskSchema, type TaskFormData } from "@/lib/validations/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface TaskFormProps {
  task?: any // Added task prop for edit mode
  onSuccess?: () => void
  users?: Array<{ id: string; full_name: string | null; email: string }>
}

export function TaskForm({ task, onSuccess, users = [] }: TaskFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isEditMode = !!task // Determine if we're editing

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task || {
      // Use task data if editing
      priority: "medium",
      status: "todo",
    },
  })

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (isEditMode) {
        const { error: updateError } = await supabase.from("tasks").update(data).eq("id", task.id)

        if (updateError) throw updateError

        toast({
          title: "Task updated",
          description: "Task has been updated successfully.",
        })
      } else {
        const { error: insertError } = await supabase.from("tasks").insert({
          ...data,
          created_by: user?.id,
        })

        if (insertError) throw insertError

        toast({
          title: "Task created",
          description: "New task has been added successfully.",
        })
      }

      router.refresh()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? "update" : "create"} task`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title *</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={3} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            defaultValue={task?.priority || "medium"}
            onValueChange={(value) => setValue("priority", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={task?.status || "todo"} onValueChange={(value) => setValue("status", value as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="task_type">Task Type</Label>
          <Select
            defaultValue={task?.task_type || undefined}
            onValueChange={(value) => setValue("task_type", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="follow_up">Follow Up</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input id="due_date" type="datetime-local" {...register("due_date")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigned_to">Assign To</Label>
        <Select
          defaultValue={task?.assigned_to || undefined}
          onValueChange={(value) => setValue("assigned_to", value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.full_name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}
