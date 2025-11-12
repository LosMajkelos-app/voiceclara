"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { Sparkles, ArrowLeft, Copy, CheckCircle, Calendar, MessageSquare } from "lucide-react"

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

interface Response {
  id: string
  answers: Array<{ question: string; answer: string }>
  submitted_at: string
}

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const token = params.token as string
  const isNewlyCreated = searchParams.get('created') === 'true'

  const [request, setRequest] = useState<FeedbackRequest | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [loading, setLoading] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [analyzingAI, setAnalyzingAI] = useState(false)

  useEffect(() => {
    async function fetchData() {
      console.log('🔍 Results token from URL:', token)
    console.log('👤 Current user:', user?.id)
      try {
        // Fetch request
        const { data: requestData, error: requestError } = await supabase
          .from("feedback_requests")
          .select("*")
          .eq("results_token", token)
          .single()

          console.log('📊 Query result:', { requestData, requestError })

        if (requestError || !requestData) {
          toast.error("Results not found")
        //  router.push("/")
          return
        }

        // Check authorization
        if (user) {
          // Logged in user - check if they own it
          if (requestData.user_id !== user.id) {
            toast.error("You don't have access to these results")
            router.push("/")
            return
          }
        } else {
          // Guest user - they can view via results_token
          // (Anyone with the link can view)
        }

        setRequest(requestData)

        // Fetch responses
        const { data: responsesData, error: responsesError } = await supabase
          .from("responses")
          .select("*")
          .eq("feedback_request_id", requestData.id)
          .order("submitted_at", { ascending: false })

        if (responsesError) {
          console.error("Error fetching responses:", responsesError)
        } else {
          setResponses(responsesData || [])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to load results")
        router.push("/")
      }
    }

    fetchData()
  }, [token, user, router])

  const copyShareLink = () => {
    if (!request) return
    const shareUrl = `${window.location.origin}/feedback/${request.share_token}`
    navigator.clipboard.writeText(shareUrl)
    toast.success("Share link copied! 📋")
  }

  const handleAIAnalysis = async () => {
    if (!request) return

    setAnalyzingAI(true)
    toast.info("AI is analyzing your feedback... ⏳")

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackRequestId: request.id })
      })

      const data = await response.json()

      if (response.ok) {
        setAiAnalysis(data)

        // Show warning if some responses were filtered
        if (data.warning) {
          toast.warning(data.warning, { duration: 6000 })
        } else {
          toast.success("AI Analysis complete! ✨")
        }
      } else {
        // Handle errors with detailed messages
        if (data.warning) {
          toast.error(data.warning, { duration: 8000 })
        } else {
          toast.error("Analysis failed: " + (data.error || "Unknown error"))
        }
      }
    } catch (error) {
      console.error('AI analysis error:', error)
      toast.error("Failed to analyze feedback")
    } finally {
      setAnalyzingAI(false)
    }
  }

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

  if (!request) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                {request.title}
              </h1>
              <p className="text-gray-600">
                Created by {request.creator_name || "Anonymous"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">
                {responses.length} Response{responses.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-indigo-900">{responses.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-purple-900">{request.questions.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-lg font-bold text-green-900">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Share this link to collect more feedback:</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/feedback/${request.share_token}`}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
              />
              <Button onClick={copyShareLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </Card>

        {/* Success Banner for Newly Created Request */}
        {isNewlyCreated && (
          <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white mb-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎉</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">
                  Feedback Request Created Successfully!
                </h3>
                <p className="text-sm opacity-90 mb-3">
                  Share the link below to start collecting honest, anonymous feedback.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={copyShareLink}
                    className="bg-white text-green-600 hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Share Link
                  </Button>
                  <Link href="/dashboard">
                    <Button variant="outline" className="bg-white/10 border-white/30 hover:bg-white/20 text-white">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Guest Login Banner */}
        {!user && (
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-indigo-900 mb-1">
                  💡 Save This Request to Your Dashboard
                </h3>
                <p className="text-sm text-indigo-800 mb-3">
                  Create an account to track responses, get AI insights, and manage all your feedback requests in one place. It's free forever!
                </p>
                <ul className="text-xs text-indigo-700 space-y-1.5 mb-4">
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> Access your requests anytime
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> Get AI-powered insights and themes
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> Track response history over time
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold">✓</span> 100% free, no credit card required
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* AI Analysis Unlock Message */}
        {responses.length < 3 && (
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">
                  🤖 AI Analysis Coming Soon!
                </h3>
                <p className="text-sm text-gray-600">
                  Collect at least 3 responses to unlock AI-powered insights: 
                  themes, sentiment analysis, and blind spot detection.
                </p>
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(responses.length / 3) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-purple-600">
                      {responses.length}/3
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {3 - responses.length} more response{3 - responses.length !== 1 ? 's' : ''} needed
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {responses.length >= 3 && (
          <>
            <Card className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold mb-1">
                    ✅ AI Analysis Available!
                  </h3>
                  <p className="text-sm">
                    You have enough responses for AI-powered insights
                  </p>
                </div>
                <Button
                  className="bg-white text-green-600 hover:bg-gray-100"
                  onClick={handleAIAnalysis}
                  disabled={analyzingAI}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {analyzingAI ? "Analyzing..." : "Analyze with AI"}
                </Button>
              </div>
            </Card>

            {/* AI Analysis Results */}
            {aiAnalysis && (
              <div className="mb-6 space-y-4">
                {/* Quality Metrics Warning */}
                {aiAnalysis.quality && aiAnalysis.quality.filteredResponses > 0 && (
                  <Card className="p-4 bg-yellow-50 border-2 border-yellow-300">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">⚠️</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-yellow-900 mb-1">Response Quality Notice</h4>
                        <p className="text-sm text-yellow-800 mb-2">
                          {aiAnalysis.quality.filteredResponses} of {aiAnalysis.quality.totalResponses} response(s) were filtered as test/spam responses (e.g., "asdasd", "test", very short answers).
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-green-700">✓ Valid:</span>
                            <span className="text-gray-700">{aiAnalysis.quality.validResponses}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-red-700">✗ Filtered:</span>
                            <span className="text-gray-700">{aiAnalysis.quality.filteredResponses}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-indigo-700">Avg Quality:</span>
                            <span className="text-gray-700">{aiAnalysis.quality.averageQuality}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Summary */}
                <Card className="p-6 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900">AI Executive Summary</h3>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">
                      {aiAnalysis.summary?.summary}
                    </p>

                    {aiAnalysis.summary?.strengths && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-green-700 mb-2">💪 Key Strengths:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {aiAnalysis.summary.strengths.map((strength: string, i: number) => (
                            <li key={i} className="text-gray-700">{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiAnalysis.summary?.growthAreas && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-orange-700 mb-2">🌱 Growth Areas:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {aiAnalysis.summary.growthAreas.map((area: string, i: number) => (
                            <li key={i} className="text-gray-700">{area}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiAnalysis.summary?.recommendations && (
                      <div>
                        <h4 className="font-semibold text-indigo-700 mb-2">🎯 Recommendations:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {aiAnalysis.summary.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="text-gray-700">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Sentiment */}
                {aiAnalysis.sentiment && (
                  <Card className="p-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">😊 Overall Sentiment</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">
                            {aiAnalysis.sentiment.sentiment === 'positive' && '😊'}
                            {aiAnalysis.sentiment.sentiment === 'constructive' && '💡'}
                            {aiAnalysis.sentiment.sentiment === 'neutral' && '😐'}
                            {aiAnalysis.sentiment.sentiment === 'concerned' && '😟'}
                          </span>
                          <span className="font-semibold text-lg capitalize">
                            {aiAnalysis.sentiment.sentiment}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{aiAnalysis.sentiment.explanation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-indigo-600">
                          {aiAnalysis.sentiment.confidence}%
                        </p>
                        <p className="text-xs text-gray-500">Confidence</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Themes */}
                {aiAnalysis.themes && aiAnalysis.themes.length > 0 && (
                  <Card className="p-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">🔍 Key Themes</h3>
                    <div className="space-y-4">
                      {aiAnalysis.themes.map((theme: any, i: number) => (
                        <div key={i} className="border-l-4 border-indigo-400 pl-4 py-2">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                              {theme.count} mentions
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{theme.description}</p>
                          {theme.quotes && theme.quotes.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {theme.quotes.map((quote: string, qi: number) => (
                                <p key={qi} className="text-xs text-gray-500 italic pl-3 border-l-2 border-gray-200">
                                  "{quote}"
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {responses.length === 0 && (
          <Card className="p-12 bg-white/80 backdrop-blur-sm text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Responses Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Share your feedback request link to start collecting responses
            </p>
            <Button onClick={copyShareLink} className="bg-indigo-600 hover:bg-indigo-700">
              <Copy className="mr-2 h-4 w-4" />
              Copy Share Link
            </Button>
          </Card>
        )}

        {/* All Responses */}
        {responses.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">All Responses</h2>
            
            {responses.map((response, index) => (
              <Card key={response.id} className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Response #{index + 1}</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      😐 Neutral
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(response.submitted_at).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-4">
                  {response.answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="border-l-4 border-indigo-200 pl-4">
                      <p className="font-medium text-gray-900 mb-2">
                        {answer.question}
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {answer.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}