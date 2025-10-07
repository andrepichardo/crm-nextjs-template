"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, Send } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function PortalMessages() {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message before sending.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("activities").insert({
        activity_type: "note",
        title: "Customer Message", // Added required title field
        description: message,
        created_by: user.id,
      })

      if (error) throw error

      toast({
        title: "Message sent",
        description: "Your message has been sent to your account manager.",
      })

      setMessage("")
      router.refresh()
    } catch (error) {
      console.error("[v0] Send message error:", error)
      toast({
        title: "Failed to send",
        description: "Could not send your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with your account manager</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Your account manager will respond within 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Account Manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Support Team</p>
                <p className="text-sm text-muted-foreground">Available 9AM - 5PM</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Response time: Within 24 hours</p>
              <p className="text-muted-foreground">Email: support@example.com</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>Your recent conversations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No messages yet. Send your first message above!</p>
        </CardContent>
      </Card>
    </div>
  )
}
