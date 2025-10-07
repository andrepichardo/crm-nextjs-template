import { z } from "zod"

export const dealSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  company_id: z.string().uuid().optional().nullable(),
  contact_id: z.string().uuid().optional().nullable(),
  value: z.number().min(0, "Value must be positive"),
  currency: z.string().default("USD"),
  stage: z.enum(["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).default("lead"),
  probability: z.number().min(0).max(100).optional().nullable(),
  expected_close_date: z.string().optional().nullable(),
  description: z.string().optional(),
  owner_id: z.string().uuid().optional().nullable(),
})

export type DealFormData = z.infer<typeof dealSchema>
