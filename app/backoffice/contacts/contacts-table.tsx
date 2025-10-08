"use client"

import { DataTable } from "@/components/ui/data-table"
import { createColumns } from "./columns"
import type { Contact } from "@/lib/types/database"

interface ContactsTableProps {
  contacts: Contact[]
  companies: { id: string; name: string }[]
}

export function ContactsTable({ contacts, companies }: ContactsTableProps) {
  const columns = createColumns(companies)

  return <DataTable columns={columns} data={contacts} searchKey="first_name" searchPlaceholder="Search contacts..." />
}
