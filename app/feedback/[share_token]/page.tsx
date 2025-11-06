"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react"

interface FeedbackRequest {
  id: string
  title: string
  questions: string[]
  creator_name: string
}

export default function FeedbackFormPage() {
  const params = useParams()
  const router = useRouter()
  const shareToken = params.share_token as string

  const [request, setRequest] = useState<FeedbackRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchRequest() {
      try {
        const { data, error } = await supabase
          .from("feedback_requests")
          .select("*")
          .eq("share_token", shareToken)
          .single()

        if (error || !data) {
          toast.error("Feedback request not found")
          router.push("/")
          return
        }

        setRequest(data)
        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to load feedback request")
        router.push("/")
      }
    }

    fetchRequest()
  }, [shareToken, router])

  const currentQuestion = request?.questions[currentStep]
  const progress = request ? ((currentStep + 1) / request.questions.length) * 100 : 0

  const handleNext = () => {
    if (!answers[currentStep]?.trim()) {
      toast.error("Please write something before continuing")
      return
    }

    if (request && currentStep < request.questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!request) return

    setSubmitting(true)

    try {
      const formattedAnswers = request.questions.map((question, index) => ({
        question,
        answer: answers[index] || ""
      }))

      const { error } = await supabase
        .from("responses")
        .insert({
          feedback_request_id: request.id,
          answers: formattedAnswers,
          anonymity_score: 85
        })

      if (error) throw error

      toast.success("Feedback submitted! 🎉")
      router.push("/feedback/thank-you")
    } catch (error) {
      console.error("Submit error:", error)
      toast.error("Failed to submit feedback")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading feedback form...</p>
        </Card>
      </div>
    )
  }

  if (!request) return null

  const isLastQuestion = currentStep === request.questions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Progress */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{request.title}</h1>
              <p className="text-sm text-gray-600">For {request.creator_name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Question {currentStep + 1} of {request.questions.length}
              </p>
              <div className="mt-2 w-32 bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Layout: Form (75%) + Decoration (25%) */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
        
        {/* LEFT: Form (75%) */}
        <div className="w-full lg:w-3/4 p-6 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {currentQuestion}
                  </h2>
                  <p className="text-gray-600">
                    Take your time. Your honest feedback helps them grow.
                  </p>
                </div>

                {/* Textarea */}
                <Textarea
                  value={answers[currentStep] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [currentStep]: e.target.value })
                  }
                  placeholder="Write your thoughts here..."
                  className="min-h-[200px] text-lg p-4 resize-none"
                  autoFocus
                />

                {/* AI Tip */}
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-900 font-medium">💡 AI Tip</p>
                    <p className="text-sm text-purple-700 mt-1">
                      Be specific about behaviors and actions, not personality traits.
                      Use examples when possible.
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-700 gap-2"
                    size="lg"
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
                  </Button>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* RIGHT: Decorative Panel (25%) */}
        <div className="hidden lg:block w-1/4 bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-indigo-600 p-8">
              <motion.p 
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💭
              </motion.p>
              <p className="text-lg font-medium">Your feedback matters</p>
              <p className="text-sm text-indigo-500 mt-2">Anonymous & Valuable</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}