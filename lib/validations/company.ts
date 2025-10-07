import { z } from "zod"

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]).optional().nullable(),
  description: z.string().optional(),
})

export type CompanyFormData = z.infer<typeof companySchema>
