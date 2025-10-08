import { createClient } from "@/lib/supabase/server"
import { DataTable } from "@/components/ui/data-table"
import { createColumns } from "./columns"
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

  const [{ data: contacts, error: contactsError }, { data: companies, error: companiesError }] = await Promise.all([
    supabase.from("contacts").select("*").order("created_at", { ascending: false }),
    supabase.from("companies").select("id, name").order("name"),
  ])

  if (contactsError) {
    console.error("[v0] Error fetching contacts:", contactsError)
    console.error("[v0] Error details:", JSON.stringify(contactsError, null, 2))
  }

  if (companiesError) {
    console.error("[v0] Error fetching companies:", companiesError)
    console.error("[v0] Error details:", JSON.stringify(companiesError, null, 2))
  }

  const columns = createColumns(companies || [])

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4 text-center">
        <p className="text-sm font-semibold text-green-700">
          ✅ TEST - Código actualizado desplegado correctamente - Versión: {new Date().toISOString()}
        </p>
      </div>

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

      {contactsError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Failed to load contacts. Please check your database permissions.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={contacts || []}
          searchKey="first_name"
          searchPlaceholder="Search contacts..."
        />
      )}
    </div>
  )
}
