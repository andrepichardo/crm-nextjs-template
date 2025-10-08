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

  try {
    const [{ data: contacts, error: contactsError }, { data: companies, error: companiesError }] = await Promise.all([
      supabase.from("contacts").select("*").order("created_at", { ascending: false }),
      supabase.from("companies").select("id, name").order("name"),
    ])

    if (contactsError) {
      console.error("[v0] Error fetching contacts:", contactsError)
      throw new Error(`Failed to load contacts: ${contactsError.message}`)
    }

    if (companiesError) {
      console.error("[v0] Error fetching companies:", companiesError)
      throw new Error(`Failed to load companies: ${companiesError.message}`)
    }

    const columns = createColumns(companies || [])

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

        <DataTable
          columns={columns}
          data={contacts || []}
          searchKey="first_name"
          searchPlaceholder="Search contacts..."
        />
      </div>
    )
  } catch (error) {
    console.error("[v0] Contacts page error:", error)
    throw error
  }
}
