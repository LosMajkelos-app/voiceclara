"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { FeedbackLayout } from "@/components/feedback-layout"
import { Sparkles, Shield, TrendingUp, ArrowLeft, Building2, User as UserIcon } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [accountType, setAccountType] = useState<"individual" | "business">("individual")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      alert("Please fill in all fields")
      return
    }

    if (accountType === "business") {
      alert("Business accounts coming soon! Please use individual account for now.")
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          account_type: accountType
        }
      }
    })

    if (error) {
      alert("Sign up failed: " + error.message)
      setLoading(false)
      return
    }

    alert("Check your email to confirm your account!")
    router.push('/auth/login')
  }

  return (
    <FeedbackLayout
      rightPanel={
        <>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-3">Join VoiceClara</h3>
            <p className="text-sm opacity-90">Start getting honest feedback today</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <p className="font-semibold">AI-Powered Insights</p>
              </div>
              <p className="text-sm opacity-90">
                Automatic sentiment analysis and theme detection
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <p className="font-semibold">Personal Dashboard</p>
              </div>
              <p className="text-sm opacity-90">
                Track all requests and responses in one place
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5" />
                <p className="font-semibold">100% Anonymous</p>
              </div>
              <p className="text-sm opacity-90">
                Respondents stay completely anonymous
              </p>
            </div>
          </div>

          <div className="mt-auto text-center pt-6 border-t border-white/20">
            <p className="text-sm opacity-90">Free forever • No credit card</p>
          </div>
        </>
      }
    >
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Homepage
      </Link>

      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Get started with VoiceClara today
          </p>
        </div>

        <div className="space-y-5">
          {/* Account Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAccountType("individual")}
                className={`p-4 border-2 rounded-lg transition-all ${
                  accountType === "individual"
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <UserIcon className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                <p className="font-semibold text-sm">Individual</p>
                <p className="text-xs text-gray-500 mt-1">Personal feedback</p>
              </button>

              <button
                onClick={() => setAccountType("business")}
                disabled
                className="p-4 border-2 rounded-lg border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
              >
                <Building2 className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="font-semibold text-sm text-gray-400">Business</p>
                <p className="text-xs text-gray-400 mt-1">Coming soon</p>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </FeedbackLayout>
  )
}