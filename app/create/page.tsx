"use client"  // ← WAŻNE! Mówi Next.js że to client component

import { useState } from "react"  // ← NOWE!
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"


export default function CreatePage() {
  // STATE - pamięta wartości z formularza
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [title, setTitle] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")  // ← link po wygenerowaniu
  const [isGenerating, setIsGenerating] = useState(false)

  // FUNCTION - generuje unikalny link
const handleGenerate = () => {
  setIsGenerating(true)  // ← Start loading
  
  // Simulate API call (będzie prawdziwe później)
  setTimeout(() => {
    const uniqueId = Math.random().toString(36).substring(2, 9)
    const link = `${window.location.origin}/feedback/${uniqueId}`
    setGeneratedLink(link)
    setIsGenerating(false)  // ← Stop loading
  }, 1000)  // 1 second delay
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      
      {/* Header with back button */}
      <div className="max-w-3xl mx-auto pt-8 pb-4">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            ← Back to home
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-2xl">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              Create Feedback Request
            </h1>
            <p className="text-gray-600">
              Get honest feedback from your team in 3 simple steps
            </p>
          </div>

          {/* Form - TYLKO JAK NIE MA LINKU */}
          {!generatedLink ? (
            <div className="space-y-6">
              
              {/* Step 1 - NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1. Your name (optional)
                </label>
                <Input 
                  placeholder="e.g. John Doe" 
                  className="max-w-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}  // ← ZAPISZ w state
                />
                <p className="text-sm text-gray-500 mt-1">
                  This helps people know who's asking for feedback
                </p>
              </div>

              {/* Step 2 - EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  2. Your email (optional)
                </label>
                <Input 
                  type="email"
                  placeholder="e.g. john@company.com" 
                  className="max-w-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  // ← ZAPISZ w state
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll send you a link to view responses
                </p>
              </div>

              {/* Step 3 - TITLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  3. What feedback do you need? *
                </label>
                <Input 
                  placeholder="e.g. Feedback on my presentation skills" 
                  className="max-w-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}  // ← ZAPISZ w state
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be the title of your feedback request
                </p>
              </div>

              {/* Questions preview */}
              <div className="pt-4 border-t">
                <h3 className="font-medium text-gray-900 mb-3">
                  Default questions (you can customize later):
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• What am I doing well?</li>
                  <li>• What could I improve?</li>
                  <li>• What's my biggest blind spot?</li>
                  <li>• What should I start/stop/continue?</li>
                  <li>• Any other thoughts?</li>
                </ul>
              </div>

              {/* CTA - KLIKNIĘCIE GENERUJE LINK */}
              <div className="pt-6">
                <Button 
  size="lg" 
  className="w-full bg-indigo-600 hover:bg-indigo-700"
  onClick={handleGenerate}
  disabled={!title || isGenerating}  // ← Disabled podczas loading
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
            // SUCCESS STATE - POKAZUJE LINK!
            <div className="space-y-6">
              
              {/* Success message */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-indigo-900 mb-2">
                  Your link is ready!
                </h2>
                <p className="text-gray-600">
                  Share this link with your team to collect feedback
                </p>
              </div>

              {/* Generated link */}
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
                      alert("Link copied to clipboard! 📋")
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              {/* Request details */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-medium text-indigo-900 mb-2">
                  Request details:
                </h3>
                <ul className="space-y-1 text-sm text-indigo-800">
                  {name && <li>• From: {name}</li>}
                  {email && <li>• Email: {email}</li>}
                  <li>• Title: {title}</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setGeneratedLink("")}  // ← Reset = nowy request
                >
                  Create Another Request
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="default" className="w-full bg-indigo-600">
                    Back to Home
                  </Button>
                </Link>
              </div>

            </div>
          )}

          {/* Footer note */}
          <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-900">
              🛡️ <strong>100% anonymous:</strong> Responses are fully anonymous. 
              We don't track IPs or any identifying information.
            </p>
          </div>

        </Card>
      </div>

    </div>
  );
}