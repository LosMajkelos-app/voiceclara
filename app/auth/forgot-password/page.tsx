"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { FeedbackLayout } from "@/components/feedback-layout"
import { Mail, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email address")
      return
    }

    setLoading(true)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/reset-password`,
    })

    if (error) {
      alert("Failed to send reset email: " + error.message)
      setLoading(false)
      return
    }

    setEmailSent(true)
    setLoading(false)
  }

  if (emailSent) {
    return (
      <FeedbackLayout
        rightPanel={
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-3">Check Your Email</h3>
              <p className="text-sm opacity-90">We've sent you a password reset link</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-400" />
                <p className="font-semibold">Email Sent!</p>
              </div>
              <p className="text-sm opacity-90">
                Check your inbox and spam folder for the password reset link
              </p>
            </div>
          </>
        }
      >
        <Link href="/auth/login" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <div className="max-w-md mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to:<br />
              <strong>{email}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Next steps:</strong>
              </p>
              <ol className="text-sm text-blue-800 space-y-1 ml-4">
                <li>1. Check your email inbox</li>
                <li>2. Click the password reset link</li>
                <li>3. Enter your new password</li>
              </ol>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Try different email
            </button>
          </div>
        </div>
      </FeedbackLayout>
    )
  }

  return (
    <FeedbackLayout
      rightPanel={
        <>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-3">Reset Password</h3>
            <p className="text-sm opacity-90">We'll email you a reset link</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5" />
              <p className="font-semibold">How It Works</p>
            </div>
            <ol className="text-sm opacity-90 space-y-2 ml-4">
              <li>1. Enter your email address</li>
              <li>2. Check your inbox for reset link</li>
              <li>3. Click link and set new password</li>
            </ol>
          </div>

          <div className="mt-auto text-center pt-6 border-t border-white/20">
            <p className="text-sm opacity-90">
              Remember your password?{" "}
              <Link href="/auth/login" className="font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </>
      }
    >
      <Link href="/auth/login" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>

      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </FeedbackLayout>
  )
}
