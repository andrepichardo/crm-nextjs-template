import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, LayoutDashboard } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-balance">Welcome to Your CRM System</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Manage your customer relationships, deals, and business operations all in one place
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Backoffice</CardTitle>
              <CardDescription>Full CRM dashboard for managing contacts, companies, deals, and tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/backoffice">Access Backoffice</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">For internal staff only</p>
              {/* </CHANGE> */}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Customer Portal</CardTitle>
              <CardDescription>
                View your interactions, deals, and communicate with your account manager
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/portal">Access Portal</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">For customers only</p>
              {/* </CHANGE> */}
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">Don't have an account?</p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up/customer">Sign Up as Customer</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/auth/sign-up/staff">Sign Up as Staff</Link>
            </Button>
            {/* </CHANGE> */}
          </div>
        </div>
      </div>
    </div>
  )
}
