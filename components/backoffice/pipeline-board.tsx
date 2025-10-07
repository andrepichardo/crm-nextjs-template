"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Deal } from "@/lib/types/database"

interface PipelineBoardProps {
  deals: Deal[]
}

const stages = [
  { id: "lead", label: "Lead", color: "bg-gray-500" },
  { id: "qualified", label: "Qualified", color: "bg-blue-500" },
  { id: "proposal", label: "Proposal", color: "bg-yellow-500" },
  { id: "negotiation", label: "Negotiation", color: "bg-orange-500" },
  { id: "closed_won", label: "Closed Won", color: "bg-green-500" },
  { id: "closed_lost", label: "Closed Lost", color: "bg-red-500" },
]

export function PipelineBoard({ deals }: PipelineBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stages.map((stage) => {
        const stageDeals = deals.filter((deal) => deal.stage === stage.id)
        const totalValue = stageDeals.reduce((sum, deal) => sum + Number(deal.value), 0)

        return (
          <div key={stage.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                <h3 className="font-semibold">{stage.label}</h3>
              </div>
              <Badge variant="secondary">{stageDeals.length}</Badge>
            </div>

            <div className="space-y-2">
              {stageDeals.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex h-24 items-center justify-center p-4">
                    <p className="text-sm text-muted-foreground">No deals</p>
                  </CardContent>
                </Card>
              ) : (
                stageDeals.map((deal) => (
                  <Card key={deal.id} className="cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-medium">{deal.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-2">
                        <div className="text-lg font-bold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: deal.currency || "USD",
                          }).format(Number(deal.value))}
                        </div>
                        {deal.probability !== null && (
                          <div className="text-xs text-muted-foreground">{deal.probability}% probability</div>
                        )}
                        {deal.expected_close_date && (
                          <div className="text-xs text-muted-foreground">
                            Close: {new Date(deal.expected_close_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <div className="rounded-lg bg-muted p-3">
              <div className="text-xs text-muted-foreground">Total Value</div>
              <div className="text-sm font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalValue)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
