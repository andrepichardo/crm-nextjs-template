"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SearchFilter {
  type: string
  value: string
}

export function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilter[]>([])
  const [filterType, setFilterType] = useState("")
  const [filterValue, setFilterValue] = useState("")

  const addFilter = () => {
    if (filterType && filterValue) {
      setFilters([...filters, { type: filterType, value: filterValue }])
      setFilterType("")
      setFilterValue("")
    }
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Advanced Search
        </CardTitle>
        <CardDescription>Search across contacts, companies, deals, and tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search everything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button>Search</Button>
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Filter Type</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Select filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entity">Entity Type</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="date">Date Range</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Value</label>
            <Input placeholder="Filter value" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
          </div>

          <Button onClick={addFilter} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>

        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="gap-2">
                <span className="font-medium">{filter.type}:</span>
                <span>{filter.value}</span>
                <button onClick={() => removeFilter(index)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Quick Filters</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              My Contacts
            </Button>
            <Button variant="outline" size="sm">
              Open Deals
            </Button>
            <Button variant="outline" size="sm">
              Overdue Tasks
            </Button>
            <Button variant="outline" size="sm">
              This Week
            </Button>
            <Button variant="outline" size="sm">
              High Priority
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
