"use client"

import Link from "next/link"
import { CheckCircle, Home, ArrowRight } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You! 🎉
          </h1>
          <p className="text-gray-600">
            Your feedback has been submitted successfully
          </p>
        </div>

        {/* Message */}
        <div className="bg-indigo-50 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-700 leading-relaxed">
            Your honest input helps people grow and improve. 
            Thank you for taking the time to share your thoughts!
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Go to Homepage
            </button>
          </Link>

          <p className="text-sm text-gray-600">
            Want feedback too?{" "}
            <Link href="/create" className="text-indigo-600 hover:underline font-semibold">
              Create your own request
            </Link>
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Your response was 100% anonymous. No personal data was collected.
          </p>
        </div>

      </div>
    </div>
  )
}