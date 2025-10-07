import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PortalNav } from "@/components/portal/portal-nav"

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirectTo=/portal")
  }

  const userTypeSeparationEnabled = process.env.ENABLE_USER_TYPE_SEPARATION === "true"

  if (userTypeSeparationEnabled) {
    const { data: profile, error } = await supabase.from("profiles").select("user_type").eq("id", user.id).maybeSingle()

    // Check if error is due to missing column (migration not run yet)
    if (error && error.code === "42703") {
      console.log("[v0] Portal: user_type column not found. Skipping user type check.")
      // Allow access - migration scripts need to be run
    } else if (profile?.user_type === "staff") {
      redirect("/backoffice")
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-64 border-r bg-card lg:block">
        <PortalNav />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
