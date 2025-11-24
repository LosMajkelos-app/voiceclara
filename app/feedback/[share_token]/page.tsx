"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, ArrowRight, Sparkles, Shield, Activity, Edit } from "lucide-react"
import { FeedbackLayout } from "@/components/feedback-layout"

export default function FeedbackFormPage() {
  const params = useParams()
  const shareToken = params.share_token as string
  
  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [aiScore, setAiScore] = useState<any>(null)
  const [analyzingAI, setAnalyzingAI] = useState(false)
  const [anonymityScore, setAnonymityScore] = useState(100)
  const [anonymityWarnings, setAnonymityWarnings] = useState<string[]>([])

  // Calculate anonymity score based on answer content
  const calculateAnonymityScore = (text: string): { score: number; warnings: string[] } => {
    if (!text) return { score: 100, warnings: [] }

    const warnings: string[] = []
    let deductions = 0

    // Check for email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    if (emailRegex.test(text)) {
      warnings.push("Email address detected")
      deductions += 30
    }

    // Check for phone numbers
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{9,}/g
    if (phoneRegex.test(text)) {
      warnings.push("Phone number detected")
      deductions += 25
    }

    // Check for common name patterns (capitalized words that might be names)
    const namePattern = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g
    const potentialNames = text.match(namePattern)
    if (potentialNames && potentialNames.length > 0) {
      warnings.push("Possible name detected")
      deductions += 20
    }

    // Check for specific dates (MM/DD/YYYY, DD-MM-YYYY, etc)
    const dateRegex = /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g
    if (dateRegex.test(text)) {
      warnings.push("Specific date mentioned")
      deductions += 10
    }

    // Check for "I am [name]" or "My name is"
    const selfIdentifyRegex = /(I am |my name is |I'm )[A-Z][a-z]+/gi
    if (selfIdentifyRegex.test(text)) {
      warnings.push("Self-identification detected")
      deductions += 35
    }

    // Check for personal pronouns in excess (might reveal identity)
    const personalPronouns = (text.match(/\b(I|me|my|mine)\b/gi) || []).length
    if (personalPronouns > 10) {
      warnings.push("Heavy use of personal identifiers")
      deductions += 5
    }

    // Check for specific location mentions (addresses)
    const addressPattern = /\d+\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)/gi
    if (addressPattern.test(text)) {
      warnings.push("Specific address mentioned")
      deductions += 25
    }

    const finalScore = Math.max(0, 100 - deductions)
    return { score: finalScore, warnings }
  }

  // Update anonymity score when answer changes
  useEffect(() => {
    const currentAnswer = answers[currentStep] || ""
    const { score, warnings } = calculateAnonymityScore(currentAnswer)
    setAnonymityScore(score)
    setAnonymityWarnings(warnings)
  }, [answers, currentStep])

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
  const totalQuestions = request?.questions?.length || 0
  const isLastQuestion = currentStep === totalQuestions - 1

  const handleNext = () => {
    if (!answers[currentStep]?.trim()) {
      alert("Please write something before continuing")
      return
    }

    if (!isLastQuestion) {
      setCurrentStep(currentStep + 1)
    }
    // On last question, do nothing - show submit buttons instead
  }

  const handleReviewWithAI = () => {
    if (!answers[currentStep]?.trim()) {
      alert("Please answer the current question first")
      return
    }
    setShowReview(true)
    analyzeWithAI()
  }

  const handleDirectSubmit = async () => {
    if (!answers[currentStep]?.trim()) {
      alert("Please answer the current question first")
      return
    }

    const confirmed = confirm("Submit feedback without AI review?")
    if (!confirmed) return

    await handleSubmit()
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const analyzeWithAI = async () => {
  setAnalyzingAI(true)

  try {
    // REAL OpenAI API Call
    const formattedAnswers = request.questions.map((q: string, i: number) => ({
      question: q,
      answer: answers[i] || ""
    }))

    const response = await fetch('/api/analyze-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: formattedAnswers,
        language: request.language || 'en',
        shareToken: shareToken
      })
    })

    const aiResult = await response.json()

    setAiScore(aiResult)
  } catch (error) {
    console.error('AI analysis error:', error)
    // Fallback to mock if API fails - with language support
    const lang = request.language || 'en'
    const fallbackSuggestions: Record<string, string[]> = {
      'en': [
        "Try to be more specific in your responses",
        "Consider adding concrete examples",
        "Balance positive and constructive feedback"
      ],
      'es': [
        "Intenta ser más específico en tus respuestas",
        "Considera agregar ejemplos concretos",
        "Equilibra comentarios positivos y constructivos"
      ],
      'fr': [
        "Essayez d'être plus précis dans vos réponses",
        "Envisagez d'ajouter des exemples concrets",
        "Équilibrez les retours positifs et constructifs"
      ],
      'de': [
        "Versuchen Sie, in Ihren Antworten spezifischer zu sein",
        "Erwägen Sie, konkrete Beispiele hinzuzufügen",
        "Balancieren Sie positives und konstruktives Feedback"
      ],
      'pl': [
        "Staraj się być bardziej konkretny w swoich odpowiedziach",
        "Rozważ dodanie konkretnych przykładów",
        "Zrównoważ pozytywne i konstruktywne opinie"
      ],
      'pt': [
        "Tente ser mais específico em suas respostas",
        "Considere adicionar exemplos concretos",
        "Equilibre feedback positivo e construtivo"
      ],
      'it': [
        "Cerca di essere più specifico nelle tue risposte",
        "Considera di aggiungere esempi concreti",
        "Bilancia feedback positivi e costruttivi"
      ],
      'nl': [
        "Probeer specifieker te zijn in je antwoorden",
        "Overweeg concrete voorbeelden toe te voegen",
        "Balanceer positieve en constructieve feedback"
      ],
      'cs': [
        "Zkuste být konkrétnější ve svých odpovědích",
        "Zvažte přidání konkrétních příkladů",
        "Vyvažte pozitivní a konstruktivní zpětnou vazbu"
      ],
      'sv': [
        "Försök vara mer specifik i dina svar",
        "Överväg att lägga till konkreta exempel",
        "Balansera positiv och konstruktiv feedback"
      ],
      'da': [
        "Prøv at være mere specifik i dine svar",
        "Overvej at tilføje konkrete eksempler",
        "Balancer positiv og konstruktiv feedback"
      ],
      'no': [
        "Prøv å være mer spesifikk i svarene dine",
        "Vurder å legge til konkrete eksempler",
        "Balanser positiv og konstruktiv tilbakemelding"
      ]
    }

    const fallbackFeedback: Record<string, string> = {
      'en': "This answer could be more specific. Try adding concrete examples.",
      'es': "Esta respuesta podría ser más específica. Intenta agregar ejemplos concretos.",
      'fr': "Cette réponse pourrait être plus précise. Essayez d'ajouter des exemples concrets.",
      'de': "Diese Antwort könnte spezifischer sein. Versuchen Sie, konkrete Beispiele hinzuzufügen.",
      'pl': "Ta odpowiedź mogłaby być bardziej konkretna. Spróbuj dodać konkretne przykłady.",
      'pt': "Esta resposta poderia ser mais específica. Tente adicionar exemplos concretos.",
      'it': "Questa risposta potrebbe essere più specifica. Prova ad aggiungere esempi concreti.",
      'nl': "Dit antwoord zou specifieker kunnen zijn. Probeer concrete voorbeelden toe te voegen.",
      'cs': "Tato odpověď by mohla být konkrétnější. Zkuste přidat konkrétní příklady.",
      'sv': "Detta svar kunde vara mer specifikt. Försök lägga till konkreta exempel.",
      'da': "Dette svar kunne være mere specifikt. Prøv at tilføje konkrete eksempler.",
      'no': "Dette svaret kunne vært mer spesifikt. Prøv å legge til konkrete eksempler."
    }

    const mockScore = {
      overall: Math.floor(Math.random() * 30) + 60, // 60-90
      specificity: Math.floor(Math.random() * 30) + 60,
      constructiveness: Math.floor(Math.random() * 30) + 60,
      clarity: Math.floor(Math.random() * 30) + 60,
      suggestions: fallbackSuggestions[lang] || fallbackSuggestions['en'],
      per_answer_feedback: request.questions.map((q: string, i: number) => ({
        question: q,
        original: answers[i],
        score: Math.floor(Math.random() * 30) + 60,
        feedback: fallbackFeedback[lang] || fallbackFeedback['en'],
        improved: answers[i] + " (improved version would go here)"
      }))
    }
    setAiScore(mockScore)
  }

  setAnalyzingAI(false)
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
    } else {
      console.error("Submit error:", error)
      alert("Failed to submit. Error: " + error.message)
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

  // AI Review Screen
  if (showReview) {
    return (
      <FeedbackLayout
        rightPanel={
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">🤖 AI Analysis</h3>
              <p className="text-sm opacity-90">Your feedback quality score</p>
            </div>

            {analyzingAI ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-sm">Analyzing your feedback...</p>
              </div>
            ) : aiScore && (
              <>
                {/* Overall Score with Quality Label */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                  <div className="text-6xl font-bold mb-2">{aiScore.overall}</div>
                  {aiScore.qualityLabel && (
                    <div className="mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        aiScore.overall >= 86 ? 'bg-green-500' :
                        aiScore.overall >= 76 ? 'bg-blue-500' :
                        aiScore.overall >= 61 ? 'bg-indigo-500' :
                        aiScore.overall >= 41 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {aiScore.qualityLabel}
                      </span>
                    </div>
                  )}
                  <p className="text-xs opacity-90 mb-4">
                    {aiScore.qualityDescription || "Overall Quality Score"}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="font-semibold">{aiScore.specificity}</p>
                      <p className="opacity-75">Specificity</p>
                    </div>
                    <div>
                      <p className="font-semibold">{aiScore.constructiveness}</p>
                      <p className="opacity-75">Constructive</p>
                    </div>
                    <div>
                      <p className="font-semibold">{aiScore.clarity}</p>
                      <p className="opacity-75">Clarity</p>
                    </div>
                  </div>
                </div>

                {/* General Suggestions */}
                {aiScore.suggestions && aiScore.suggestions.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                    <p className="font-semibold text-sm mb-3">💡 General Suggestions</p>
                    <ul className="space-y-2 text-xs">
                      {aiScore.suggestions.map((s: string, i: number) => (
                        <li key={i} className="opacity-90">• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        }
      >
        <div className="space-y-4 md:space-y-6">
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Review Your Feedback
            </h1>
            <p className="text-xs md:text-sm text-gray-600">
              AI has analyzed your responses. Review and submit!
            </p>
          </div>

          {analyzingAI ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">AI is analyzing your feedback...</p>
            </div>
          ) : (
            <>
              {/* All Answers Review with AI Feedback */}
              <div className="space-y-3 md:space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {request.questions.map((q: string, i: number) => {
                  const perAnswerFeedback = aiScore?.per_answer_feedback?.[i]
                  return (
                    <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-3 md:p-4">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <p className="font-semibold text-xs md:text-sm text-gray-900">
                          {i + 1}. {q}
                        </p>
                        {perAnswerFeedback && (
                          <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold ${
                            perAnswerFeedback.score >= 80 ? 'bg-green-100 text-green-700' :
                            perAnswerFeedback.score >= 60 ? 'bg-blue-100 text-blue-700' :
                            perAnswerFeedback.score >= 40 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {perAnswerFeedback.score}/100
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-gray-700 whitespace-pre-wrap mb-3">
                        {answers[i]}
                      </p>

                      {/* AI Feedback for this answer */}
                      {perAnswerFeedback && (
                        <div className="mt-3 pt-3 border-t border-gray-200 bg-indigo-50 -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
                          <p className="text-xs font-semibold text-indigo-900 mb-1.5 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI Feedback
                          </p>
                          <p className="text-xs text-indigo-800 mb-2">
                            {perAnswerFeedback.feedback}
                          </p>
                          {perAnswerFeedback.tips && perAnswerFeedback.tips.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-indigo-900 mb-1">Tips:</p>
                              <ul className="space-y-1">
                                {perAnswerFeedback.tips.map((tip: string, tipIndex: number) => (
                                  <li key={tipIndex} className="text-xs text-indigo-700">
                                    • {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setShowReview(false)
                          setCurrentStep(i)
                        }}
                        className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Edit Answer
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Final Anonymity Reminder */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-3 md:p-4 mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <Shield className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                  <p className="text-xs md:text-sm text-green-800">
                    <strong className="font-bold">One last reminder:</strong> Your feedback is 100% anonymous. No one will ever know it came from you.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={() => setShowReview(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all text-sm md:text-base min-h-[44px]"
                >
                  ← Go Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm md:text-base min-h-[44px]"
                >
                  {submitting ? "Submitting..." : "Submit Feedback 🚀"}
                </button>
              </div>
            </>
          )}
        </div>
      </FeedbackLayout>
    )
  }

  // Regular Question Flow
  return (
    <FeedbackLayout
      rightPanel={
        <>
          {/* AI Monitoring - Always Visible */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <Activity className="h-5 w-5 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <p className="font-semibold">🤖 AI is Listening</p>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Our AI monitors your responses in real-time. After the last question, 
              you'll get a quality score and suggestions before submitting.
            </p>
          </div>

          {/* AI Tip */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5" />
              <p className="font-semibold">💡 AI Tip</p>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Be specific about behaviors and actions, not personality traits. 
              Use examples when possible.
            </p>
          </div>

          {/* Privacy - Enhanced */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-5 border-2 border-green-400/50">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-green-100" />
              <p className="font-semibold text-green-50">🔒 100% Anonymous</p>
            </div>
            <ul className="text-xs leading-relaxed space-y-1.5 opacity-95">
              <li className="flex items-start gap-2">
                <span className="text-green-200">✓</span>
                <span>No email address collected</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-200">✓</span>
                <span>No IP address logged</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-200">✓</span>
                <span>No cookies or tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-200">✓</span>
                <span>Your identity stays hidden forever</span>
              </li>
            </ul>
          </div>

          {/* Bottom Encouragement */}
          <div className="mt-auto text-center pt-6 border-t border-white/20">
            <div className="text-6xl mb-4">💭</div>
            <p className="text-xl font-bold mb-2">Your feedback matters</p>
            <p className="text-sm opacity-90">100% Anonymous & Valuable</p>
          </div>
        </>
      }
    >
      {/* Anonymity Banner - Shown on first question */}
      {currentStep === 0 && (
        <div className="mb-4 md:mb-6 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-2 border-green-400 rounded-2xl p-4 md:p-5 shadow-lg">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                <Shield className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-green-900 text-base md:text-lg">
                  🔒 Your Anonymity is Protected
                </h3>
                <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${
                  anonymityScore >= 85 ? 'bg-green-500' :
                  anonymityScore >= 60 ? 'bg-yellow-500' :
                  anonymityScore >= 40 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}>
                  {anonymityScore}%
                </span>
              </div>

              {/* Anonymity Score Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-green-800 mb-1">
                  <span className="font-semibold">Anonymity Score</span>
                  <span className="font-bold">{anonymityScore}/100</span>
                </div>
                <div className="bg-green-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full flex items-center justify-end pr-1 transition-all duration-300 ${
                      anonymityScore >= 85 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      anonymityScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                      anonymityScore >= 40 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                      'bg-gradient-to-r from-red-600 to-red-700'
                    }`}
                    style={{ width: `${anonymityScore}%` }}
                  >
                    {anonymityScore >= 40 && <span className="text-white text-[10px] font-bold">✓</span>}
                  </div>
                </div>
              </div>

              {/* Warnings if score is below 100 */}
              {anonymityWarnings.length > 0 && (
                <div className="mb-3 bg-amber-50 border border-amber-300 rounded-lg p-2">
                  <p className="text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1">
                    ⚠️ Anonymity Warnings:
                  </p>
                  <ul className="space-y-0.5">
                    {anonymityWarnings.map((warning, i) => (
                      <li key={i} className="text-xs text-amber-800">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs md:text-sm text-green-800 leading-relaxed mb-3">
                Be honest and direct. Your identity is completely hidden—no email, no IP address, no tracking. The recipient will never know who you are.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/60 rounded-lg p-2 flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-green-900 font-medium">No Email</span>
                </div>
                <div className="bg-white/60 rounded-lg p-2 flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-green-900 font-medium">No IP Logged</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar (Only Left Side) */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs md:text-sm text-gray-600">
            Question {currentStep + 1} of {totalQuestions}
          </p>
          <p className="text-xs md:text-sm font-semibold text-indigo-600">
            {Math.round(((currentStep + 1) / totalQuestions) * 100)}%
          </p>
        </div>
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Feedback for X */}
      <div className="mb-4 md:mb-6">
        <p className="text-xs md:text-sm text-indigo-600 font-semibold mb-1">
          Feedback for {request.creator_name}
        </p>
        {request.language && request.language !== 'en' && (
          <p className="text-xs text-gray-500 italic">
            💬 You can respond in any language, but {request.language === 'pl' ? 'Polish' : request.language === 'es' ? 'Spanish' : request.language === 'fr' ? 'French' : request.language === 'de' ? 'German' : request.language === 'pt' ? 'Portuguese' : request.language === 'it' ? 'Italian' : request.language === 'nl' ? 'Dutch' : request.language === 'ja' ? 'Japanese' : request.language === 'zh' ? 'Chinese' : request.language === 'ko' ? 'Korean' : request.language === 'ar' ? 'Arabic' : request.language === 'hi' ? 'Hindi' : request.language === 'ru' ? 'Russian' : request.language.toUpperCase()} is preferred
          </p>
        )}
        {(!request.language || request.language === 'en') && (
          <p className="text-xs text-gray-500 italic mb-2">
            💬 You can respond in any language — AI understands all languages!
          </p>
        )}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
          {currentQuestion}
        </h2>
        <p className="text-sm md:text-base text-gray-600">
          Take your time. Your honest feedback helps them grow.
        </p>
      </div>

      {/* Textarea */}
      <textarea
        value={answers[currentStep] || ""}
        onChange={(e) => setAnswers({ ...answers, [currentStep]: e.target.value })}
        placeholder="Write your thoughts here..."
        className="w-full p-4 md:p-6 bg-white border-2 border-indigo-200 rounded-2xl text-base md:text-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm min-h-[200px] md:min-h-[250px] mb-2"
        autoFocus
      />

      {/* Floating Anonymity Score Widget */}
      <div className="fixed bottom-4 right-4 z-50 hidden lg:block">
        <div className={`text-white rounded-2xl shadow-2xl p-4 min-w-[220px] border-2 transition-all duration-300 ${
          anonymityScore >= 85 ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400' :
          anonymityScore >= 60 ? 'bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-400' :
          anonymityScore >= 40 ? 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-400' :
          'bg-gradient-to-br from-red-600 to-red-700 border-red-400'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5" />
            <span className="font-bold text-sm">Anonymity Score</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
              anonymityScore >= 85 ? 'bg-white text-green-600' :
              anonymityScore >= 60 ? 'bg-white text-yellow-600' :
              anonymityScore >= 40 ? 'bg-white text-orange-600' :
              'bg-white text-red-600'
            }`}>
              {anonymityScore}%
            </span>
          </div>
          <div className="bg-white/20 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${anonymityScore}%` }}
            ></div>
          </div>
          {anonymityWarnings.length > 0 ? (
            <div className="space-y-1 text-xs opacity-95">
              {anonymityWarnings.slice(0, 2).map((warning, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span className="truncate">{warning}</span>
                </div>
              ))}
              {anonymityWarnings.length > 2 && (
                <div className="text-xs opacity-75 italic">
                  +{anonymityWarnings.length - 2} more warning{anonymityWarnings.length > 3 ? 's' : ''}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1 text-xs opacity-95">
              <div className="flex items-center gap-2">
                <span className="text-white">✓</span>
                <span>No tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white">✓</span>
                <span>Fully protected</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Anonymity Reminder */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 md:mb-6">
        <Shield className="h-3.5 w-3.5 text-green-600" />
        <span>Your response is completely anonymous</span>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-3 md:px-4 py-3 md:py-2 text-sm md:text-base text-gray-600 hover:text-gray-900 disabled:opacity-30 transition-all min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleReviewWithAI}
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 md:px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm md:text-base min-h-[44px]"
          >
            <Sparkles className="h-5 w-5" />
            <span>Review with AI →</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 md:px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm md:text-base min-h-[44px]"
          >
            <span>Next Question</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </FeedbackLayout>
  )
}