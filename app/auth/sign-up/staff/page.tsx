"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function StaffSignUpPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Staff Registration Disabled</CardTitle>
            </div>
            <CardDescription>Public staff registration is not available for security reasons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Staff accounts can only be created by system administrators to maintain security and proper access
                control.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 pt-2">
              <p className="text-sm text-muted-foreground">
                <strong>If you need a staff account:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Contact your system administrator</li>
                <li>Request an invitation from your team manager</li>
                <li>Admins can create accounts from the User Management section</li>
              </ul>
            </div>

            <div className="pt-4 space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/login?redirectTo=/backoffice">Go to Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/sign-up/customer">Sign Up as Customer</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
