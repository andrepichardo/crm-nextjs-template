import { AdvancedSearch } from "@/components/backoffice/advanced-search"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Target, CheckSquare } from "lucide-react"

const mockResults = [
  {
    type: "contact",
    title: "John Smith",
    description: "Senior Developer at Acme Corp",
    icon: Users,
  },
  {
    type: "company",
    title: "Acme Corporation",
    description: "Technology • 500+ employees",
    icon: Building2,
  },
  {
    type: "deal",
    title: "Enterprise License Deal",
    description: "$45,000 • Negotiation stage",
    icon: Target,
  },
  {
    type: "task",
    title: "Follow up on proposal",
    description: "Due tomorrow • High priority",
    icon: CheckSquare,
  },
]

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground">Find contacts, companies, deals, and tasks</p>
      </div>

      <AdvancedSearch />

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>4 results found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockResults.map((result, index) => {
              const Icon = result.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{result.title}</h4>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{result.type}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
