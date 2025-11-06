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
          {/* Tips Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">💡 Pro Tips</h3>
              <p className="text-sm opacity-90">Create effective feedback requests</p>
            </div>

            {/* Tip 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5" />
                <p className="font-semibold">Keep it Short</p>
              </div>
              <p className="text-sm opacity-90">
                3-7 questions work best. More questions = lower completion rate.
              </p>
            </div>

            {/* Tip 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <p className="font-semibold">AI-Powered Insights</p>
              </div>
              <p className="text-sm opacity-90">
                With 3+ responses, our AI will analyze sentiment, find themes, and detect blind spots automatically.
              </p>
            </div>

            {/* Tip 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Send className="h-5 w-5" />
                <p className="font-semibold">Easy Sharing</p>
              </div>
              <p className="text-sm opacity-90">
                Get a shareable link instantly. Send via email, Slack, or any messenger.
              </p>
            </div>

            {/* Tip 4 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <p className="font-semibold">Real-Time Dashboard</p>
              </div>
              <p className="text-sm opacity-90">
                Track responses live, export results, and see AI analysis in your personal dashboard.
              </p>
            </div>
          </div>

          {/* Bottom Encouragement */}
          <div className="text-center">
            <div className="text-5xl mb-3">🚀</div>
            <p className="text-lg font-bold">Ready to grow?</p>
            <p className="text-sm opacity-90">Your feedback journey starts here</p>
          </div>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Feedback Request
          </h1>
          <p className="text-gray-600">
            Set up your personalized feedback form in minutes
          </p>
        </div>

        {/* Your Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name (Optional)
          </label>
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="John Doe"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Your Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Email (Optional)
          </label>
          <input
            type="email"
            value={creatorEmail}
            onChange={(e) => setCreatorEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            We'll send you a link to view responses
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Request Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="360 Review - Q1 2025"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Questions ({questions.length}/10)
          </label>
          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={q}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(index)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {questions.length < 10 && (
            <button
              onClick={addQuestion}
              className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Feedback Request 🚀"}
        </button>
      </div>
    </FeedbackLayout>
  )
}