"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
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

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hasErrors, setHasErrors] = useState(false)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const [
        { data: dealsData, error: dealsError },
        { data: companiesData, error: companiesError },
        { data: contactsData, error: contactsError },
        { data: usersData, error: usersError },
      ] = await Promise.all([
        supabase.from("deals").select("*").order("created_at", { ascending: false }),
        supabase.from("companies").select("id, name").order("name"),
        supabase.from("contacts").select("id, first_name, last_name").order("first_name"),
        supabase.from("profiles").select("id, full_name, email").eq("user_type", "staff").order("full_name"),
      ])

      if (dealsError) {
        console.error("[v0] Error fetching deals:", dealsError)
        setHasErrors(true)
      }

      if (usersError) {
        console.error("[v0] Error fetching users:", usersError)
        setHasErrors(true)
      }

      setDeals(dealsData || [])
      setCompanies(companiesData || [])
      setContacts(contactsData || [])
      setUsers(usersData || [])
      setLoading(false)
    }

    loadData()
  }, [])

  const columns = createDealColumns(companies, contacts, users)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading deals...</div>
      </div>
    )
  }

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
            <DealForm companies={companies} contacts={contacts} users={users} />
          </DialogContent>
        </Dialog>
      </div>

      {hasErrors ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load some data. Please check your database permissions and ensure all migrations have been run.
          </p>
        </div>
      ) : (
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
            <PipelineBoard deals={deals} />
          </TabsContent>

          <TabsContent value="table" className="space-y-4">
            <DataTable columns={columns} data={deals} searchKey="title" searchPlaceholder="Search deals..." />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
