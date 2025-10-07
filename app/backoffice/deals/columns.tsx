"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Deal } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DealForm } from "@/components/backoffice/deal-form"
import { DeleteDialog } from "@/components/backoffice/delete-dialog"

const stageColors = {
  lead: "bg-gray-500",
  qualified: "bg-blue-500",
  proposal: "bg-yellow-500",
  negotiation: "bg-orange-500",
  closed_won: "bg-green-500",
  closed_lost: "bg-red-500",
}

const stageLabels = {
  lead: "Lead",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
}

function DealActions({
  deal,
  companies,
  contacts,
  users,
}: { deal: Deal; companies: any[]; contacts: any[]; users: any[] }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(deal.id)}>Copy ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit deal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogDescription>Update deal information</DialogDescription>
          </DialogHeader>
          <DealForm
            deal={deal}
            companies={companies}
            contacts={contacts}
            users={users}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} table="deals" id={deal.id} title={deal.title} />
    </>
  )
}

export function createDealColumns(companies: any[], contacts: any[], users: any[]): ColumnDef<Deal>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Deal
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("title")}</div>
      },
    },
    {
      accessorKey: "value",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Value
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const value = Number.parseFloat(row.getValue("value"))
        const currency = row.original.currency
        return (
          <div className="font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency || "USD",
            }).format(value)}
          </div>
        )
      },
    },
    {
      accessorKey: "stage",
      header: "Stage",
      cell: ({ row }) => {
        const stage = row.getValue("stage") as keyof typeof stageLabels
        return (
          <Badge className={`${stageColors[stage]} text-white`} variant="default">
            {stageLabels[stage]}
          </Badge>
        )
      },
    },
    {
      accessorKey: "probability",
      header: "Probability",
      cell: ({ row }) => {
        const probability = row.getValue("probability") as number | null
        return probability !== null ? <span>{probability}%</span> : <span className="text-muted-foreground">-</span>
      },
    },
    {
      accessorKey: "expected_close_date",
      header: "Expected Close",
      cell: ({ row }) => {
        const date = row.getValue("expected_close_date") as string | null
        return date ? new Date(date).toLocaleDateString() : <span className="text-muted-foreground">-</span>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <DealActions deal={row.original} companies={companies} contacts={contacts} users={users} />
      },
    },
  ]
}
