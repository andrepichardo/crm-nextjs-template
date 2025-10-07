import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SidebarNav } from "@/components/backoffice/sidebar-nav"
import { Header } from "@/components/backoffice/header"

export default async function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirectTo=/backoffice")
  }

  const userTypeSeparationEnabled = process.env.ENABLE_USER_TYPE_SEPARATION === "true"

  if (userTypeSeparationEnabled) {
    const { data: profile, error } = await supabase.from("profiles").select("user_type").eq("id", user.id).maybeSingle()

    // Check if error is due to missing column (migration not run yet)
    if (error && error.code === "42703") {
      console.log("[v0] Backoffice: user_type column not found. Skipping user type check.")
      // Allow access - migration scripts need to be run
    } else if (profile?.user_type === "customer") {
      redirect("/portal")
    }
  }

  // Fetch profile for header display
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-64 border-r bg-card lg:block">
        <SidebarNav />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={profile || { email: user.email }} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
