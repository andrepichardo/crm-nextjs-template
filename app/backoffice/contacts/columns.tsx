"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Contact } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Mail, Phone, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { EditContactDialog } from "@/components/backoffice/edit-contact-dialog"
import { DeleteDialog } from "@/components/backoffice/delete-dialog"

function ContactActions({ contact, companies }: { contact: Contact; companies: any[] }) {
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contact.email)}>
            <Mail className="mr-2 h-4 w-4" />
            Copy email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit contact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditContactDialog contact={contact} companies={companies} open={editOpen} onOpenChange={setEditOpen} />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        table="contacts"
        id={contact.id}
        title={`${contact.first_name} ${contact.last_name}`}
      />
    </>
  )
}

export function createColumns(companies: any[]): ColumnDef<Contact>[] {
  return [
    {
      accessorKey: "first_name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const contact = row.original
        const initials = `${contact.first_name[0]}${contact.last_name[0]}`.toUpperCase()
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {contact.first_name} {contact.last_name}
              </div>
              {contact.position && <div className="text-xs text-muted-foreground">{contact.position}</div>}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{row.getValue("email")}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string | null
        return phone ? (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{phone}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={status === "active" ? "default" : status === "lead" ? "secondary" : "outline"}
            className="capitalize"
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <ContactActions contact={row.original} companies={companies} />
      },
    },
  ]
}
