"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SignUpSuccessContent() {
  const searchParams = useSearchParams()
  const userType = searchParams.get("type") || "customer"

  const loginUrl = userType === "staff" ? "/auth/login?redirectTo=/backoffice" : "/auth/login?redirectTo=/portal"

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
            <CardDescription>Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You&apos;ve successfully signed up. Please check your email to confirm your account before signing in.
            </p>
            <Button asChild className="w-full">
              <Link href={loginUrl}>Go to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignUpSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpSuccessContent />
    </Suspense>
  )
}
