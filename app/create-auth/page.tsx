"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { FeedbackLayout } from "@/components/feedback-layout"
import { Sparkles, Shield, TrendingUp } from "lucide-react"

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
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Feedback Request
          </h1>
          <p className="text-gray-600">
            Sign in to save and track your requests
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/auth/login">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all">
              Sign In
            </button>
          </Link>

          <Link href="/auth/signup">
            <button className="w-full bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-3 rounded-xl transition-all">
              Create Account
            </button>
          </Link>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or</span>
            </div>
          </div>

          <Link href="/create">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all">
              Continue as Guest
            </button>
          </Link>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Guest users can create requests but won't have a dashboard
        </p>
      </div>
    </FeedbackLayout>
  )
}