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

interface FeedbackRequest {
  id: string
  title: string
  questions: string[]
  creator_name: string
  creator_email: string | null
  guest_email: string | null
  user_id: string | null
  share_token: string
  results_token: string
  created_at: string
}

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
        
        // Check if this is right after creation
        const urlParams = new URLSearchParams(window.location.search)
        const justCreated = urlParams.get('created') === 'true'
        
        // Check if user is creator
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!request) return

    // Validate all questions are answered
    const unanswered = request.questions.filter((_, index) => !answers[index]?.trim())
    if (unanswered.length > 0) {
      toast.error("Please answer all questions")
      return
    }

    setSubmitting(true)

    try {
      const responseData = {
        feedback_request_id: request.id,
        answers: request.questions.map((q, i) => ({
          question: q,
          answer: answers[i]
        })),
        submitted_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("responses")
        .insert([responseData])

      if (error) throw error

      toast.success("Feedback submitted! Thank you! 🎉")
      
      // Redirect to thank you page or home
      setTimeout(() => {
        router.push("/")
      }, 2000)

    } catch (error: any) {
      console.error("Error submitting feedback:", error)
      toast.error(error.message || "Failed to submit feedback")
      setSubmitting(false)
    }
  }

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

        {/* Creator Banner - Guest User */}
        {isCreator && !user && (
          <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                🎉 Feedback Request Created!
              </h2>
              <p className="mb-4">
                Sign up to track responses and get AI-powered insights
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
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

        {/* Creator Banner - Logged In User */}
        {isCreator && user && (
          <Card className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                ✅ Request Created Successfully!
              </h2>
              <p className="mb-4">
                Share the link below to collect feedback
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                  onClick={() => {
                    const url = window.location.href.split('?')[0]
                    navigator.clipboard.writeText(url)
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

        {/* Feedback Form - Only show if NOT creator */}
        {!isCreator && (
          <>
            <Card className="p-8 bg-white/80 backdrop-blur-sm mb-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                  {request.title}
                </h1>
                <p className="text-gray-600">
                  From {request.creator_name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Your responses are anonymous
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {request.questions.map((question, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {index + 1}. {question}
                    </label>
                    <Textarea
                      value={answers[index] || ""}
                      onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                      placeholder="Type your answer here..."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                ))}

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Feedback →"}
                  </Button>
                </div>
              </form>
            </Card>

            <div className="text-center text-sm text-gray-500">
              <p>Powered by VoiceClara - The beautiful way to get honest feedback</p>
            </div>
          </>
        )}

        {/* If creator, show instruction instead of form */}
        {isCreator && (
          <Card className="p-8 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Share Your Feedback Request
            </h2>
            <p className="text-gray-600 mb-6">
              Copy the link above and share it with people you want feedback from
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Share Link:</p>
              <code className="text-sm text-indigo-600 break-all">
                {typeof window !== 'undefined' && window.location.href.split('?')[0]}
              </code>
            </div>
          </Card>
        )}

      </div>
    </div>
  )
}