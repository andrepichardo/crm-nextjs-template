"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string | null
  initials: string
}

export function AvatarUpload({ userId, currentAvatarUrl, initials }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload avatar")
      }

      setAvatarUrl(data.avatarUrl)
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Avatar upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        {avatarUrl && <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile picture" />}
        <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <Label htmlFor="avatar-upload" className="cursor-pointer">
          <Button variant="outline" disabled={isUploading} asChild>
            <span>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Change Avatar
                </>
              )}
            </span>
          </Button>
        </Label>
        <Input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
      </div>
    </div>
  )
}
