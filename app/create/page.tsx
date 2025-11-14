"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { FeedbackLayout } from "@/components/feedback-layout"
import { getTemplatesForLanguage } from "@/lib/predefined-templates"
import { Sparkles, Lightbulb, TrendingUp, Send, Plus, X, ArrowLeft } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [creatorName, setCreatorName] = useState("")
  const [creatorEmail, setCreatorEmail] = useState("")
  const [language, setLanguage] = useState("en")
  const [templateType, setTemplateType] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")

  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [aiProgressMessage, setAiProgressMessage] = useState("")
  const [aiProgressStep, setAiProgressStep] = useState(0)

  // Get pre-translated templates for selected language (instant, no API call)
  const templates = getTemplatesForLanguage(language)

  // AI Progress messages
  const AI_PROGRESS_MESSAGES = [
    { time: 0, text: "🤖 AI is thinking...", subtext: "Analyzing your request" },
    { time: 3000, text: "💭 Generating questions...", subtext: "This may take 10-20 seconds" },
    { time: 8000, text: "✨ Almost there...", subtext: "Polishing the final questions" },
    { time: 15000, text: "⏳ Still working...", subtext: "AI is being extra thorough" }
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

  const proceedToQuestions = async () => {
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
      // Real AI generation with progress feedback
      setLoading(true)
      setAiProgressStep(0)

      // Start progress timer
      const progressTimers: NodeJS.Timeout[] = []
      AI_PROGRESS_MESSAGES.forEach((msg, index) => {
        const timer = setTimeout(() => {
          setAiProgressStep(index)
        }, msg.time)
        progressTimers.push(timer)
      })

      try {
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: customPrompt, language })
        })

        const data = await response.json()

        // Clear all progress timers
        progressTimers.forEach(timer => clearTimeout(timer))

        if (response.ok && data.questions) {
          setTitle("AI-Generated Feedback Request")
          setQuestions(data.questions)
        } else {
          alert("AI generation failed: " + (data.error || "Unknown error"))
          setLoading(false)
          setAiProgressStep(0)
          return
        }
      } catch (error) {
        console.error('AI generation error:', error)
        alert("Failed to generate questions. Please try again.")
        setLoading(false)
        setAiProgressStep(0)
        // Clear all progress timers
        progressTimers.forEach(timer => clearTimeout(timer))
        return
      }

      setLoading(false)
      setAiProgressStep(0)
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
        language: language,
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
      centerContent={false}
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

      {/* Sticky Header */}
      <div className="sticky top-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-10 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pt-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Feedback Request
        </h1>
        <p className="text-sm text-gray-600">
          {step === 1 ? 'Step 1: Your Information' : 'Step 2: Customize Questions'}
        </p>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-2 mb-20">
            <div className="space-y-4">

              {/* Name and Email in Grid on Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>
              <p className="text-xs text-gray-500 -mt-2">We'll send you a link to view responses</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Feedback Language <span className="text-red-500">*</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="es">🇪🇸 Español (Spanish)</option>
                  <option value="fr">🇫🇷 Français (French)</option>
                  <option value="de">🇩🇪 Deutsch (German)</option>
                  <option value="pl">🇵🇱 Polski (Polish)</option>
                  <option value="pt">🇵🇹 Português (Portuguese)</option>
                  <option value="it">🇮🇹 Italiano (Italian)</option>
                  <option value="nl">🇳🇱 Nederlands (Dutch)</option>
                  <option value="cs">🇨🇿 Čeština (Czech)</option>
                  <option value="sv">🇸🇪 Svenska (Swedish)</option>
                  <option value="da">🇩🇰 Dansk (Danish)</option>
                  <option value="no">🇳🇴 Norsk (Norwegian)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  AI will analyze in this language. Respondents can reply in any language.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Template <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-3 border-2 rounded-lg text-left transition-all ${
                        templateType === template.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{template.icon}</div>
                      <p className="font-semibold text-xs">{template.name}</p>
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
                    className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sticky Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-4 border-t border-gray-200 md:relative md:bg-none md:border-none md:p-0 md:mt-4">
            <div className="max-w-2xl mx-auto">
              {loading && templateType === "custom" ? (
                <div className="bg-indigo-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <p className="text-base">{AI_PROGRESS_MESSAGES[aiProgressStep]?.text}</p>
                    </div>
                    <p className="text-xs opacity-80">{AI_PROGRESS_MESSAGES[aiProgressStep]?.subtext}</p>
                    {/* Progress Bar */}
                    <div className="w-full bg-indigo-800 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-white h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${((aiProgressStep + 1) / AI_PROGRESS_MESSAGES.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={proceedToQuestions}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Continue to Questions →"}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(100vh-280px)] pr-2 mb-20">
            <div className="space-y-5">
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

              {/* Guest Login Banner */}
              {!user && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-indigo-900 mb-1">
                        💡 Create an account to unlock more features
                      </p>
                      <p className="text-xs text-indigo-700 mb-3">
                        Save this request to your dashboard, get AI insights, and track responses over time. It's free forever!
                      </p>
                      <div className="flex gap-2">
                        <a
                          href="/auth/signup"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
                        >
                          Create Account
                        </a>
                        <span className="text-xs text-gray-400">•</span>
                        <a
                          href="/auth/login"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline"
                        >
                          Sign In
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-4 border-t border-gray-200 md:relative md:bg-none md:border-none md:p-0 md:mt-4">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Feedback Request 🚀"}
              </button>
            </div>
          </div>
        </>
      )}
    </FeedbackLayout>
  )
}