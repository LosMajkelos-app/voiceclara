"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { Sparkles, ArrowLeft, Copy, CheckCircle, Calendar, MessageSquare, Search, Filter, Download, Eye, X, ChevronLeft, ChevronRight } from "lucide-react"

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

  // Table filters and pagination
  const [searchQuery, setSearchQuery] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const itemsPerPage = 10

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

  // Helper function to get sentiment icon
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊'
      case 'neutral': return '😐'
      case 'negative': return '😔'
      default: return '😐'
    }
  }

  // Filter and sort responses
  const filteredAndSortedResponses = responses
    .filter(response => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch = response.answers.some(a =>
          a.question.toLowerCase().includes(searchLower) ||
          a.answer.toLowerCase().includes(searchLower)
        )
        if (!matchesSearch) return false
      }

      // Sentiment filter (currently showing neutral for all, would need backend support)
      if (sentimentFilter !== 'all') {
        // TODO: Add sentiment to response data
        return true
      }

      return true
    })
    .sort((a, b) => {
      const dateA = new Date(a.submitted_at).getTime()
      const dateB = new Date(b.submitted_at).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedResponses.length / itemsPerPage)
  const paginatedResponses = filteredAndSortedResponses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Export to CSV
  const exportToCSV = () => {
    if (!request || responses.length === 0) return

    const csvRows = []
    // Header
    csvRows.push(['ID', 'Date', 'Time', 'Question', 'Answer', 'Sentiment'].join(','))

    // Data rows
    responses.forEach((response, index) => {
      const date = new Date(response.submitted_at)
      response.answers.forEach(answer => {
        csvRows.push([
          index + 1,
          date.toLocaleDateString(),
          date.toLocaleTimeString(),
          `"${answer.question.replace(/"/g, '""')}"`,
          `"${answer.answer.replace(/"/g, '""')}"`,
          'Neutral'
        ].join(','))
      })
    })

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${request.title}-responses-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    toast.success('CSV exported successfully!')
  }

  // Truncate text helper
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
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

        {/* All Responses - New Table View */}
        {responses.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Responses ({responses.length})</h2>
              <Button
                onClick={exportToCSV}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>

            {/* Filters and Search */}
            <Card className="p-4 bg-white/80 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search responses..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Sentiment Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={sentimentFilter}
                    onChange={(e) => {
                      setSentimentFilter(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                  >
                    <option value="all">All Sentiments</option>
                    <option value="positive">😊 Positive</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="negative">😔 Negative</option>
                  </select>
                </div>

                {/* Sort Order */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </Card>

            {/* Desktop Table */}
            <Card className="hidden md:block overflow-hidden bg-white/80 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Sentiment
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedResponses.map((response, index) => {
                      const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
                      const firstAnswer = response.answers[0]
                      return (
                        <tr key={response.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            #{globalIndex}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            <div>
                              {new Date(response.submitted_at).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(response.submitted_at).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {truncateText(firstAnswer.question, 50)}
                              </p>
                              <p className="text-gray-600">
                                {truncateText(firstAnswer.answer, 100)}
                              </p>
                              {response.answers.length > 1 && (
                                <p className="text-xs text-indigo-600">
                                  +{response.answers.length - 1} more answer(s)
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-2xl">😐</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Button
                              onClick={() => setSelectedResponse(response)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {paginatedResponses.map((response, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
                const firstAnswer = response.answers[0]
                return (
                  <Card key={response.id} className="p-4 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">#{globalIndex}</span>
                        <span className="text-2xl">😐</span>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        <div>{new Date(response.submitted_at).toLocaleDateString()}</div>
                        <div>{new Date(response.submitted_at).toLocaleTimeString()}</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="font-medium text-gray-900 text-sm mb-1">
                        {truncateText(firstAnswer.question, 50)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {truncateText(firstAnswer.answer, 100)}
                      </p>
                      {response.answers.length > 1 && (
                        <p className="text-xs text-indigo-600 mt-1">
                          +{response.answers.length - 1} more answer(s)
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => setSelectedResponse(response)}
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View Full Response
                    </Button>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="p-4 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredAndSortedResponses.length)} of{' '}
                    {filteredAndSortedResponses.length} responses
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Response Detail Modal */}
        {selectedResponse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedResponse(null)}>
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Response Details</h3>
                  <button
                    onClick={() => setSelectedResponse(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedResponse.submitted_at).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">😐</span>
                      <span>Neutral</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedResponse.answers.map((answer, index) => (
                    <div key={index} className="border-l-4 border-indigo-400 pl-4 py-2">
                      <p className="font-semibold text-gray-900 mb-2">
                        {index + 1}. {answer.question}
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {answer.answer}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => setSelectedResponse(null)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}