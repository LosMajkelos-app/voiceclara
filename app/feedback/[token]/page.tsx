"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

// ... interfaces ...

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const token = params.token as string

  const [request, setRequest] = useState<FeedbackRequest | null>(null)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isCreator, setIsCreator] = useState(false)

  useEffect(() => {
    async function fetchRequest() {
      try {
        const { data, error } = await supabase
          .from("feedback_requests")
          .select("*")
          .eq("share_token", token)
          .single()

        if (error || !data) {
          toast.error("Feedback request not found")
          router.push("/")
          return
        }

        setRequest(data)
        
        // Check if current URL matches the one used during creation
        // (Check if this is right after creation - via referrer or query param)
        const urlParams = new URLSearchParams(window.location.search)
        const justCreated = urlParams.get('created') === 'true'
        
        // Check if user is creator (either logged in creator or same guest email)
        if (user && data.user_id === user.id) {
          setIsCreator(true)
        } else if (!user && justCreated) {
          setIsCreator(true)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching request:", error)
        toast.error("Failed to load feedback request")
        router.push("/")
      }
    }

    fetchRequest()
  }, [token, user, router])

  // ... rest of existing code (handleSubmit, etc) ...

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  if (!request) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Creator Banner */}
        {isCreator && !user && (
          <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                🎉 Feedback Request Created!
              </h2>
              <p className="mb-4">
                Sign up to track responses and get AI-powered insights
              </p>
              <div className="flex gap-3 justify-center">
                <Link href={`/auth/signup?email=${encodeURIComponent(request.guest_email || '')}`}>
                  <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                    Create Account →
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {isCreator && user && (
          <Card className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                ✅ Request Created Successfully!
              </h2>
              <p className="mb-4">
                Share the link below to collect feedback
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success("Link copied!")
                  }}
                >
                  📋 Copy Share Link
                </Button>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Go to Dashboard →
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Rest of feedback form */}
        {!isCreator && (
          <Card className="p-8 bg-white/80 backdrop-blur-sm">
            {/* ... existing feedback form code ... */}
          </Card>
        )}

      </div>
    </div>
  )
}