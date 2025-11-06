"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"

export default function FeedbackFormPage() {
  const params = useParams()
  const shareToken = params.share_token as string
  
  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchRequest() {
      const { data, error } = await supabase
        .from("feedback_requests")
        .select("*")
        .eq("share_token", shareToken)
        .single()

      if (data) {
        setRequest(data)
        // Load from localStorage if exists
        const saved = localStorage.getItem(`feedback_${shareToken}`)
        if (saved) {
          setAnswers(JSON.parse(saved))
        }
      }
      setLoading(false)
    }

    fetchRequest()
  }, [shareToken])

  // Auto-save to localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`feedback_${shareToken}`, JSON.stringify(answers))
    }
  }, [answers, shareToken])

  const currentQuestion = request?.questions[currentStep]
  const progress = request ? ((currentStep + 1) / request.questions.length) * 100 : 0
  const isLastQuestion = request && currentStep === request.questions.length - 1

  const handleNext = () => {
    if (!answers[currentStep]?.trim()) {
      alert("Please write something before continuing")
      return
    }

    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleNext()
    }
  }

  const handleSubmit = async () => {
    if (!request) return
    setSubmitting(true)

    try {
      const formattedAnswers = request.questions.map((q: string, i: number) => ({
        question: q,
        answer: answers[i] || ""
      }))

      const { error } = await supabase
        .from("responses")
        .insert({
          feedback_request_id: request.id,
          answers: formattedAnswers,
          anonymity_score: 85
        })

      if (!error) {
        localStorage.removeItem(`feedback_${shareToken}`)
        alert("Feedback submitted! 🎉")
        window.location.href = "/feedback/thank-you"
      }
    } catch (error) {
      console.error(error)
      alert("Failed to submit feedback")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback form...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Feedback request not found</p>
          <a href="/" className="text-indigo-600 hover:underline">Go home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-indigo-900">VoiceClara</h1>
              <p className="text-sm text-gray-600">Feedback for {request.creator_name}</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              <a href="/create" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Create Request
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - No Scroll, Full Height */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Form (75%) */}
        <div className="w-full lg:w-3/4 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-2xl flex flex-col h-full justify-center">
            
            {/* Question */}
            <div className="mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {currentQuestion}
              </h2>
              <p className="text-gray-600">
                Take your time. Your honest feedback helps them grow.
              </p>
            </div>

            {/* Textarea - Auto Height */}
            <textarea
              value={answers[currentStep] || ""}
              onChange={(e) => setAnswers({ ...answers, [currentStep]: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="Write your thoughts here..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex-1 min-h-[200px] max-h-[400px]"
              autoFocus
            />

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  "Submitting..."
                ) : isLastQuestion ? (
                  <>
                    Submit Feedback
                    <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT: Progress + AI Tips (25%) */}
        <div className="hidden lg:flex w-1/4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 flex-col justify-between text-white">
          
          {/* Top: Progress */}
          <div>
            <p className="text-sm font-medium mb-3 opacity-90">
              Question {currentStep + 1} of {request.questions.length}
            </p>
            <div className="bg-white/20 rounded-full h-3 mb-6">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-2xl font-bold mb-1">{Math.round(progress)}%</p>
            <p className="text-sm opacity-90">Complete</p>
          </div>

          {/* Middle: AI Tip */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5" />
              <p className="font-semibold">💡 AI Tip</p>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Be specific about behaviors and actions, not personality traits. 
              Use examples when possible.
            </p>
          </div>

          {/* Bottom: Encouragement */}
          <div className="text-center">
            <p className="text-5xl mb-4">💭</p>
            <p className="text-lg font-semibold mb-2">Your feedback matters</p>
            <p className="text-sm opacity-90">Anonymous & Valuable</p>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Powered by AI
              </span>
              <span>•</span>
              <span>🔒 100% Anonymous</span>
            </div>
            <div>
              © 2025 VoiceClara • <a href="/" className="text-indigo-600 hover:underline">voiceclara.com</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}