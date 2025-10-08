"use client"

import { DataTable } from "@/components/ui/data-table"
import { createTaskColumns } from "./columns"
import type { Task } from "@/lib/types/database"

interface TasksTableProps {
  tasks: Task[]
  users: any[]
}

export function TasksTable({ tasks, users }: TasksTableProps) {
  const columns = createTaskColumns(users)

  return <DataTable columns={columns} data={tasks} searchKey="title" searchPlaceholder="Search tasks..." />
}
