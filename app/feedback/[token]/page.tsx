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
import { Sparkles, Loader2, CheckCircle, AlertCircle, TrendingUp, Shield } from "lucide-react"

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

interface AISuggestion {
  question_index: number
  quality_score: number
  what_works: string
  improvement: string
  improved_version: string
  flags: string[]
  tone: string
}

interface AIAnalysis {
  overall_score: number
  overall_feedback: string
  balance: {
    positive_count: number
    critical_count: number
    suggestion?: string
  }
  suggestions: AISuggestion[]
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
  
  // AI Coach state
  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [showAiResults, setShowAiResults] = useState(false)

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

  const handleAIAnalysis = async () => {
    if (!request) return

    // Check if user has answered at least one question
    const answeredCount = Object.values(answers).filter(a => a.trim()).length
    if (answeredCount === 0) {
      toast.error("Please answer at least one question first!")
      return
    }

    setAiAnalyzing(true)
    setShowAiResults(false)

    try {
      const response = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: request.questions,
          answers: request.questions.map((_, i) => answers[i] || '')
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze feedback')
      }

      console.log('✅ AI analysis complete:', data.analysis)
      
      setAiAnalysis(data.analysis)
      setShowAiResults(true)
      toast.success("AI Coach analyzed your feedback! 🤖")

    } catch (error: any) {
      console.error('❌ AI analysis error:', error)
      toast.error(error.message || "Failed to analyze feedback")
    } finally {
      setAiAnalyzing(false)
    }
  }

  const applyImprovedVersion = (index: number, improvedText: string) => {
    setAnswers({ ...answers, [index]: improvedText })
    toast.success("Applied AI suggestion!")
  }

  const applyAllImprovements = () => {
    if (!aiAnalysis) return

    const newAnswers = { ...answers }
    aiAnalysis.suggestions.forEach(suggestion => {
      if (suggestion.improved_version) {
        newAnswers[suggestion.question_index] = suggestion.improved_version
      }
    })
    
    setAnswers(newAnswers)
    setShowAiResults(false)
    toast.success("Applied all AI suggestions! 🎉")
  }

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

  // Get flag icon and message
  const getFlagDisplay = (flags: string[]) => {
    if (flags.includes('harsh_tone')) {
      return { icon: '⚠️', text: 'Tone could be softer', color: 'text-orange-600' }
    }
    if (flags.includes('too_short')) {
      return { icon: '📏', text: 'Could use more detail', color: 'text-blue-600' }
    }
    if (flags.includes('too_vague')) {
      return { icon: '🎯', text: 'Could be more specific', color: 'text-purple-600' }
    }
    if (flags.includes('identifies_user')) {
      return { icon: '🔒', text: 'May reveal identity', color: 'text-red-600' }
    }
    return null
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

  const answeredCount = Object.values(answers).filter(a => a.trim()).length

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
            {/* AI Coach Banner - Sticky */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-purple-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    💡 <strong>AI Feedback Coach available!</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Get instant suggestions to make your feedback more helpful and constructive
                  </p>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-white/80 backdrop-blur-sm mb-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                  {request.title}
                </h1>
                <p className="text-gray-600">
                  From {request.creator_name || "Anonymous"}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-600 font-medium">
                    Your responses are 100% anonymous
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {request.questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {index + 1}. {question}
                    </label>
                    <Textarea
                      value={answers[index] || ""}
                      onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                      placeholder="Type your answer here..."
                      className="min-h-[120px]"
                      required
                    />
                    
                    {/* Show AI suggestion for this question if available */}
                    {showAiResults && aiAnalysis && aiAnalysis.suggestions.find(s => s.question_index === index) && (
                      <Card className="p-4 bg-purple-50 border-purple-200">
                        {(() => {
                          const suggestion = aiAnalysis.suggestions.find(s => s.question_index === index)!
                          const flagDisplay = getFlagDisplay(suggestion.flags)
                          
                          return (
                            <div className="space-y-3">
                              {/* Quality Score */}
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-900">
                                  Quality Score: {suggestion.quality_score}/10
                                </span>
                                {flagDisplay && (
                                  <span className={`text-xs ${flagDisplay.color} ml-2`}>
                                    {flagDisplay.icon} {flagDisplay.text}
                                  </span>
                                )}
                              </div>

                              {/* What Works */}
                              {suggestion.what_works && (
                                <div className="text-sm">
                                  <span className="font-medium text-green-700">✓ What works:</span>
                                  <span className="text-gray-700 ml-2">{suggestion.what_works}</span>
                                </div>
                              )}

                              {/* Improvement Suggestion */}
                              {suggestion.improvement && (
                                <div className="text-sm">
                                  <span className="font-medium text-purple-700">💡 Suggestion:</span>
                                  <span className="text-gray-700 ml-2">{suggestion.improvement}</span>
                                </div>
                              )}

                              {/* Improved Version */}
                              {suggestion.improved_version && suggestion.improved_version !== answers[index] && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-gray-900">AI-Improved Version:</p>
                                  <div className="bg-white p-3 rounded border border-purple-200 text-sm text-gray-700">
                                    {suggestion.improved_version}
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => applyImprovedVersion(index, suggestion.improved_version)}
                                    className="w-full"
                                  >
                                    ✓ Use This Version
                                  </Button>
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </Card>
                    )}
                  </div>
                ))}

                {/* Progress Indicator */}
                <div className="text-center text-sm text-gray-600">
                  Progress: {answeredCount}/{request.questions.length} questions answered
                </div>

                {/* AI Coach Section */}
                {!showAiResults && (
                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className={`p-3 bg-purple-100 rounded-full transition-transform ${
                          aiAnalyzing ? 'scale-110 animate-pulse' : ''
                        }`}>
                          <Sparkles className="h-8 w-8 text-purple-600" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Get AI-Powered Suggestions
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Our AI Coach will analyze your feedback and provide suggestions to make it more helpful, 
                          specific, and constructive. It checks for tone, balance, and anonymity.
                        </p>
                        
                        {answeredCount > 0 && !aiAnalyzing && (
                          <div className="flex items-center justify-center gap-2 text-sm text-purple-700 mb-4">
                            <CheckCircle className="h-4 w-4" />
                            <span>Ready to analyze {answeredCount} answer{answeredCount > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        size="lg"
                        onClick={handleAIAnalysis}
                        disabled={aiAnalyzing || answeredCount === 0}
                        className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all ${
                          aiAnalyzing ? 'scale-105' : ''
                        }`}
                      >
                        {aiAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span className="animate-pulse">AI Coach Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Get AI Suggestions
                          </>
                        )}
                      </Button>

                      {/* Enhanced Loading State */}
                      {aiAnalyzing && (
                        <div className="mt-6 space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-purple-700 font-medium animate-pulse">
                              🤖 AI Coach is working...
                            </p>
                            <p className="text-xs text-gray-600">
                              Analyzing tone, balance, specificity, and anonymity
                            </p>
                            <p className="text-xs text-gray-500">
                              This usually takes 10-15 seconds
                            </p>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full animate-progress"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* AI Results Summary */}
                {showAiResults && aiAnalysis && (
                  <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="font-bold text-gray-900">
                            Overall Score: {aiAnalysis.overall_score}/10
                          </h3>
                          <p className="text-sm text-gray-600">{aiAnalysis.overall_feedback}</p>
                        </div>
                      </div>

                      {/* Balance Feedback */}
                      {aiAnalysis.balance.suggestion && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>⚖️ Balance:</strong> {aiAnalysis.balance.suggestion}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          onClick={applyAllImprovements}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          ✓ Apply All AI Suggestions
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAiResults(false)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
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

        {/* If creator, show preview with all questions but disabled */}
{isCreator && (
  <>
    {/* Success Banner */}
    <Card className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white mb-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          ✅ This is YOUR Feedback Request!
        </h2>
        <p className="mb-4">
          You can't fill out your own form, but here's what others will see
        </p>
      </div>
    </Card>

    {/* Quick Actions */}
    <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
      <h3 className="font-bold text-gray-900 mb-4 text-center">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => {
            const url = window.location.href.split('?')[0]
            navigator.clipboard.writeText(url)
            toast.success("Share link copied! 📋")
          }}
        >
          📋 Copy Share Link
        </Button>
        <Link href="/dashboard">
          <Button size="lg" variant="outline" className="w-full">
            📊 View Dashboard
          </Button>
        </Link>
        <Link href={`/results/${request.results_token}`}>
          <Button size="lg" variant="outline" className="w-full">
            👀 View Results
          </Button>
        </Link>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            const subject = encodeURIComponent(`Feedback Request: ${request.title}`)
            const body = encodeURIComponent(
              `Hi!\n\nI'd love to get your feedback. Please fill out this quick survey:\n\n${window.location.href.split('?')[0]}\n\nIt takes about 5 minutes and your responses are 100% anonymous.\n\nThank you!`
            )
            window.open(`mailto:?subject=${subject}&body=${body}`)
          }}
        >
          ✉️ Email to Friends
        </Button>
      </div>
    </Card>

    {/* Form Preview - All Questions Visible but Disabled */}
    <Card className="p-8 bg-white/80 backdrop-blur-sm mb-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <p className="text-sm text-blue-800 font-medium">
            Preview mode: This is what others will see when filling out your form
          </p>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            {request.title}
          </h1>
          <p className="text-gray-600">
            From {request.creator_name || "Anonymous"}
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Shield className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-600 font-medium">
              Responses are 100% anonymous
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 opacity-60">
        {request.questions.map((question, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {index + 1}. {question}
            </label>
            <Textarea
              disabled
              placeholder="Others will type their answers here..."
              className="min-h-[120px] bg-gray-50 cursor-not-allowed"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                💡 <strong>AI Feedback Coach will be available here</strong>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Others can get AI suggestions to improve their feedback before submitting
              </p>
            </div>
          </div>
        </div>

        <Button
          disabled
          className="w-full bg-gray-400 cursor-not-allowed text-lg py-6"
        >
          Submit Feedback (Preview Only)
        </Button>
      </div>
    </Card>

    {/* Share Instructions */}
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
      <h3 className="font-bold text-gray-900 mb-3 text-center">
        📤 How to Share This Request
      </h3>
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex items-start gap-3">
          <span className="text-2xl">1️⃣</span>
          <div>
            <strong>Copy the link</strong> using the button above
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">2️⃣</span>
          <div>
            <strong>Share via:</strong> Email, Slack, Teams, or any messaging app
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">3️⃣</span>
          <div>
            <strong>Track responses</strong> in your Dashboard as they come in
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
        <p className="text-xs text-gray-500 mb-1">Your Share Link:</p>
        <code className="text-xs text-indigo-600 break-all">
          {typeof window !== 'undefined' && window.location.href.split('?')[0]}
        </code>
      </div>
    </Card>

    {/* Tips Section */}
    <Card className="p-6 bg-white/80 backdrop-blur-sm mt-6">
      <h3 className="font-bold text-gray-900 mb-3">💡 Pro Tips</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Send to 5-10 people for best results</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Remind them responses are completely anonymous</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Need 3+ responses to unlock AI analysis</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-green-600">✓</span>
          <span>Check your dashboard to see who responded (anonymously)</span>
        </li>
      </ul>
    </Card>
  </>
)}

      </div>
    </div>
  )
}