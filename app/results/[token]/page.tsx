"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { Sparkles, ArrowLeft, Copy, CheckCircle, Calendar, MessageSquare, Search, Filter, Download, Eye, X, ChevronLeft, ChevronRight, Share2, Mail, FileText, FileDown, BarChart } from "lucide-react"
import DashboardSidebar from "@/app/components/dashboard-sidebar"
import AccountSettingsModal from "@/app/components/account-settings-modal"
import AnalyticsCharts from "@/app/components/analytics-charts"
import EmailInvitationModal from "@/app/components/email-invitation-modal"
import { exportToEnhancedCSV, exportToPDF } from "@/lib/export-utils"

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
  const [aiAnalysisResponseCount, setAiAnalysisResponseCount] = useState<number>(0)
  const [loadingCachedAnalysis, setLoadingCachedAnalysis] = useState(true)

  // Table filters and pagination
  const [searchQuery, setSearchQuery] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [showCharts, setShowCharts] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
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

        // Load cached AI analysis if available
        const { data: cachedAnalysis, error: analysisError } = await supabase
          .from("ai_analysis")
          .select("*")
          .eq("feedback_request_id", requestData.id)
          .single()

        if (!analysisError && cachedAnalysis) {
          setAiAnalysis(cachedAnalysis)
          setAiAnalysisResponseCount(cachedAnalysis.response_count_at_analysis || 0)
        }
        setLoadingCachedAnalysis(false)

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

    // Check if there are new responses since last analysis
    if (aiAnalysis && responses.length === aiAnalysisResponseCount) {
      toast.info("No new responses since last analysis. Analysis is up to date.")
      return
    }

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
        setAiAnalysisResponseCount(responses.length)

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

  // Export handlers
  const handleExportCSV = () => {
    if (!request || responses.length === 0) return
    exportToEnhancedCSV({ request, responses, aiAnalysis })
    toast.success('CSV exported successfully!')
  }

  const handleExportPDF = () => {
    if (!request || responses.length === 0) return
    exportToPDF({ request, responses, aiAnalysis })
    toast.success('PDF exported successfully!')
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Unified Sidebar */}
      <DashboardSidebar
        user={user}
        onAccountSettingsClick={() => setShowAccountSettings(true)}
      />

      {/* Main Content - Flex Container for Center + Right */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="lg:hidden">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{request.title}</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Created by {request.creator_name || "Anonymous"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={copyShareLink}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5"
                >
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">Copy link to share</span>
                  <span className="sm:hidden text-xs">Copy</span>
                </Button>
                {user && (
                  <Button
                    onClick={() => setShowEmailModal(true)}
                    variant="outline"
                    size="sm"
                    className="hidden md:flex items-center gap-1.5"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-xs">Send Invitations</span>
                  </Button>
                )}
                {responses.length > 0 && (
                  <>
                    <Button
                      onClick={handleExportCSV}
                      variant="outline"
                      size="sm"
                      className="hidden md:flex items-center gap-1.5"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-xs">CSV</span>
                    </Button>
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      size="sm"
                      className="hidden md:flex items-center gap-1.5"
                    >
                      <FileDown className="h-4 w-4" />
                      <span className="text-xs">PDF</span>
                    </Button>
                  </>
                )}
                {responses.length >= 3 && (
                  <Button
                    onClick={handleAIAnalysis}
                    disabled={analyzingAI}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs">{analyzingAI ? "Analyzing..." : "AI Analysis"}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="flex-1 overflow-y-auto pb-20">
          <div className="h-full lg:grid lg:grid-cols-2 lg:gap-4 p-4">
            {/* CENTER COLUMN - Request Details */}
            <div className="space-y-4 lg:pr-2">
              {/* Success Banner */}
              {isNewlyCreated && (
                <Card className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎉</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">Request Created!</h3>
                      <p className="text-xs opacity-90">Share the link to collect feedback</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2">
                <Card className="p-3 bg-white">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-600">Responses</p>
                      <p className="text-lg font-bold text-gray-900">{responses.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3 bg-white">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-600">Questions</p>
                      <p className="text-lg font-bold text-gray-900">{request.questions.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-3 bg-white">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Created</p>
                      <p className="text-xs font-bold text-gray-900">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Share Link Card */}
              <Card className="p-4 bg-white">
                <h3 className="text-sm font-bold text-gray-900 mb-2">Share Link</h3>
                <p className="text-xs text-gray-600 mb-2">Share this link to collect more feedback:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/feedback/${request.share_token}`}
                    className="flex-1 px-2 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs"
                  />
                  <Button onClick={copyShareLink} variant="outline" size="sm" className="h-auto py-1.5">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </Card>

              {/* Questions List */}
              <Card className="p-4 bg-white">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Questions ({request.questions.length})</h3>
                <div className="space-y-2">
                  {request.questions.map((q, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className="font-semibold text-indigo-600 flex-shrink-0">{i + 1}.</span>
                      <p className="text-gray-700">{q}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Analysis Progress */}
              {responses.length < 3 && (
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 text-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">AI Analysis Locked</h3>
                      <p className="text-xs text-gray-600 mb-2">
                        Collect {3 - responses.length} more response{3 - responses.length !== 1 ? 's' : ''} to unlock AI insights
                      </p>
                      <div className="w-full bg-purple-200 rounded-full h-1.5">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${(responses.length / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Guest Login Banner */}
              {!user && (
                <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-indigo-900 mb-1">Save to Dashboard</h3>
                      <p className="text-xs text-indigo-800 mb-2">
                        Create a free account to track responses and get AI insights
                      </p>
                      <div className="flex gap-2">
                        <Link href="/auth/signup">
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-7 text-xs">
                            Sign Up
                          </Button>
                        </Link>
                        <Link href="/auth/login">
                          <Button variant="outline" size="sm" className="border-indigo-600 text-indigo-600 h-7 text-xs">
                            Sign In
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* AI Analysis Results - in center column */}
              {responses.length >= 3 && (
                <div className="space-y-3">
                  {/* Quality Metrics Warning */}
                  {aiAnalysis?.quality && aiAnalysis.quality.filteredResponses > 0 && (
                    <Card className="p-3 bg-yellow-50 border-2 border-yellow-300">
                      <div className="flex items-start gap-2">
                        <div className="text-xl">⚠️</div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-yellow-900 mb-1">Quality Notice</h4>
                          <p className="text-xs text-yellow-800">
                            {aiAnalysis.quality.filteredResponses} of {aiAnalysis.quality.totalResponses} responses filtered as test/spam
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Summary */}
                  <Card className="p-4 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <h3 className="text-sm font-bold text-gray-900">AI Summary</h3>
                    </div>

                    {!aiAnalysis && !loadingCachedAnalysis && (
                      <div className="py-8 text-center">
                        <div className="text-4xl mb-3">🤖</div>
                        <p className="text-sm text-gray-600 mb-4">
                          Click "AI Analysis" above to generate insights from your feedback
                        </p>
                      </div>
                    )}

                    {loadingCachedAnalysis && (
                      <div className="py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                        <p className="text-xs text-gray-600">Loading analysis...</p>
                      </div>
                    )}

                    {aiAnalysis && (
                      <>
                        <p className="text-xs text-gray-700 mb-3">{aiAnalysis.summary?.summary}</p>

                    {aiAnalysis.summary?.strengths && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-green-700 mb-1">Strengths:</h4>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {aiAnalysis.summary.strengths.map((strength: string, i: number) => (
                            <li key={i} className="text-xs text-gray-700">{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiAnalysis.summary?.growthAreas && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-orange-700 mb-1">Growth Areas:</h4>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {aiAnalysis.summary.growthAreas.map((area: string, i: number) => (
                            <li key={i} className="text-xs text-gray-700">{area}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                        {aiAnalysis.summary?.recommendations && (
                          <div>
                            <h4 className="text-xs font-semibold text-indigo-700 mb-1">Recommendations:</h4>
                            <ul className="list-disc pl-4 space-y-0.5">
                              {aiAnalysis.summary.recommendations.map((rec: string, i: number) => (
                                <li key={i} className="text-xs text-gray-700">{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </Card>

                  {/* Sentiment */}
                  {aiAnalysis?.sentiment && (
                    <Card className="p-4 bg-white">
                      <h3 className="text-sm font-bold text-gray-900 mb-2">Sentiment</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {aiAnalysis.sentiment.sentiment === 'positive' && '😊'}
                            {aiAnalysis.sentiment.sentiment === 'constructive' && '💡'}
                            {aiAnalysis.sentiment.sentiment === 'neutral' && '😐'}
                            {aiAnalysis.sentiment.sentiment === 'concerned' && '😟'}
                          </span>
                          <span className="text-sm font-semibold capitalize">{aiAnalysis.sentiment.sentiment}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">{aiAnalysis.sentiment.confidence}%</p>
                          <p className="text-xs text-gray-500">Confidence</p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Themes */}
                  {aiAnalysis?.themes && aiAnalysis.themes.length > 0 && (
                    <Card className="p-4 bg-white">
                      <h3 className="text-sm font-bold text-gray-900 mb-2">Key Themes</h3>
                      <div className="space-y-3">
                        {aiAnalysis.themes.map((theme: any, i: number) => (
                          <div key={i} className="border-l-4 border-indigo-400 pl-3 py-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-xs font-semibold text-gray-900">{theme.name}</h4>
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                {theme.count}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{theme.description}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Responses Table */}
            <div className="space-y-3 lg:pl-2 mt-4 lg:mt-0">
              {/* Empty State */}
              {responses.length === 0 && (
                <Card className="p-8 bg-white text-center">
                  <div className="text-5xl mb-3">📭</div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">No Responses Yet</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Share your feedback link to start collecting responses
                  </p>
                  <Button onClick={copyShareLink} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Copy className="mr-1.5 h-4 w-4" />
                    Copy Share Link
                  </Button>
                </Card>
              )}

              {/* Analytics Charts Section */}
              {responses.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Analytics</h2>
                    <Button
                      onClick={() => setShowCharts(!showCharts)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 h-7"
                    >
                      <BarChart className="h-3 w-3" />
                      <span className="text-xs">{showCharts ? 'Hide' : 'Show'} Charts</span>
                    </Button>
                  </div>

                  {showCharts && (
                    <AnalyticsCharts responses={responses} aiAnalysis={aiAnalysis} />
                  )}
                </div>
              )}

              {/* Responses Section */}
              {responses.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Responses ({responses.length})</h2>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleExportCSV}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 h-7"
                      >
                        <FileText className="h-3 w-3" />
                        <span className="text-xs">CSV</span>
                      </Button>
                      <Button
                        onClick={handleExportPDF}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 h-7"
                      >
                        <FileDown className="h-3 w-3" />
                        <span className="text-xs">PDF</span>
                      </Button>
                    </div>
                  </div>

                  {/* Filters */}
                  <Card className="p-3 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                          }}
                          className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    </div>
                  </Card>

                  {/* Desktop Table */}
                  <Card className="hidden md:block overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">#</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Preview</th>
                            <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {paginatedResponses.map((response, index) => {
                            const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
                            const firstAnswer = response.answers[0]
                            return (
                              <tr key={response.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2 text-xs font-medium text-gray-900">#{globalIndex}</td>
                                <td className="px-3 py-2 text-xs text-gray-600">
                                  {new Date(response.submitted_at).toLocaleDateString()}
                                </td>
                                <td className="px-3 py-2 text-xs text-gray-700">
                                  <p className="font-medium text-gray-900 mb-0.5">
                                    {truncateText(firstAnswer.question, 40)}
                                  </p>
                                  <p className="text-gray-600">
                                    {truncateText(firstAnswer.answer, 60)}
                                  </p>
                                  {response.answers.length > 1 && (
                                    <p className="text-xs text-indigo-600 mt-0.5">
                                      +{response.answers.length - 1} more
                                    </p>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <Button
                                    onClick={() => setSelectedResponse(response)}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                  >
                                    <Eye className="h-3 w-3" />
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
                  <div className="md:hidden space-y-2">
                    {paginatedResponses.map((response, index) => {
                      const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
                      const firstAnswer = response.answers[0]
                      return (
                        <Card key={response.id} className="p-3 bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-bold text-gray-900">#{globalIndex}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(response.submitted_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-gray-900 mb-1">
                            {truncateText(firstAnswer.question, 50)}
                          </p>
                          <p className="text-xs text-gray-600 mb-2">
                            {truncateText(firstAnswer.answer, 80)}
                          </p>
                          <Button
                            onClick={() => setSelectedResponse(response)}
                            variant="outline"
                            size="sm"
                            className="w-full h-7 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Full
                          </Button>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Card className="p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600">
                          {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedResponses.length)} of {filteredAndSortedResponses.length}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium px-2">
                            {currentPage}/{totalPages}
                          </span>
                          <Button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            size="sm"
                            className="h-7 px-2"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 z-10">
          <div className="px-4 sm:px-6 lg:px-8 lg:pl-60">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <span>🤖 Powered by AI</span>
                <span className="hidden sm:inline">•</span>
                <span>🔒 100% Anonymous</span>
              </div>
              <div className="text-center sm:text-right">
                <div>© 2025 <a href="/" className="text-indigo-600 hover:underline font-semibold">VoiceClara</a></div>
                <div className="mt-1">For questions: <a href="mailto:info@voiceclara.com" className="text-indigo-600 hover:underline">info@voiceclara.com</a></div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedResponse(null)}>
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Response Details</h3>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedResponse.submitted_at).toLocaleString()}
                </div>
              </div>

              <div className="space-y-4">
                {selectedResponse.answers.map((answer, index) => (
                  <div key={index} className="border-l-4 border-indigo-400 pl-4 py-2">
                    <p className="font-semibold text-gray-900 mb-2">
                      {index + 1}. {answer.question}
                    </p>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
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

      {/* Account Settings Modal */}
      {showAccountSettings && user && (
        <AccountSettingsModal
          user={user}
          onClose={() => setShowAccountSettings(false)}
        />
      )}

      {/* Email Invitation Modal */}
      {showEmailModal && request && (
        <EmailInvitationModal
          feedbackRequestId={request.id}
          requestTitle={request.title}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  )
}