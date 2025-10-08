"use client"

import { DataTable } from "@/components/ui/data-table"
import { createDealColumns } from "./columns"
import type { Deal } from "@/lib/types/database"

interface DealsTableProps {
  deals: Deal[]
  companies: any[]
  contacts: any[]
  users: any[]
}

export function DealsTable({ deals, companies, contacts, users }: DealsTableProps) {
  const columns = createDealColumns(companies, contacts, users)

  return <DataTable columns={columns} data={deals} searchKey="title" searchPlaceholder="Search deals..." />
}
