"use client"

import Link from "next/link"
import { Check, Heart, Home, Share2, Sparkles } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Thank You! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Your feedback has been submitted successfully
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="space-y-6">
            {/* What Happens Next */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                What happens next?
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Your feedback is delivered</p>
                    <p className="text-sm text-gray-600">The recipient receives your exact words - nothing is changed without your permission</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Recipient collects more responses</p>
                    <p className="text-sm text-gray-600">After 3+ responses, they can request AI analysis for insights</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">AI helps find patterns</p>
                    <p className="text-sm text-gray-600">AI generates themes and insights (optional - recipient's choice)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Assurance */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-green-900 mb-1">
                    🔒 Your anonymity is protected
                  </p>
                  <p className="text-sm text-green-800">
                    No tracking, no IP logging, no cookies. Your identity is completely safe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="https://www.voiceclara.com/">
            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Home className="h-5 w-5" />
              Go to Homepage
            </button>
          </Link>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (navigator.share) {
                navigator.share({
                  title: 'VoiceClara - Anonymous Feedback',
                  text: 'Give honest, anonymous feedback with VoiceClara',
                  url: 'https://voiceclara.com'
                })
              } else {
                alert('Share: https://voiceclara.com')
              }
            }}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 rounded-xl transition-all"
          >
            <Share2 className="h-5 w-5" />
            Share VoiceClara
          </a>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-2">
            Made with <Heart className="inline h-4 w-4 text-red-500" /> by VoiceClara
          </p>
          <p className="text-xs text-gray-500">
            Helping teams grow through honest, anonymous feedback
          </p>
        </div>
      </div>
    </div>
  )
}
