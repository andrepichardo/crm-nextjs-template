"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import type { Role } from "@/lib/permissions"

export async function createStaffUser(email: string, fullName: string, role: Role) {
  try {
    console.log("[v0] Creating staff user with role:", role)

    const supabase = await createClient()

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single()

    if (currentProfile?.role !== "admin") {
      return { success: false, error: "Only admins can create staff users" }
    }

    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/auth/login`

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: Math.random().toString(36).slice(-12) + "A1!",
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          user_type: "staff",
          role: role,
        },
      },
    })

    if (signUpError) {
      console.error("[v0] Sign up error:", signUpError)
      return { success: false, error: signUpError.message }
    }

    if (!data.user) {
      return { success: false, error: "Failed to create user" }
    }

    console.log("[v0] User created successfully with ID:", data.user.id)

    let profileCreated = false
    let attempts = 0
    const maxAttempts = 10

    while (!profileCreated && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const { data: profile } = await supabase.from("profiles").select("id, role").eq("id", data.user.id).single()

      if (profile) {
        console.log("[v0] Profile created with role:", profile.role)
        profileCreated = true
      }

      attempts++
    }

    if (!profileCreated) {
      console.error("[v0] Profile was not created in time")
      return { success: false, error: "Profile creation timed out. Please refresh the page." }
    }

    revalidatePath("/backoffice/settings/users")
    return {
      success: true,
      userId: data.user.id,
      message: `Staff account created successfully! An email has been sent to ${email} to set their password.`,
    }
  } catch (error) {
    console.error("[v0] Error in createStaffUser:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create staff user" }
  }
}

export async function updateUserProfile(userId: string, fullName: string, role: Role) {
  try {
    const supabase = await createClient()

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single()

    if (currentProfile?.role !== "admin" && currentUser.id !== userId) {
      return { success: false, error: "Only admins can update other users" }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        role: role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("[v0] Update error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/backoffice/settings/users")
    return { success: true, message: "User updated successfully!" }
  } catch (error) {
    console.error("[v0] Error in updateUserProfile:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update user" }
  }
}

export async function updateUserRole(userId: string, role: Role) {
  try {
    const supabase = await createClient()

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()
    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single()

    if (currentProfile?.role !== "admin") {
      return { success: false, error: "Only admins can change user roles" }
    }

    if (currentProfile.role === "admin") {
      const { data: targetUser } = await supabase.from("profiles").select("role").eq("id", userId).single()

      if (targetUser?.role === "admin" && role !== "admin") {
        const { data: adminCount } = await supabase
          .from("profiles")
          .select("id", { count: "exact" })
          .eq("role", "admin")
          .eq("user_type", "staff")

        if (adminCount && adminCount.length <= 1) {
          return {
            success: false,
            error: "Cannot change the role of the last administrator. Please assign another admin first.",
          }
        }
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        role: role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("[v0] Update role error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/backoffice/settings/users")
    return { success: true, message: "Role updated successfully!" }
  } catch (error) {
    console.error("[v0] Error in updateUserRole:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update role" }
  }
}

export async function deleteUser(userId: string) {
  try {
    console.log("[v0] Starting deleteUser for userId:", userId)

    const supabase = await createClient()

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser()

    if (!currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    if (currentUser.id === userId) {
      return { success: false, error: "You cannot delete your own account" }
    }

    const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single()

    if (currentProfile?.role !== "admin") {
      return { success: false, error: "Only admins can delete users" }
    }

    const adminClient = createAdminClient()

    // Delete from auth.users (this will cascade delete the profile via trigger)
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("[v0] Delete auth user error:", authError)
      return { success: false, error: authError.message }
    }

    console.log("[v0] User deleted successfully from auth and profiles")

    revalidatePath("/backoffice/settings/users")
    return { success: true, message: "User deleted successfully!" }
  } catch (error) {
    console.error("[v0] Error in deleteUser:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete user" }
  }
}
