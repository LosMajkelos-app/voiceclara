"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function CreatePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [resultsLink, setResultsLink] = useState("")  // ← NEW!
  const [resultsToken, setResultsToken] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    try {
      const shareToken = Math.random().toString(36).substring(2, 15)
      const resultsTokenGenerated = Math.random().toString(36).substring(2, 15)
      
      const { data, error } = await supabase
        .from('feedback_requests')
        .insert({
          creator_name: name || null,
          creator_email: email || null,
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
      
      // Build URLs on client side
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const feedbackLink = `${origin}/feedback/${data.share_token}`
      const resultsLinkGenerated = `${origin}/results/${data.results_token}`
      
      setGeneratedLink(feedbackLink)
      setResultsLink(resultsLinkGenerated)  // ← SET THIS!
      setResultsToken(data.results_token)
      
      toast.success("Request created! Share the link below.")
      
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong.')
    } finally {
      setIsGenerating(false)
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
              Get honest feedback from your team in 3 simple steps
            </p>
          </div>

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
                />
                <p className="text-sm text-gray-500 mt-1">
                  This helps people know who&apos;s asking for feedback
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Your email (optional)
                </label>
                <Input 
                  type="email"
                  placeholder="e.g. john@company.com" 
                  className="max-w-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  We&apos;ll send you a link to view responses
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
                  disabled={!title || isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Feedback Link →"}
                </Button>
                {!title && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Please add a title to continue
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

              {/* Feedback link */}
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

              {/* Results link - FIXED! */}
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <label className="block text-sm font-medium text-indigo-900 mb-2">
                  🔐 Your private results link:
                </label>
                <p className="text-sm text-indigo-700 mb-2">
                  Save this link to view responses later. Don&apos;t share this one!
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

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Request details:
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  {name && <li>• From: {name}</li>}
                  {email && <li>• Email: {email}</li>}
                  <li>• Title: {title}</li>
                  <li className="text-xs text-gray-500 mt-2">
                    • Request saved to database ✓
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
                  }}
                >
                  Create Another Request
                </Button>
                <Link href={`/results/${resultsToken}`} className="flex-1">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    View Results →
                  </Button>
                </Link>
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