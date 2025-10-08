import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userTypeSeparationEnabled = process.env.ENABLE_USER_TYPE_SEPARATION === "true"

  if (user && userTypeSeparationEnabled) {
    console.log("[v0] User type separation is ENABLED")

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .maybeSingle()

      // Check if the error is because the column doesn't exist (multiple ways to check)
      if (error) {
        const errorCode = error.code || (error as any).error_code || ""
        const errorMessage = error.message || ""

        if (errorCode === "42P17" || errorMessage.includes("infinite recursion")) {
          console.log("[v0] ⚠️  Infinite recursion detected in RLS policies!")
          console.log("[v0] Please run script 012_simple_rls_fix.sql in Supabase to fix RLS policies.")
          console.log("[v0] Bypassing user type check to allow access.")
          return supabaseResponse
        }

        if (errorCode === "42703" || errorMessage.includes("column") || errorMessage.includes("does not exist")) {
          console.log("[v0] ⚠️  user_type column not found. Please run migration scripts 007 and 008.")
          console.log("[v0] Allowing access until migrations are complete.")
          return supabaseResponse
        }

        // Some other error occurred
        console.log("[v0] Error fetching user_type:", error)
        return supabaseResponse
      }

      const userType = profile?.user_type || "customer"
      console.log("[v0] User type:", userType)

      // Redirect staff users trying to access portal
      if (request.nextUrl.pathname.startsWith("/portal")) {
        if (userType === "staff") {
          console.log("[v0] Redirecting staff user from portal to backoffice")
          const url = request.nextUrl.clone()
          url.pathname = "/backoffice"
          return NextResponse.redirect(url)
        }
      }

      // Redirect customer users trying to access backoffice
      if (request.nextUrl.pathname.startsWith("/backoffice")) {
        if (userType === "customer") {
          console.log("[v0] Redirecting customer user from backoffice to portal")
          const url = request.nextUrl.clone()
          url.pathname = "/portal"
          return NextResponse.redirect(url)
        }
      }
    } catch (err) {
      // Catch any unexpected errors and allow access
      console.log("[v0] Unexpected error in user type check:", err)
      console.log("[v0] Allowing access. Please check migration status.")
      return supabaseResponse
    }
  } else if (user) {
    console.log("[v0] User type separation is DISABLED (ENABLE_USER_TYPE_SEPARATION not set to 'true')")
  }

  // Redirect unauthenticated users to login
  if (!user) {
    if (request.nextUrl.pathname.startsWith("/backoffice") || request.nextUrl.pathname.startsWith("/portal")) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
