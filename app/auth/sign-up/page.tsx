"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, Briefcase } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>Choose your account type to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Customer Signup */}
              <Link href="/auth/sign-up/customer">
                <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Customer Account</CardTitle>
                    <CardDescription className="text-balance">
                      Access the customer portal to view your deals, messages, and account information
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              {/* Staff Signup */}
              <Link href="/auth/sign-up/staff">
                <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Staff Account</CardTitle>
                    <CardDescription className="text-balance">
                      Access the backoffice to manage contacts, companies, deals, and CRM operations
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
