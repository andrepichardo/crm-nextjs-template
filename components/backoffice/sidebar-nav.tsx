"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Building2, Briefcase, CheckSquare, Activity, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navItems = [
  {
    title: "Dashboard",
    href: "/backoffice",
    icon: LayoutDashboard,
  },
  {
    title: "Contacts",
    href: "/backoffice/contacts",
    icon: Users,
  },
  {
    title: "Companies",
    href: "/backoffice/companies",
    icon: Building2,
  },
  {
    title: "Deals",
    href: "/backoffice/deals",
    icon: Briefcase,
  },
  {
    title: "Tasks",
    href: "/backoffice/tasks",
    icon: CheckSquare,
  },
  {
    title: "Activities",
    href: "/backoffice/activities",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/backoffice/settings",
    icon: Settings,
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login?redirectTo=/backoffice")
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/backoffice" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>CRM Backoffice</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
