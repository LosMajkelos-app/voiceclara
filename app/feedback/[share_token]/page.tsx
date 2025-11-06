"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, ArrowRight, Check, Sparkles, Shield, Activity } from "lucide-react"
import { FeedbackLayout } from "@/components/feedback-layout"

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
      const { data } = await supabase
        .from("feedback_requests")
        .select("*")
        .eq("share_token", shareToken)
        .single()

      if (data) {
        setRequest(data)
        const saved = localStorage.getItem(`feedback_${shareToken}`)
        if (saved) setAnswers(JSON.parse(saved))
      }
      setLoading(false)
    }
    fetchRequest()
  }, [shareToken])

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
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!request) return
    setSubmitting(true)

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
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!request) return null

  return (
    <FeedbackLayout
      rightPanel={
        <>
          {/* Top: Progress */}
          <div>
            <p className="text-sm font-medium mb-3 opacity-90">
              Question {currentStep + 1} of {request.questions.length}
            </p>
            <div className="bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-3xl font-bold mb-1">{Math.round(progress)}%</p>
            <p className="text-sm opacity-90">Complete</p>
          </div>

          {/* Middle: AI Info */}
          <div className="space-y-4">
            {/* AI Tip */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5" />
                <p className="font-semibold">💡 AI Tip</p>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                Be specific about behaviors and actions, not personality traits. 
                Use examples when possible.
              </p>
            </div>

            {/* AI Guardian with Animation */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                  <Activity className="h-5 w-5 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <p className="font-semibold">🤖 AI Guardian</p>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                Our AI is monitoring your responses in real-time. 
                Before submitting, you'll review and improve your feedback.
              </p>
            </div>

            {/* Anonymous Guarantee */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5" />
                <p className="font-semibold">🔒 Privacy First</p>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                Your identity is completely protected. No tracking, no data collection.
              </p>
            </div>
          </div>

          {/* Bottom: Encouragement */}
          <div className="text-center">
            <div className="text-6xl mb-4">💭</div>
            <p className="text-xl font-bold mb-2">Your feedback matters</p>
            <p className="text-sm opacity-90">100% Anonymous & Valuable</p>
          </div>
        </>
      }
    >
      {/* Progress Bar ABOVE "Feedback for X" */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">
            Question {currentStep + 1} of {request.questions.length}
          </p>
          <p className="text-sm font-semibold text-indigo-600">
            {Math.round(progress)}%
          </p>
        </div>
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* "Feedback for X" Header */}
      <div className="mb-6">
        <p className="text-sm text-indigo-600 font-semibold mb-2">
          Feedback for {request.creator_name}
        </p>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          {currentQuestion}
        </h2>
        <p className="text-gray-600">
          Take your time. Your honest feedback helps them grow.
        </p>
      </div>

      {/* Textarea */}
      <textarea
        value={answers[currentStep] || ""}
        onChange={(e) => setAnswers({ ...answers, [currentStep]: e.target.value })}
        placeholder="Write your thoughts here..."
        className="w-full p-6 bg-white border-2 border-indigo-200 rounded-2xl text-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm min-h-[250px] mb-6"
        autoFocus
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={submitting}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          {submitting ? "Submitting..." : isLastQuestion ? (
            <>Submit Feedback <Check className="h-5 w-5" /></>
          ) : (
            <>Next Question <ArrowRight className="h-5 w-5" /></>
          )}
        </button>
      </div>
    </FeedbackLayout>
  )
}