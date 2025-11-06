"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { FeedbackLayout } from "@/components/feedback-layout"
import { Sparkles, Lightbulb, TrendingUp, Send, Plus, X } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const { user } = useAuth()

  const [creatorName, setCreatorName] = useState("")
  const [creatorEmail, setCreatorEmail] = useState("")
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState([
    "What am I doing well?",
    "What could I improve?",
    "What's my biggest blind spot?",
    "What should I start/stop/continue?",
    "Any other thoughts?"
  ])
  const [loading, setLoading] = useState(false)

  const addQuestion = () => {
    if (questions.length < 10) {
      setQuestions([...questions, ""])
    }
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, value: string) => {
    const updated = [...questions]
    updated[index] = value
    setQuestions(updated)
  }

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Please enter a title")
      return
    }

    const validQuestions = questions.filter(q => q.trim())
    if (validQuestions.length === 0) {
      alert("Please add at least one question")
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from("feedback_requests")
      .insert({
        title: title.trim(),
        questions: validQuestions,
        creator_name: creatorName.trim() || "Anonymous",
        creator_email: creatorEmail.trim() || null,
        user_id: user?.id || null,
        guest_email: !user && creatorEmail.trim() ? creatorEmail.trim() : null
      })
      .select()
      .single()

    if (error || !data) {
      alert("Failed to create request")
      setLoading(false)
      return
    }

    router.push(`/feedback/${data.share_token}?created=true`)
  }

  return (
    <FeedbackLayout
      rightPanel={
        <>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-6 w-6" />
              <h3 className="text-xl font-bold">Pro Tips</h3>
            </div>
            <p className="text-sm opacity-90">
              Create effective feedback requests
            </p>
          </div>

          {/* Tips Cards - Compact */}
          <div className="space-y-3 mb-6">
            {/* Tip 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="font-semibold text-sm mb-1">Keep it Short</p>
              <p className="text-xs opacity-90">
                3-7 questions = best completion rate
              </p>
            </div>

            {/* Tip 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4" />
                <p className="font-semibold text-sm">AI Insights</p>
              </div>
              <p className="text-xs opacity-90">
                3+ responses unlock sentiment analysis, themes & blind spots
              </p>
            </div>

            {/* Tip 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Send className="h-4 w-4" />
                <p className="font-semibold text-sm">Easy Sharing</p>
              </div>
              <p className="text-xs opacity-90">
                Get shareable link instantly. Send via email, Slack, Teams
              </p>
            </div>

            {/* Tip 4 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4" />
                <p className="font-semibold text-sm">Dashboard</p>
              </div>
              <p className="text-xs opacity-90">
                Track responses live, export results, see AI analysis
              </p>
            </div>
          </div>

          {/* Bottom Encouragement */}
          <div className="mt-auto text-center pt-6 border-t border-white/20">
            <div className="text-5xl mb-3">🚀</div>
            <p className="text-lg font-bold mb-1">Ready to grow?</p>
            <p className="text-xs opacity-90">Your feedback journey starts here</p>
          </div>
        </>
      }
    >
      {/* LEFT SIDE - Compact Form */}
      <div className="space-y-5">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Feedback Request
          </h1>
          <p className="text-sm text-gray-600">
            Set up your form in minutes
          </p>
        </div>

        {/* Your Name - Compact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Name <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Your Email - Compact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Email <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="email"
            value={creatorEmail}
            onChange={(e) => setCreatorEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            We'll send you a link to view responses
          </p>
        </div>

        {/* Title - Compact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Request Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="360 Review - Q1 2025"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Questions - Compact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Questions ({questions.length}/10)
          </label>
          <div className="space-y-2">
            {questions.map((q, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {questions.length < 10 && (
            <button
              onClick={addQuestion}
              className="mt-2 flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          )}
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm"
        >
          {loading ? "Creating..." : "Create Feedback Request 🚀"}
        </button>
      </div>
    </FeedbackLayout>
  )
}