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

  if (user) {
    let userType = "customer" // Default to customer if we can't determine

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .maybeSingle()

      if (!error && profile) {
        userType = profile.user_type || "customer"
      }
    } catch (error) {
      // If user_type column doesn't exist yet, allow access (migration not run)
      console.log("[v0] user_type column not found, allowing access until migration is run")
      return supabaseResponse
    }

    if (request.nextUrl.pathname.startsWith("/backoffice")) {
      if (userType !== "staff") {
        const url = request.nextUrl.clone()
        url.pathname = "/portal"
        return NextResponse.redirect(url)
      }
    }

    if (request.nextUrl.pathname.startsWith("/portal")) {
      if (userType !== "customer") {
        const url = request.nextUrl.clone()
        url.pathname = "/backoffice"
        return NextResponse.redirect(url)
      }
    }
  } else {
    if (request.nextUrl.pathname.startsWith("/backoffice")) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname.startsWith("/portal")) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
