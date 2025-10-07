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

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "customer") {
    redirect("/backoffice")
  }
  // </CHANGE>

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
