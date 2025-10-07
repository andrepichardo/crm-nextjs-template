"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Task } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, CheckCircle2, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskForm } from "@/components/backoffice/task-form"
import { DeleteDialog } from "@/components/backoffice/delete-dialog"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
}

const statusColors = {
  todo: "secondary",
  in_progress: "default",
  completed: "outline",
  cancelled: "destructive",
}

function TaskActions({ task, users }: { task: Task; users: any[] }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const router = useRouter()

  const handleMarkComplete = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("tasks").update({ status: "completed" }).eq("id", task.id)

      if (error) throw error

      toast({
        title: "Task completed",
        description: "Task has been marked as completed.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {task.status !== "completed" && (
            <DropdownMenuItem onClick={handleMarkComplete}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as completed
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task information</DialogDescription>
          </DialogHeader>
          <TaskForm task={task} users={users} onSuccess={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>

      <DeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} table="tasks" id={task.id} title={task.title} />
    </>
  )
}

export function createTaskColumns(users: any[]): ColumnDef<Task>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Task
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const task = row.original
        return (
          <div className="flex items-center gap-2">
            {task.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            <div>
              <div className="font-medium">{task.title}</div>
              {task.task_type && <div className="text-xs text-muted-foreground capitalize">{task.task_type}</div>}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as keyof typeof priorityColors
        return (
          <Badge className={`${priorityColors[priority]} text-white capitalize`} variant="default">
            {priority}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors
        return (
          <Badge variant={statusColors[status] as any} className="capitalize">
            {status.replace("_", " ")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "due_date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue("due_date") as string | null
        if (!date) return <span className="text-muted-foreground">-</span>

        const dueDate = new Date(date)
        const today = new Date()
        const isOverdue = dueDate < today && row.original.status !== "completed"

        return (
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            {dueDate.toLocaleDateString()}
            {isOverdue && " (Overdue)"}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <TaskActions task={row.original} users={users} />
      },
    },
  ]
}
