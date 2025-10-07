"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImportDialogProps {
  entityType: "contacts" | "companies" | "deals" | "tasks"
  children?: React.ReactNode
}

export function ImportDialog({ entityType, children }: ImportDialogProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    if (files.length === 0) return

    setIsImporting(true)
    console.log("[v0] Importing", files.length, "file(s) for", entityType)

    // Simulate import
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsImporting(false)
    setFiles([])
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import {entityType}</DialogTitle>
          <DialogDescription>Upload a CSV or JSON file to bulk import {entityType}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Make sure your file includes the required columns: name, email, and phone for contacts. Download a
              template to see the expected format.
            </AlertDescription>
          </Alert>

          <FileUpload onFilesSelected={setFiles} maxFiles={1} accept=".csv,.json" className="border-none p-0" />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              Download Template
            </Button>
            <Button onClick={handleImport} disabled={files.length === 0 || isImporting} className="flex-1">
              {isImporting ? "Importing..." : `Import ${entityType}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
