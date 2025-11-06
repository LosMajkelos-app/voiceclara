"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function FeedbackFormPage() {
  const params = useParams()
  const shareToken = params.share_token as string
  
  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  useEffect(() => {
    async function fetchRequest() {
      console.log("🔍 Fetching with token:", shareToken)
      
      const { data, error } = await supabase
        .from("feedback_requests")
        .select("*")
        .eq("share_token", shareToken)
        .single()

      console.log("📊 Result:", { data, error })

      if (data) {
        setRequest(data)
      }
      setLoading(false)
    }

    fetchRequest()
  }, [shareToken])

  const handleSubmit = async () => {
    if (!request) return

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
      alert("Feedback submitted! 🎉")
      window.location.href = "/feedback/thank-you"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback form...</p>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">Feedback request not found</p>
          <a href="/" className="text-blue-600 hover:underline">Go home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {request.title}
          </h1>
          <p className="text-gray-600">
            Feedback for {request.creator_name}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {request.questions?.map((question: string, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <label className="block mb-3">
                <span className="text-lg font-medium text-gray-900 mb-2 block">
                  {index + 1}. {question}
                </span>
                <textarea
                  value={answers[index] || ""}
                  onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                  placeholder="Write your thoughts here..."
                  className="w-full p-4 border border-gray-300 rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-colors"
          >
            Submit Feedback 🚀
          </button>
        </div>

      </div>
    </div>
  )
}