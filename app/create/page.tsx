"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Sparkles, Loader2 } from "lucide-react"
import { FEEDBACK_TEMPLATES, FeedbackTemplate } from "@/lib/templates"

export default function CreatePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState<string[]>([
    "What am I doing well?",
    "What could I improve?",
    "What's my biggest blind spot?",
    "What should I start doing?",
    "Any other thoughts?"
  ])
  const [loading, setLoading] = useState(false)
  
  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Prefill user data if logged in
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || "")
      setEmail(user.email || "")
    }
  }, [user])

  // Handle template selection
  const handleTemplateSelect = (template: FeedbackTemplate) => {
    setSelectedTemplate(template.id)
    setQuestions([...template.questions])
    setTitle(`${template.name} - ${new Date().toLocaleDateString()}`)
    toast.success(`Loaded ${template.name} template!`)
    
    // Scroll to questions
    setTimeout(() => {
      document.getElementById('questions-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  // Handle AI generation
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please describe what feedback you need")
      return
    }

    if (aiPrompt.length > 500) {
      toast.error("Prompt is too long (max 500 characters)")
      return
    }

    setAiLoading(true)
    setSelectedTemplate('ai-generated')

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions')
      }

      console.log('✅ AI generated questions:', data.questions)
      
      setQuestions(data.questions)
      setTitle(`Feedback Request - ${new Date().toLocaleDateString()}`)
      toast.success("AI generated 5 custom questions! 🎉")
      
      // Scroll to questions
      setTimeout(() => {
        document.getElementById('questions-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
      }, 100)

    } catch (error: any) {
      console.error('❌ AI generation error:', error)
      toast.error(error.message || "Failed to generate questions")
    } finally {
      setAiLoading(false)
    }
  }

  // Update question
  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  // Add question
  const addQuestion = () => {
    if (questions.length >= 10) {
      toast.error("Maximum 10 questions allowed")
      return
    }
    setQuestions([...questions, ""])
  }

  // Remove question
  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast.error("Must have at least 1 question")
      return
    }
    setQuestions(questions.filter((_, i) => i !== index))
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error("Please add a title")
      return
    }

    if (questions.filter(q => q.trim()).length === 0) {
      toast.error("Please add at least one question")
      return
    }

    if (!user && !email.trim()) {
      toast.error("Please provide your email")
      return
    }

    setLoading(true)

    try {
      const filteredQuestions = questions.filter(q => q.trim())

      // Generate unique tokens
      const shareToken = crypto.randomUUID()
      const resultsToken = crypto.randomUUID()

      const requestData = {
        creator_name: name || "Anonymous",
        creator_email: user ? user.email : null,
        guest_email: user ? null : email,
        user_id: user ? user.id : null,
        title: title.trim(),
        questions: filteredQuestions,
        share_token: shareToken,
        results_token: resultsToken,
      }

      console.log('📤 Creating request:', requestData)

      const { data, error } = await supabase
        .from("feedback_requests")
        .insert([requestData])
        .select()
        .single()

      if (error) throw error

      console.log('✅ Request created:', data)
      toast.success("Feedback request created! 🎉")
      
      if (user) {
        router.push('/dashboard')
      } else {
        router.push(`/feedback/${data.share_token}`)
      }

    } catch (error: any) {
      console.error("Error creating request:", error)
      toast.error(error.message || "Failed to create request")
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-3">
            Create Feedback Request
          </h1>
          <p className="text-gray-600 text-lg">
            Choose a template or let AI generate questions for you
          </p>
        </div>

        {/* Template Selector */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📚 Choose a Template
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEEDBACK_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedTemplate === template.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {template.description}
                    </p>
                    <span className="inline-block mt-2 text-xs text-indigo-600 font-medium">
                      {template.questions.length} questions
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* AI Generation Box */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-purple-600 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                ✨ AI-Powered Question Generator
              </h2>
              <p className="text-gray-600 mb-4">
                Describe what feedback you need and AI will create perfect questions for you
              </p>
              
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.g., 'I want feedback on my presentation skills' or 'Help me get feedback on my code review comments'"
                className="mb-4 min-h-[100px]"
                maxLength={500}
                disabled={aiLoading}
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {aiPrompt.length}/500 characters
                </span>
                <Button
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Questions with AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Form */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm" id="questions-section">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Creator Info */}
            {!user && (
              <div className="space-y-4 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Your Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send you a link to view responses
                  </p>
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Title
              </label>
              <Input
                type="text"
                placeholder="E.g., Q4 Leadership Feedback"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Questions */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Questions ({questions.length}/10)
                </label>
                {selectedTemplate && (
                  <span className="text-sm text-indigo-600">
                    {selectedTemplate === 'ai-generated' ? '🤖 AI Generated' : `📚 ${FEEDBACK_TEMPLATES.find(t => t.id === selectedTemplate)?.name}`}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Textarea
                        value={question}
                        onChange={(e) => updateQuestion(index, e.target.value)}
                        placeholder={`Question ${index + 1}`}
                        className="min-h-[60px]"
                      />
                    </div>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeQuestion(index)}
                        className="shrink-0"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {questions.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addQuestion}
                  className="w-full mt-3"
                >
                  + Add Question
                </Button>
              )}
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-6"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Feedback Request →"}
              </Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  )
}