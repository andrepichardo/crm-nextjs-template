"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactFormData } from "@/lib/validations/contact"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface ContactFormProps {
  contact?: any // Added contact prop for edit mode
  onSuccess?: () => void
  companies?: Array<{ id: string; name: string }>
}

export function ContactForm({ contact, onSuccess, companies = [] }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isEditMode = !!contact // Determine if we're editing

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact || {
      // Use contact data if editing
      status: "active",
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (isEditMode) {
        const { error: updateError } = await supabase.from("contacts").update(data).eq("id", contact.id)

        if (updateError) throw updateError

        toast({
          title: "Contact updated",
          description: "Contact has been updated successfully.",
        })
      } else {
        const { error: insertError } = await supabase.from("contacts").insert({
          ...data,
          created_by: user?.id,
        })

        if (insertError) throw insertError

        toast({
          title: "Contact created",
          description: "New contact has been added successfully.",
        })
      }

      router.refresh()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? "update" : "create"} contact`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input id="first_name" {...register("first_name")} />
          {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input id="last_name" {...register("last_name")} />
          {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" {...register("position")} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company_id">Company</Label>
          <Select
            defaultValue={contact?.company_id || undefined}
            onValueChange={(value) => setValue("company_id", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={contact?.status || "active"}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Contact" : "Create Contact"}
        </Button>
      </div>
    </form>
  )
}
