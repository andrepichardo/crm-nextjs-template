import { createClient } from "@/lib/supabase/server"
import { DataTable } from "@/components/ui/data-table"
import { createDealColumns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, Table } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DealForm } from "@/components/backoffice/deal-form"
import { PipelineBoard } from "@/components/backoffice/pipeline-board"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DealsPage() {
  const supabase = await createClient()

  try {
    const [
      { data: deals, error: dealsError },
      { data: companies, error: companiesError },
      { data: contacts, error: contactsError },
      { data: users, error: usersError },
    ] = await Promise.all([
      supabase.from("deals").select("*").order("created_at", { ascending: false }),
      supabase.from("companies").select("id, name").order("name"),
      supabase.from("contacts").select("id, first_name, last_name").order("first_name"),
      supabase.from("profiles").select("id, full_name, email").order("full_name"),
    ])

    if (dealsError) {
      console.error("[v0] Error fetching deals:", dealsError)
      throw new Error(`Failed to load deals: ${dealsError.message}`)
    }

    if (companiesError) {
      console.error("[v0] Error fetching companies:", companiesError)
      throw new Error(`Failed to load companies: ${companiesError.message}`)
    }

    if (contactsError) {
      console.error("[v0] Error fetching contacts:", contactsError)
      throw new Error(`Failed to load contacts: ${contactsError.message}`)
    }

    if (usersError) {
      console.error("[v0] Error fetching users:", usersError)
      throw new Error(`Failed to load users: ${usersError.message}`)
    }

    const columns = createDealColumns(companies || [], contacts || [], users || [])

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
            <p className="text-muted-foreground">Manage your sales pipeline</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
                <DialogDescription>Add a new deal to your pipeline</DialogDescription>
              </DialogHeader>
              <DealForm companies={companies || []} contacts={contacts || []} users={users || []} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="pipeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pipeline" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Pipeline View
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <Table className="h-4 w-4" />
              Table View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-4">
            <PipelineBoard deals={deals || []} />
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <DataTable columns={columns} data={deals || []} searchKey="title" searchPlaceholder="Search deals..." />
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("[v0] Deals page error:", error)
    throw error
  }
}
