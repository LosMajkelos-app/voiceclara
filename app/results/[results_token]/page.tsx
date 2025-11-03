"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"

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
  share_token: string
}

export default function ResultsPage() {
  const params = useParams()
  const resultsToken = params.results_token as string

  const [loading, setLoading] = useState(true)
  const [feedbackRequest, setFeedbackRequest] = useState<FeedbackRequest | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [error, setError] = useState("")
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)

  // Fetch all data in one useEffect
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

        // 3. Fetch AI analysis if exists
        const { data: aiData } = await supabase
          .from('ai_analysis')
          .select('*')
          .eq('feedback_request_id', requestData.id)
          .single()

        if (aiData) {
          setAiAnalysis(aiData)
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

  // Run AI analysis
  const handleAnalyze = async () => {
    if (!feedbackRequest || responses.length < 3) {
      toast.error('Need at least 3 responses for AI analysis')
      return
    }

    setAnalyzing(true)
    toast.info('Analyzing responses... This may take 30 seconds.')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackRequestId: feedbackRequest.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setAiAnalysis(data)
      toast.success('AI analysis complete! 🎉')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  // Simple sentiment analysis (backup)
  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const lowerText = text.toLowerCase()
    
    const positiveWords = ['great', 'excellent', 'good', 'amazing', 'awesome', 'love', 'best', 'helpful', 'strong']
    const negativeWords = ['bad', 'terrible', 'poor', 'weak', 'lacking', 'need', 'should', 'could', 'better', 'improve']
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    if (positiveCount > negativeCount + 1) return 'positive'
    if (negativeCount > positiveCount + 1) return 'negative'
    return 'neutral'
  }

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
            These results don&apos;t exist or the link is invalid.
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
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/feedback/${feedbackRequest.share_token}`}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 font-mono"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(`${window.location.origin}/feedback/${feedbackRequest.share_token}`)
                      toast.success("Link copied! 📋")
                    }
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* AI ANALYSIS SECTION */}
        {responses.length >= 3 && (
          <Card className="p-8 bg-white/80 backdrop-blur-sm mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">
                  🤖 AI Analysis
                </h2>
                <p className="text-gray-600">
                  Get intelligent insights powered by AI
                </p>
              </div>
              {!aiAnalysis && (
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {analyzing ? 'Analyzing...' : 'Analyze with AI'}
                </Button>
              )}
            </div>

            {aiAnalysis ? (
              <div className="space-y-6">
                
                {/* Themes */}
                {aiAnalysis.themes && aiAnalysis.themes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Key Themes</h3>
                    <div className="grid gap-4">
                      {aiAnalysis.themes.map((theme: any, idx: number) => (
                        <Card key={idx} className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-indigo-900">
                              {theme.name}
                            </h4>
                            <Badge variant="secondary">
                              {theme.count} {theme.count === 1 ? 'mention' : 'mentions'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">
                            {theme.description}
                          </p>
                          {theme.quotes && theme.quotes.length > 0 && (
                            <div className="space-y-2">
                              {theme.quotes.map((quote: string, qIdx: number) => (
                                <div
                                  key={qIdx}
                                  className="text-sm text-gray-600 italic border-l-2 border-indigo-300 pl-3"
                                >
                                  &quot;{quote}&quot;
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sentiment */}
                {aiAnalysis.sentiment && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Overall Sentiment</h3>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          aiAnalysis.sentiment.sentiment === 'positive'
                            ? 'default'
                            : aiAnalysis.sentiment.sentiment === 'concerned'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {aiAnalysis.sentiment.sentiment}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {aiAnalysis.sentiment.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {aiAnalysis.sentiment.explanation}
                    </p>
                  </div>
                )}

                {/* Summary */}
                {aiAnalysis.summary && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Executive Summary</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {aiAnalysis.summary.summary}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      {aiAnalysis.summary.strengths && aiAnalysis.summary.strengths.length > 0 && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">
                            💪 Key Strengths
                          </h4>
                          <ul className="space-y-1">
                            {aiAnalysis.summary.strengths.map((s: string, idx: number) => (
                              <li key={idx} className="text-sm text-green-800">
                                • {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Growth Areas */}
                      {aiAnalysis.summary.growthAreas && aiAnalysis.summary.growthAreas.length > 0 && (
                        <div className="p-4 bg-amber-50 rounded-lg">
                          <h4 className="font-semibold text-amber-900 mb-2">
                            🎯 Growth Areas
                          </h4>
                          <ul className="space-y-1">
                            {aiAnalysis.summary.growthAreas.map((a: string, idx: number) => (
                              <li key={idx} className="text-sm text-amber-800">
                                • {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Recommendations */}
                    {aiAnalysis.summary.recommendations && aiAnalysis.summary.recommendations.length > 0 && (
                      <div className="p-4 bg-indigo-50 rounded-lg">
                        <h4 className="font-semibold text-indigo-900 mb-2">
                          ✨ Recommended Actions
                        </h4>
                        <ol className="space-y-2">
                          {aiAnalysis.summary.recommendations.map((r: string, idx: number) => (
                            <li key={idx} className="text-sm text-indigo-800">
                              {idx + 1}. {r}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* Refresh button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                  >
                    {analyzing ? 'Re-analyzing...' : 'Refresh Analysis'}
                  </Button>
                </div>

              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🤖</div>
                <p className="text-gray-600 mb-4">
                  Click &quot;Analyze with AI&quot; to get intelligent insights about your feedback
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Identify common themes</li>
                  <li>• Analyze sentiment</li>
                  <li>• Get actionable recommendations</li>
                </ul>
              </div>
            )}
          </Card>
        )}

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
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(`${window.location.origin}/feedback/${feedbackRequest.share_token}`)
                  toast.success("Link copied! Share it with your team. 📋")
                }
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
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      Response #{responses.length - idx}
                    </Badge>
                    {(() => {
                      const allText = response.answers.map(a => a.answer).join(' ')
                      const sentiment = analyzeSentiment(allText)
                      return (
                        <Badge 
                          variant={sentiment === 'positive' ? 'default' : sentiment === 'negative' ? 'destructive' : 'secondary'}
                        >
                          {sentiment === 'positive' ? '😊 Positive' : sentiment === 'negative' ? '😐 Critical' : '😶 Neutral'}
                        </Badge>
                      )
                    })()}
                  </div>
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

        {/* Export */}
        {responses.length > 0 && (
          <Card className="p-6 mt-8 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Export & Analyze
                </h3>
                <p className="text-sm text-gray-600">
                  Download responses or refresh AI analysis
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const text = responses.map((r, idx) => {
                      return `Response #${idx + 1}\n${new Date(r.submitted_at).toLocaleString()}\n\n` +
                        r.answers.map(a => `Q: ${a.question}\nA: ${a.answer}\n`).join('\n') +
                        '\n---\n\n'
                    }).join('')
                    
                    const blob = new Blob([text], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${feedbackRequest.title.replace(/[^a-z0-9]/gi, '_')}_responses.txt`
                    a.click()
                  }}
                >
                  Export as Text
                </Button>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  )
}