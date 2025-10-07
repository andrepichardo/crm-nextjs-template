"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { dealSchema, type DealFormData } from "@/lib/validations/deal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface DealFormProps {
  deal?: any // Added deal prop for edit mode
  onSuccess?: () => void
  companies?: Array<{ id: string; name: string }>
  contacts?: Array<{ id: string; first_name: string; last_name: string }>
  users?: Array<{ id: string; full_name: string | null; email: string }>
}

export function DealForm({ deal, onSuccess, companies = [], contacts = [], users = [] }: DealFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isEditMode = !!deal // Determine if we're editing

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: deal || {
      // Use deal data if editing
      stage: "lead",
      currency: "USD",
      value: 0,
    },
  })

  const onSubmit = async (data: DealFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (isEditMode) {
        const { error: updateError } = await supabase.from("deals").update(data).eq("id", deal.id)

        if (updateError) throw updateError

        toast({
          title: "Deal updated",
          description: "Deal has been updated successfully.",
        })
      } else {
        const { error: insertError } = await supabase.from("deals").insert({
          ...data,
          created_by: user?.id,
        })

        if (insertError) throw insertError

        toast({
          title: "Deal created",
          description: "New deal has been added successfully.",
        })
      }

      router.refresh()
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? "update" : "create"} deal`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Deal Title *</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="value">Value *</Label>
          <Input id="value" type="number" step="0.01" {...register("value", { valueAsNumber: true })} />
          {errors.value && <p className="text-sm text-destructive">{errors.value.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select defaultValue={deal?.currency || "USD"} onValueChange={(value) => setValue("currency", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="stage">Stage</Label>
          <Select defaultValue={deal?.stage || "lead"} onValueChange={(value) => setValue("stage", value as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="probability">Probability (%)</Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            {...register("probability", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company_id">Company</Label>
          <Select
            defaultValue={deal?.company_id || undefined}
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
          <Label htmlFor="contact_id">Contact</Label>
          <Select
            defaultValue={deal?.contact_id || undefined}
            onValueChange={(value) => setValue("contact_id", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.first_name} {contact.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="owner_id">Owner</Label>
          <Select
            defaultValue={deal?.owner_id || undefined}
            onValueChange={(value) => setValue("owner_id", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select owner" />
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

        <div className="space-y-2">
          <Label htmlFor="expected_close_date">Expected Close Date</Label>
          <Input id="expected_close_date" type="date" {...register("expected_close_date")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={4} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  )
}
