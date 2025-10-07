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
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.user_type !== "staff") {
    redirect("/portal")
  }

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
