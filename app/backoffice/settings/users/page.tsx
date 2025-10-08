import { createClient } from "@/lib/supabase/server"
import { UsersClient } from "./users-client"

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, user_type, created_at, updated_at")
    .eq("user_type", "staff")
    .order("created_at", { ascending: false })

  // Get auth data for email confirmation status
  const {
    data: { users: authUsers },
  } = await supabase.auth.admin.listUsers()

  // Merge profile data with auth data
  const users = (profiles || []).map((profile) => {
    const authUser = authUsers?.find((u) => u.id === profile.id)
    return {
      ...profile,
      email_confirmed_at: authUser?.email_confirmed_at || null,
      last_sign_in_at: authUser?.last_sign_in_at || null,
    }
  })

  return <UsersClient users={users} />
}
