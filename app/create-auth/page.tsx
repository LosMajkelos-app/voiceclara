"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { FeedbackLayout } from "@/components/feedback-layout"
import { Sparkles, Shield, TrendingUp, ArrowLeft, UserPlus, LogIn, Users } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function CreateAuthPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      router.push('/create')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <FeedbackLayout
      rightPanel={
        <>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-3">Why Sign Up?</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <p className="font-semibold">AI Insights</p>
              </div>
              <p className="text-sm opacity-90">
                Get automatic sentiment analysis and theme detection
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <p className="font-semibold">Dashboard</p>
              </div>
              <p className="text-sm opacity-90">
                Track all your requests and responses in one place
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5" />
                <p className="font-semibold">Privacy First</p>
              </div>
              <p className="text-sm opacity-90">
                100% anonymous feedback, no tracking
              </p>
            </div>
          </div>

          <div className="mt-auto text-center pt-6 border-t border-white/20">
            <p className="text-sm opacity-90">Free forever • No credit card</p>
          </div>
        </>
      }
    >
      {/* Back Button */}
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Homepage
      </Link>

      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Feedback Request
          </h1>
          <p className="text-gray-600">
            Sign in to save and track your requests
          </p>
        </div>

        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
          <div className="space-y-4">
            {/* Sign In Button */}
            <Link href="/auth/login">
              <button className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <LogIn className="h-5 w-5" />
                Sign In to Existing Account
              </button>
            </Link>

            {/* Create Account Button */}
            <Link href="/auth/signup">
              <button className="w-full flex items-center justify-center gap-3 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3.5 rounded-xl transition-all">
                <UserPlus className="h-5 w-5" />
                Create New Account
              </button>
            </Link>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue without account</span>
              </div>
            </div>

            {/* Guest Button */}
            <Link href="/create">
              <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-2 border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl transition-all">
                <Users className="h-5 w-5" />
                Continue as Guest
              </button>
            </Link>
          </div>

          {/* Info Banner */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Account Benefits
                </p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>✓ Save and track all your requests</li>
                  <li>✓ Access AI-powered insights</li>
                  <li>✓ View response history</li>
                  <li>✓ Free forever</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Guest users can create requests but won't have access to dashboard features
          </p>
        </Card>
      </div>
    </FeedbackLayout>
  )
}