"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/lib/i18n-navigation"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import Navbar from "@/app/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Shield, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [accountType, setAccountType] = useState("")
  const [updating, setUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }

    if (user) {
      setFullName(user.user_metadata?.full_name || "")
      setEmail(user.email || "")
      setAccountType(user.user_metadata?.account_type || "individual")
    }
  }, [user, authLoading, router])

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    setUpdating(true)

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        account_type: accountType
      }
    })

    if (error) {
      toast.error("Failed to update profile: " + error.message)
    } else {
      toast.success("Profile updated successfully! ✨")
    }

    setUpdating(false)
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)

    try {
      // Delete all user's feedback requests
      const { error: deleteRequestsError } = await supabase
        .from('feedback_requests')
        .delete()
        .eq('user_id', user?.id)

      if (deleteRequestsError) {
        toast.error("Failed to delete data: " + deleteRequestsError.message)
        setDeleting(false)
        return
      }

      // Note: Supabase doesn't allow direct user deletion from client
      // In production, you'd need a server-side API endpoint with service role
      toast.success("Account data deleted. Please contact support to complete account deletion.")

      setTimeout(() => {
        signOut()
      }, 2000)

    } catch (err) {
      toast.error("Failed to delete account")
      setDeleting(false)
    }
  }

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </Card>
        </div>
      </>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Information Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="space-y-5">
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
                  className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:placeholder-transparent transition-all"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="flex-1 px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              {/* Account Type (Read-only for now) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Account Type
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={accountType === "individual" ? "Individual" : "Business"}
                    disabled
                    className="flex-1 px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Update Button */}
              <Button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {updating ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </Card>

          {/* Danger Zone Card */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. This will permanently delete all your feedback requests and responses.
            </p>

            {!showDeleteConfirm ? (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            ) : (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-900 mb-3">
                  Are you absolutely sure? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {deleting ? "Deleting..." : "Yes, Delete My Account"}
                  </Button>
                </div>
              </div>
            )}
          </Card>

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>🤖 Powered by AI</span>
                <span className="hidden sm:inline">•</span>
                <span>🔒 100% Anonymous</span>
              </div>
              <div>
                © 2025 <a href="/" className="text-indigo-600 hover:underline font-semibold">VoiceClara</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
