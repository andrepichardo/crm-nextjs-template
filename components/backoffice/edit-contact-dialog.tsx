"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ContactForm } from "./contact-form"

interface EditContactDialogProps {
  contact: any
  companies: Array<{ id: string; name: string }>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditContactDialog({ contact, companies, open, onOpenChange }: EditContactDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>Update contact information</DialogDescription>
        </DialogHeader>
        <ContactForm contact={contact} companies={companies} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
