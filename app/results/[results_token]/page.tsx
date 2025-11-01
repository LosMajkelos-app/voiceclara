"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Response {
  id: string
  answers: Array<{
    question: string
    answer: string
  }>
  submitted_at: string
}

interface FeedbackRequest {
  id: string
  title: string
  creator_name: string
  creator_email: string
  questions: string[]
  created_at: string
}

export default function ResultsPage() {
  const params = useParams()
  const resultsToken = params.results_token as string

  const [loading, setLoading] = useState(true)
  const [feedbackRequest, setFeedbackRequest] = useState<FeedbackRequest | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch feedback request
        const { data: requestData, error: requestError } = await supabase
          .from('feedback_requests')
          .select('*')
          .eq('results_token', resultsToken)
          .single()

        if (requestError || !requestData) {
          setError("Results not found")
          setLoading(false)
          return
        }

        setFeedbackRequest(requestData)

        // 2. Fetch responses
        const { data: responsesData, error: responsesError } = await supabase
          .from('responses')
          .select('*')
          .eq('feedback_request_id', requestData.id)
          .order('submitted_at', { ascending: false })

        if (responsesError) {
          console.error('Error fetching responses:', responsesError)
        } else {
          setResponses(responsesData || [])
        }

        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setError("Something went wrong")
        setLoading(false)
      }
    }

    fetchData()
  }, [resultsToken])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </Card>
      </div>
    )
  }

  // Error state
  if (error || !feedbackRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h1>
          <p className="text-gray-600 mb-6">
            These results don't exist or the link is invalid.
          </p>
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Go to Home
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              ← Back to home
            </Button>
          </Link>
          
          <Card className="p-8 bg-white/80 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-indigo-900 mb-2">
                  {feedbackRequest.title}
                </h1>
                {feedbackRequest.creator_name && (
                  <p className="text-gray-600">
                    Created by {feedbackRequest.creator_name}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {responses.length} {responses.length === 1 ? 'Response' : 'Responses'}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {responses.length}
                </div>
                <div className="text-sm text-gray-600">Total Responses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {feedbackRequest.questions.length}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {new Date(feedbackRequest.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Created</div>
              </div>
            </div>

            {/* Share link */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600 mb-2">Share this link to collect more feedback:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/feedback/${feedbackRequest.id}`}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 font-mono"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/feedback/${feedbackRequest.id}`)
                    alert("Link copied! 📋")
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* No responses yet */}
        {responses.length === 0 && (
          <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No responses yet
            </h2>
            <p className="text-gray-600 mb-6">
              Share your feedback link to start collecting responses!
            </p>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/feedback/${feedbackRequest.id}`)
                alert("Link copied! Share it with your team. 📋")
              }}
            >
              Copy Feedback Link
            </Button>
          </Card>
        )}

        {/* Responses */}
        {responses.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              All Responses
            </h2>

            {responses.map((response, idx) => (
              <Card key={response.id} className="p-6 bg-white/80 backdrop-blur-sm">
                
                {/* Response header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <Badge variant="outline">
                    Response #{responses.length - idx}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(response.submitted_at).toLocaleString()}
                  </span>
                </div>

                {/* Answers */}
                <div className="space-y-6">
                  {response.answers.map((answer, answerIdx) => (
                    <div key={answerIdx}>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {answer.question}
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                        {answer.answer || <em className="text-gray-400">No answer provided</em>}
                      </p>
                    </div>
                  ))}
                </div>

              </Card>
            ))}
          </div>
        )}

        {/* Actions */}
        {responses.length > 0 && (
          <Card className="p-6 mt-8 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Want more insights?
                </h3>
                <p className="text-sm text-gray-600">
                  AI-powered analysis coming soon! Get themes, sentiment, and blind spots.
                </p>
              </div>
              <Button variant="outline" disabled>
                AI Analysis (Soon)
              </Button>
            </div>
          </Card>
        )}

      </div>
    </div>
  )
}