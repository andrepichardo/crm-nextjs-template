import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  due_date: z.string().optional().nullable(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["todo", "in_progress", "completed", "cancelled"]).default("todo"),
  task_type: z.enum(["call", "email", "meeting", "follow_up", "other"]).optional().nullable(),
  related_to_type: z.enum(["contact", "company", "deal"]).optional().nullable(),
  related_to_id: z.string().uuid().optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
})

export type TaskFormData = z.infer<typeof taskSchema>
