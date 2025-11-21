"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { FeedbackLayout } from "@/components/feedback-layout"
import { AlertMessage } from "@/components/ui/alert-message"
import { Sparkles, Shield, TrendingUp, ArrowLeft, Building2, User as UserIcon, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [accountType, setAccountType] = useState<"personal" | "business">("personal")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [error, setError] = useState("")

  // Business account fields
  const [companyName, setCompanyName] = useState("")
  const [taxId, setTaxId] = useState("") // NIP or other tax ID
  const [companyAddress, setCompanyAddress] = useState("")
  const [companyCity, setCompanyCity] = useState("")
  const [companyCountry, setCompanyCountry] = useState("Poland")

  // Ref for scrolling to business fields
  const businessFieldsRef = useRef<HTMLDivElement>(null)

  // Auto-scroll when switching to Business account
  useEffect(() => {
    if (accountType === "business" && businessFieldsRef.current) {
      setTimeout(() => {
        businessFieldsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        })
      }, 100)
    }
  }, [accountType])

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      setError("Please fill in all fields")
      return
    }

    // Additional validation for Business accounts
    if (accountType === "business") {
      if (!companyName || !taxId) {
        setError("Please fill in company name and tax ID (NIP)")
        return
      }
    }

    setLoading(true)
    setError("")

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    // Prepare user metadata
    const userMetadata: any = {
      full_name: fullName,
      account_type: accountType
    }

    // Add business details if Business account
    if (accountType === "business") {
      userMetadata.company_name = companyName
      userMetadata.tax_id = taxId
      userMetadata.company_address = companyAddress
      userMetadata.company_city = companyCity
      userMetadata.company_country = companyCountry
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: userMetadata
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSubmittedEmail(email)
    setEmailSent(true)
    setLoading(false)
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError("")

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    }
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
              <div className="flex gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <p className="font-semibold">AI-Powered Insights</p>
              </div>
              <p className="text-sm opacity-90">
                Automatic sentiment analysis and theme detection
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <p className="font-semibold">Personal Dashboard</p>
              </div>
              <p className="text-sm opacity-90">
                Track all requests and responses in one place
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="flex gap-2 mb-2">
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
      <Link href="/" className="flex gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Homepage
      </Link>

      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Get started with VoiceClara today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <AlertMessage
            type="error"
            title="Sign Up Failed"
            message={error}
            onClose={() => setError("")}
          />
        )}

        {/* Email Sent Success Message */}
        {emailSent && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <Mail className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-900 text-base">
                  ✅ Check your email!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  We sent a confirmation link to <strong>{submittedEmail}</strong>
                </p>
                <p className="text-xs text-green-600 mt-2">
                  💡 Check your spam folder if you don't see it in 2 minutes
                </p>
                <Link
                  href="/auth/login"
                  className="text-xs text-green-700 underline hover:text-green-800 font-semibold mt-2 inline-block"
                >
                  Go to Sign In →
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          {/* Account Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType("personal")}
                className={`p-3 border-2 rounded-lg transition-all ${
                  accountType === "personal"
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <UserIcon className={`h-5 w-5 mx-auto mb-2 ${accountType === "personal" ? 'text-indigo-600' : 'text-gray-600'}`} />
                <p className="font-semibold text-sm">Personal</p>
                <p className="text-xs text-gray-500 mt-1">Individual use</p>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("business")}
                className={`p-3 border-2 rounded-lg transition-all ${
                  accountType === "business"
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                }`}
              >
                <Building2 className={`h-5 w-5 mx-auto mb-2 ${accountType === "business" ? 'text-indigo-600' : 'text-gray-600'}`} />
                <p className="font-semibold text-sm">Business</p>
                <p className="text-xs text-gray-500 mt-1">Company account</p>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {accountType === "business" ? "Contact Person Name" : "Full Name"}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Business Account Fields */}
          {accountType === "business" && (
            <div ref={businessFieldsRef} className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corporation"
                  className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Tax ID (NIP) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tax ID / NIP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Required for invoicing</p>
              </div>

              {/* Company Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Address
                </label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* City and Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={companyCity}
                    onChange={(e) => setCompanyCity(e.target.value)}
                    placeholder="Warsaw"
                    className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country
                  </label>
                  <select
                    value={companyCountry}
                    onChange={(e) => setCompanyCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Poland">Poland</option>
                    <option value="Germany">Germany</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="Italy">Italy</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Austria">Austria</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
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
