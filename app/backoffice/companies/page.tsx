import { createClient } from "@/lib/supabase/server"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
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
import { CompanyForm } from "@/components/backoffice/company-form"

export default async function CompaniesPage() {
  const supabase = await createClient()

  const { data: companies } = await supabase.from("companies").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage your company accounts</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Company</DialogTitle>
              <DialogDescription>Add a new company to your CRM</DialogDescription>
            </DialogHeader>
            <CompanyForm />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={companies || []} searchKey="name" searchPlaceholder="Search companies..." />
    </div>
  )
}
