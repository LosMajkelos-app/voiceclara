"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { toast } from "sonner"  

export default function FeedbackPage() {
  const params = useParams()
  const token = params.token as string

  // State
  const [loading, setLoading] = useState(true)
  const [feedbackRequest, setFeedbackRequest] = useState<any>(null)
  const [error, setError] = useState("")
  
  // Form state
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Fetch feedback request
  useEffect(() => {
    async function fetchFeedbackRequest() {
      try {
        const { data, error } = await supabase
          .from('feedback_requests')
          .select('*')
          .eq('share_token', token)
          .single()

        if (error || !data) {
          setError("Feedback request not found")
          setLoading(false)
          return
        }

        setFeedbackRequest(data)
        // Initialize answers array
        setAnswers(new Array(data.questions.length).fill(""))
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setError("Something went wrong")
        setLoading(false)
      }
    }

    fetchFeedbackRequest()
  }, [token])

  // Handle answer change
  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentStep] = value
    setAnswers(newAnswers)
  }

  // Next question
  const handleNext = () => {
    if (currentStep < feedbackRequest.questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Previous question
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Submit feedback
  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      // Prepare answers with questions
      const formattedAnswers = feedbackRequest.questions.map((q: string, idx: number) => ({
        question: q,
        answer: answers[idx] || ""
      }))

      const { error } = await supabase
        .from('responses')
        .insert({
          feedback_request_id: feedbackRequest.id,
          answers: formattedAnswers
        })

      if (error) {
        console.error('Error saving:', error)
        toast.error('Error submitting feedback. Please try again.')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Error:', err)
        toast.error('Something went wrong.')
      setSubmitting(false)
    }
  }

  // Loading state
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

  // Error state
  if (error || !feedbackRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h1>
          <p className="text-gray-600 mb-6">This feedback request doesn't exist.</p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Submitted state
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center bg-white/80 backdrop-blur-sm">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            Thank You!
          </h1>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted anonymously. 
            It will help {feedbackRequest.creator_name || "them"} grow and improve.
          </p>
          <Link href="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Create Your Own Feedback Request
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  // Main form - Multi-step
  const progress = ((currentStep + 1) / feedbackRequest.questions.length) * 100
  const currentQuestion = feedbackRequest.questions[currentStep]
  const isLastQuestion = currentStep === feedbackRequest.questions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentStep + 1} of {feedbackRequest.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question card */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl">
          
          {/* Question */}
          <div className="mb-6">
            <div className="text-sm text-indigo-600 font-semibold mb-2">
              {feedbackRequest.title}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestion}
            </h2>
          </div>

          {/* Answer textarea */}
          <Textarea
            placeholder="Type your answer here..."
            className="min-h-[200px] text-lg mb-6"
            value={answers[currentStep]}
            onChange={(e) => handleAnswerChange(e.target.value)}
            autoFocus
          />

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1"
              >
                ← Previous
              </Button>
            )}
            
            {!isLastQuestion ? (
              <Button
                onClick={handleNext}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                disabled={!answers[currentStep]?.trim()}
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={submitting || !answers[currentStep]?.trim()}
              >
                {submitting ? "Submitting..." : "Submit Feedback 🎉"}
              </Button>
            )}
          </div>

          {/* Helper text */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            Press Enter to continue • Your feedback is 100% anonymous
          </p>

        </Card>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Powered by <span className="font-semibold text-indigo-600">VoiceClara</span>
          </p>
        </div>

      </div>
    </div>
  )
}