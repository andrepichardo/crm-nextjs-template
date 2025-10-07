import { z } from "zod"

export const contactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().optional(),
  company_id: z.string().uuid().optional().nullable(),
  status: z.enum(["active", "inactive", "lead"]).default("active"),
})

export type ContactFormData = z.infer<typeof contactSchema>
