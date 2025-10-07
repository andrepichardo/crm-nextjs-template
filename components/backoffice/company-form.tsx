"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { companySchema, type CompanyFormData } from "@/lib/validations/company"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface CompanyFormProps {
  company?: any // Added company prop for edit mode
  onSuccess?: () => void
}

export function CompanyForm({ company, onSuccess }: CompanyFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isEditMode = !!company // Determine if we're editing

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: company || {}, // Use company data if editing
  })

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (isEditMode) {
        const { error: updateError } = await supabase.from("companies").update(data).eq("id", company.id)

        if (updateError) throw updateError

        toast({
          title: "Company updated",
          description: "Company has been updated successfully.",
        })
      } else {
        const { error: insertError } = await supabase.from("companies").insert({
          ...data,
          created_by: user?.id,
        })

        if (insertError) throw insertError

        toast({
          title: "Company created",
          description: "New company has been added successfully.",
        })
      }

      router.refresh()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? "update" : "create"} company`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" type="url" placeholder="https://example.com" {...register("website")} />
          {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" {...register("industry")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Company Size</Label>
        <Select defaultValue={company?.size || undefined} onValueChange={(value) => setValue("size", value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1-10 employees</SelectItem>
            <SelectItem value="11-50">11-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="201-500">201-500 employees</SelectItem>
            <SelectItem value="501-1000">501-1000 employees</SelectItem>
            <SelectItem value="1000+">1000+ employees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={4} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Company" : "Create Company"}
        </Button>
      </div>
    </form>
  )
}
