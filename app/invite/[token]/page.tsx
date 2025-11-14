"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [organizationName, setOrganizationName] = useState("")

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Redirect to login with return URL
        router.push(`/auth/login?next=/invite/${params.token}`)
      } else {
        acceptInvitation()
      }
    }
  }, [user, authLoading])

  const acceptInvitation = async () => {
    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation_token: params.token }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setOrganizationName(data.organization?.name || "the organization")
        setMessage(`You've successfully joined ${data.organization?.name || "the organization"}!`)

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to accept invitation")
      }
    } catch (error) {
      console.error("Error accepting invitation:", error)
      setStatus("error")
      setMessage("An unexpected error occurred")
    }
  }

  if (authLoading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Invitation</h2>
          <p className="text-gray-600">Please wait...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center">
        {status === "success" ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-4">Redirecting to dashboard...</p>
            <Link href="/dashboard">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Go to Dashboard
              </Button>
            </Link>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Error</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-2">
              <Link href="/dashboard">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/team">
                <Button variant="outline" className="w-full">
                  View Team Settings
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
