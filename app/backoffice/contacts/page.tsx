import { createClient } from "@/lib/supabase/server"
import { ContactsTable } from "./contacts-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ContactForm } from "@/components/backoffice/contact-form"

export default async function ContactsPage() {
  const supabase = await createClient()

  const [{ data: contacts }, { data: companies }] = await Promise.all([
    supabase.from("contacts").select("*").order("created_at", { ascending: false }),
    supabase.from("companies").select("id, name").order("name"),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage your contacts and leads</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Contact</DialogTitle>
              <DialogDescription>Add a new contact to your CRM</DialogDescription>
            </DialogHeader>
            <ContactForm companies={companies || []} />
          </DialogContent>
        </Dialog>
      </div>

      <ContactsTable contacts={contacts || []} companies={companies || []} />
    </div>
  )
}
