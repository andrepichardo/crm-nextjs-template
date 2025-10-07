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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileSpreadsheet, FileText } from "lucide-react"

interface ExportDialogProps {
  entityType: "contacts" | "companies" | "deals" | "tasks"
  children?: React.ReactNode
}

export function ExportDialog({ entityType, children }: ExportDialogProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv")
  const [includeFields, setIncludeFields] = useState({
    basic: true,
    contact: true,
    dates: true,
    custom: false,
  })

  const handleExport = () => {
    console.log("[v0] Exporting", entityType, "as", format, "with fields:", includeFields)
    // Export logic would go here
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export {entityType}</DialogTitle>
          <DialogDescription>Choose export format and fields to include</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as "csv" | "json")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV (Excel compatible)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  JSON (Developer friendly)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Fields to Include</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="basic"
                  checked={includeFields.basic}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, basic: checked as boolean })}
                />
                <Label htmlFor="basic" className="cursor-pointer">
                  Basic Information
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contact"
                  checked={includeFields.contact}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, contact: checked as boolean })}
                />
                <Label htmlFor="contact" className="cursor-pointer">
                  Contact Details
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dates"
                  checked={includeFields.dates}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, dates: checked as boolean })}
                />
                <Label htmlFor="dates" className="cursor-pointer">
                  Dates & Timestamps
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="custom"
                  checked={includeFields.custom}
                  onCheckedChange={(checked) => setIncludeFields({ ...includeFields, custom: checked as boolean })}
                />
                <Label htmlFor="custom" className="cursor-pointer">
                  Custom Fields
                </Label>
              </div>
            </div>
          </div>

          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export {entityType}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
