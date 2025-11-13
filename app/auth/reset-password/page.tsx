"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { FeedbackLayout } from "@/components/feedback-layout"
import { Lock, ArrowLeft, Check, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if user has a valid recovery session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        setIsValidSession(true)
      } else {
        setIsValidSession(false)
      }
      setChecking(false)
    }

    checkSession()
  }, [])

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      alert("Failed to reset password: " + error.message)
      setLoading(false)
      return
    }

    alert("Password updated successfully! 🎉")
    router.push('/dashboard')
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying...</p>
        </div>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <FeedbackLayout
        rightPanel={
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-3">Invalid Link</h3>
              <p className="text-sm opacity-90">This reset link is not valid</p>
            </div>

            <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-5 border border-red-400/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="font-semibold">Link Expired or Invalid</p>
              </div>
              <p className="text-sm opacity-90">
                Password reset links expire after 1 hour for security
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid or Expired Link
            </h1>
            <p className="text-gray-600 mb-6">
              This password reset link is no longer valid.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Common reasons:</strong>
              </p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• Link has expired (valid for 1 hour)</li>
                <li>• Link was already used</li>
                <li>• New reset link was requested</li>
              </ul>
            </div>
            <Link
              href="/auth/forgot-password"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Request New Reset Link
            </Link>
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
            <h3 className="text-2xl font-bold mb-3">New Password</h3>
            <p className="text-sm opacity-90">Choose a strong password</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5" />
              <p className="font-semibold">Password Requirements</p>
            </div>
            <ul className="text-sm opacity-90 space-y-1 ml-4">
              <li>• At least 6 characters</li>
              <li>• Include numbers and letters</li>
              <li>• Avoid common passwords</li>
            </ul>
          </div>

          <div className="mt-auto text-center pt-6 border-t border-white/20">
            <p className="text-sm opacity-90">Your account will be secure</p>
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
            Set New Password
          </h1>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>

        <div className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-600 mt-1">Passwords don't match</p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Check className="h-3 w-3" /> Passwords match
              </p>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetPassword}
            disabled={loading || !password || !confirmPassword || password !== confirmPassword}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          {/* Security Note */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800">
              <Check className="h-3 w-3 inline mr-1" />
              Your password will be securely encrypted
            </p>
          </div>
        </div>
      </div>
    </FeedbackLayout>
  )
}
