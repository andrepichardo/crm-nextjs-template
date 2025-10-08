import { createClient } from "@/lib/supabase/server"
import { DealsTable } from "./deals-table"
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

  const [{ data: deals }, { data: companies }, { data: contacts }, { data: users }] = await Promise.all([
    supabase.from("deals").select("*").order("created_at", { ascending: false }),
    supabase.from("companies").select("id, name").order("name"),
    supabase.from("contacts").select("id, first_name, last_name").order("first_name"),
    supabase.from("profiles").select("id, full_name, email").eq("user_type", "staff").order("full_name"),
  ])

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
          <DealsTable deals={deals || []} companies={companies || []} contacts={contacts || []} users={users || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
