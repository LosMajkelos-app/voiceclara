"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { FeedbackLayout } from "@/components/feedback-layout"
import { Sparkles, Lightbulb, TrendingUp, Send, Plus, X, ArrowLeft } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [creatorName, setCreatorName] = useState("")
  const [creatorEmail, setCreatorEmail] = useState("")
  const [templateType, setTemplateType] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")

  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const templates = [
    { id: "360", name: "360 Review", icon: "🔄", questions: ["What am I doing well?", "What could I improve?", "What's my biggest blind spot?", "What should I start/stop/continue?", "Any other thoughts?"] },
    { id: "manager", name: "Manager Feedback", icon: "👔", questions: ["How effective is my communication?", "Do I provide clear direction?", "How well do I support your growth?", "What could I improve as a manager?"] },
    { id: "peer", name: "Peer Review", icon: "🤝", questions: ["How well do we collaborate?", "What do I bring to the team?", "Where could I be more helpful?", "Any suggestions for improvement?"] },
    { id: "project", name: "Project Retrospective", icon: "📊", questions: ["What went well?", "What could be improved?", "What did we learn?", "What should we do differently next time?"] },
    { id: "custom", name: "AI Generated", icon: "✨", questions: [] }
  ]

  useEffect(() => {
    if (user) {
      setCreatorName(user.user_metadata?.full_name || "")
      setCreatorEmail(user.email || "")
    }
  }, [user])

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setTemplateType(template.id)
    
    if (template.id !== "custom") {
      setTitle(template.name)
      setQuestions(template.questions)
    }
  }

  const proceedToQuestions = () => {
    if (!creatorName.trim()) {
      alert("Please enter your name")
      return
    }
    if (!creatorEmail.trim() || !creatorEmail.includes('@')) {
      alert("Please enter a valid email")
      return
    }
    if (!templateType) {
      alert("Please select a template")
      return
    }

    if (templateType === "custom" && !customPrompt.trim()) {
      alert("Please describe what feedback you need")
      return
    }

    if (templateType === "custom") {
      // AI generation (mock for now)
      setTitle("Custom Feedback Request")
      setQuestions([
        "What am I doing well?",
        "What could I improve?",
        "What's my biggest blind spot?",
        "Any other thoughts?"
      ])
    }

    setStep(2)
  }

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

    try {
      const insertData = {
        title: title.trim(),
        questions: validQuestions,
        creator_name: creatorName.trim(),
        creator_email: creatorEmail.trim(),
        user_id: user?.id || null,
        guest_email: !user ? creatorEmail.trim() : null,
        share_token: crypto.randomUUID(),
        results_token: crypto.randomUUID()
      }

      console.log('Inserting:', insertData)

      const { data, error } = await supabase
        .from("feedback_requests")
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        alert("Failed to create: " + error.message)
        setLoading(false)
        return
      }

      router.push(`/results/${data.results_token}?created=true`)
    } catch (err) {
      console.error('Catch error:', err)
      alert("Failed to create request")
      setLoading(false)
    }
  }

  return (
    <FeedbackLayout
      rightPanel={
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-6 w-6" />
              <h3 className="text-xl font-bold">Pro Tips</h3>
            </div>
            <p className="text-sm opacity-90">Create effective feedback requests</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="font-semibold text-sm mb-1">Keep it Short</p>
              <p className="text-xs opacity-90">3-7 questions = best completion rate</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4" />
                <p className="font-semibold text-sm">AI Insights</p>
              </div>
              <p className="text-xs opacity-90">
                3+ responses unlock sentiment analysis, themes & blind spots
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Send className="h-4 w-4" />
                <p className="font-semibold text-sm">Easy Sharing</p>
              </div>
              <p className="text-xs opacity-90">
                Get shareable link instantly. Send via email, Slack, Teams
              </p>
            </div>

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

          <div className="mt-auto text-center pt-6 border-t border-white/20">
            <div className="text-5xl mb-3">🚀</div>
            <p className="text-lg font-bold mb-1">Ready to grow?</p>
            <p className="text-xs opacity-90">Your feedback journey starts here</p>
          </div>
        </>
      }
    >
      {/* Back Button - Conditional */}
      <button
        onClick={() => {
          if (step === 2) {
            setStep(1)
          } else {
            router.push(user ? '/dashboard' : '/')
          }
        }}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {step === 2 ? 'Back to Info' : user ? 'Back to Dashboard' : 'Back to Homepage'}
      </button>

      {/* Fixed Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Feedback Request
        </h1>
        <p className="text-sm text-gray-600">
          {step === 1 ? 'Step 1: Your Information' : 'Step 2: Customize Questions'}
        </p>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={creatorEmail}
              onChange={(e) => setCreatorEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">We'll send you a link to view responses</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Template <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    templateType === template.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <p className="font-semibold text-sm">{template.name}</p>
                </button>
              ))}
            </div>
          </div>

          {templateType === "custom" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Describe what feedback you need
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="E.g., I need feedback on my presentation skills"
                className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
              />
            </div>
          )}

          <button
            onClick={proceedToQuestions}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Generating..." : "Continue to Questions →"}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Request Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="360 Review - Q1 2025"
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

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
                    className="flex-1 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 sticky bottom-0"
          >
            {loading ? "Creating..." : "Create Feedback Request 🚀"}
          </button>
        </div>
      )}
    </FeedbackLayout>
  )
}