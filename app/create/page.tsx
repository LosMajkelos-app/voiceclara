"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { Info, Mail, Save } from "lucide-react"

export default function CreatePage() {
  const { user } = useAuth()
  
  const [name, setName] = useState(user?.user_metadata?.full_name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [title, setTitle] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [resultsLink, setResultsLink] = useState("")
  const [resultsToken, setResultsToken] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    try {
      const shareToken = Math.random().toString(36).substring(2, 15)
      const resultsTokenGenerated = Math.random().toString(36).substring(2, 15)
      
      const { data, error } = await supabase
        .from('feedback_requests')
        .insert({
          user_id: user?.id || null,
          creator_name: name || null,
          creator_email: user?.email || null,
          guest_email: user ? null : (email || null),
          title: title,
          share_token: shareToken,
          results_token: resultsTokenGenerated
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error:', error)
        toast.error(`Error: ${error.message}`)
        setIsGenerating(false)
        return
      }
      
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const feedbackLink = `${origin}/feedback/${data.share_token}`
      const resultsLinkGenerated = `${origin}/results/${data.results_token}`
      
      setGeneratedLink(feedbackLink)
      setResultsLink(resultsLinkGenerated)
      setResultsToken(data.results_token)
      
      toast.success("Request created!")
      
      // Show auth prompt if not logged in
      if (!user) {
        setShowAuthPrompt(true)
      }
      
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong.')
    } finally {
      setIsGenerating(false)
    }
  }

  const sendResultsToEmail = async () => {
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    // TODO: Implement email sending (Resend/SendGrid)
    toast.success(`Results link will be sent to ${email}`)
    
    // For now, just copy to clipboard
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(resultsLink)
      toast.info("Results link copied! Check your email soon.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      
      <div className="max-w-3xl mx-auto pt-8 pb-4">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            ← Back to home
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-2xl">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              Create Feedback Request
            </h1>
            <p className="text-gray-600">
              {user 
                ? "Get honest feedback from your team"
                : "Create your feedback request - no account needed!"
              }
            </p>
          </div>

          {/* Auth Prompt (for non-logged users) */}
          {!user && !generatedLink && (
            <Card className="p-4 mb-6 bg-indigo-50 border-indigo-200">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-indigo-900 mb-2">
                    <strong>💡 Tip:</strong> Sign in to save your requests and track responses over time!
                  </p>
                  <Link href="/auth/login?next=/create">
                    <Button size="sm" variant="outline" className="mr-2">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup?next=/create">
                    <Button size="sm" variant="default" className="bg-indigo-600">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {!generatedLink ? (
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Your name (optional)
                </label>
                <Input 
                  placeholder="e.g. John Doe" 
                  className="max-w-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!!user}
                />
                <p className="text-sm text-gray-500 mt-1">
                  This helps people know who&apos;s asking for feedback
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Your email {!user && "(required for results link)"}
                </label>
                <Input 
                  type="email"
                  placeholder="e.g. john@company.com" 
                  className="max-w-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!user}
                  required={!user}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {user 
                    ? "Using your account email"
                    : "We'll send you a link to view responses"
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3. What feedback do you need? *
                </label>
                <Input 
                  placeholder="e.g. Feedback on my presentation skills" 
                  className="max-w-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be the title of your feedback request
                </p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium text-gray-900 mb-3">
                  Default questions (you can customize later):
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• What am I doing well?</li>
                  <li>• What could I improve?</li>
                  <li>• What&apos;s my biggest blind spot?</li>
                  <li>• What should I start/stop/continue?</li>
                  <li>• Any other thoughts?</li>
                </ul>
              </div>

              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleGenerate}
                  disabled={!title || (!user && !email) || isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Feedback Link →"}
                </Button>
                {!title && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Please add a title to continue
                  </p>
                )}
                {!user && !email && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Please add your email to receive results
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="space-y-6">
              
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-indigo-900 mb-2">
                  Your link is ready!
                </h2>
                <p className="text-gray-600">
                  Share this link with your team to collect feedback
                </p>
              </div>

              {/* Auth Upgrade Prompt */}
              {!user && showAuthPrompt && (
  <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
    <div className="flex gap-4">
      <Save className="h-6 w-6 text-indigo-600 flex-shrink-0" />
      <div className="flex-1">
        <h3 className="font-semibold text-indigo-900 mb-2">
          💾 Save this request to your account?
        </h3>
        <p className="text-sm text-indigo-700 mb-4">
          Sign in or create account to track your feedback requests and never lose them!
        </p>
        <div className="flex gap-2">
          <Link href={`/auth/login?next=/create&email=${encodeURIComponent(email)}`}>
            <Button size="sm" variant="outline">
              Sign In
            </Button>
          </Link>
          <Link href={`/auth/signup?email=${encodeURIComponent(email)}`}>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              Create Account
            </Button>
          </Link>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setShowAuthPrompt(false)}
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  </Card>
)}

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your feedback link:
                </label>
                <div className="flex gap-2">
                  <Input 
                    value={generatedLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink)
                      toast.success("Feedback link copied! 📋")
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              {!user ? (
                /* Guest User - Email results */
                <Card className="p-4 bg-indigo-50 border-indigo-200">
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-indigo-900 mb-2">
                        📧 Get results by email
                      </h3>
                      <p className="text-sm text-indigo-700 mb-3">
                        We&apos;ll send you a private link to view responses
                      </p>
                      <div className="flex gap-2">
                        <Input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="bg-white"
                        />
                        <Button 
                          variant="default"
                          className="bg-indigo-600"
                          onClick={sendResultsToEmail}
                        >
                          Send Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                /* Logged User - Results link */
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <label className="block text-sm font-medium text-indigo-900 mb-2">
                    🔐 Your private results link:
                  </label>
                  <p className="text-sm text-indigo-700 mb-2">
                    Save this link to view responses later
                  </p>
                  <div className="flex gap-2">
                    <Input 
                      value={resultsLink}
                      readOnly
                      className="font-mono text-sm bg-white"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(resultsLink)
                        toast.success("Results link copied! 🔐")
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Request details:
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  {name && <li>• From: {name}</li>}
                  <li>• Email: {email}</li>
                  <li>• Title: {title}</li>
                  <li className="text-xs text-gray-500 mt-2">
                    • Request saved ✓
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setGeneratedLink("")
                    setResultsLink("")
                    setResultsToken("")
                    setShowAuthPrompt(false)
                    setTitle("")
                    if (!user) {
                      setName("")
                      setEmail("")
                    }
                  }}
                >
                  Create Another Request
                </Button>
                {user ? (
                  <Link href="/dashboard" className="flex-1">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/auth/signup?email=${encodeURIComponent(email)}`} className="flex-1">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                      Create Account
                    </Button>
                  </Link>
                )}
              </div>

            </div>
          )}

          <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-900">
              🛡️ <strong>100% anonymous:</strong> Responses are fully anonymous. 
              We don&apos;t track IPs or any identifying information.
            </p>
          </div>

        </Card>
      </div>

    </div>
  );
}