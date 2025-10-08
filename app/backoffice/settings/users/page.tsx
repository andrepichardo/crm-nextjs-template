import { createClient } from "@/lib/supabase/server"
import { UsersClient } from "./users-client"

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, user_type, created_at, updated_at")
    .eq("user_type", "staff")
    .order("created_at", { ascending: false })

  // we'll handle email confirmation status on the client side or remove the feature
  // For now, we'll pass the profiles as-is and remove the unconfirmed badge
  const users = profiles || []

  return <UsersClient users={users} />
}
