"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useOrganization } from "@/lib/organization-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, MessageSquare, Plus, Trash2, Bell, X, Check, Building2 } from "lucide-react"
import { toast } from "sonner"
import DashboardSidebar from "@/app/components/dashboard-sidebar"
import AccountSettingsModal from "@/app/components/account-settings-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FeedbackRequest {
  id: string
  title: string
  created_at: string
  share_token: string
  results_token: string
  response_count?: number
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const { currentOrganization, organizations, setCurrentOrganization } = useOrganization()
  const [requests, setRequests] = useState<FeedbackRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showConfirmedBanner, setShowConfirmedBanner] = useState(false)
  const hasFetched = useRef(false)

  // Show linked success message
  const linkedCount = searchParams.get('linked')
  const confirmed = searchParams.get('confirmed')

  useEffect(() => {
    if (linkedCount) {
      toast.success(`Found ${linkedCount} previous request(s)! Added to your dashboard.`)
      router.replace('/dashboard')
    }
  }, [linkedCount, router])

  useEffect(() => {
    if (confirmed === 'true') {
      setShowConfirmedBanner(true)
      // Clean URL without reloading
      const url = new URL(window.location.href)
      url.searchParams.delete('confirmed')
      window.history.replaceState({}, '', url.toString())
    }
  }, [confirmed])

  useEffect(() => {
    async function fetchRequests() {
      if (!user) {
        return
      }

      setLoading(true)
      hasFetched.current = true

      try {
        // Simple query - just get user's requests (backward compatible)
        const { data, error } = await supabase
          .from('feedback_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ Supabase error:', error)
          setRequests([])
          setLoading(false)
          return
        }

        // Fetch response counts for each request
        const requestsWithCount = await Promise.all(
          (data || []).map(async (req) => {
            const { count } = await supabase
              .from('responses')
              .select('*', { count: 'exact', head: true })
              .eq('feedback_request_id', req.id)

            return {
              ...req,
              response_count: count || 0
            }
          })
        )

        setRequests(requestsWithCount)
        setLoading(false)

      } catch (err) {
        console.error('❌ Catch error:', err)
        setRequests([])
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchRequests()
    } else {
      setLoading(false)
    }
  }, [user?.id])

  // Auto-link guest requests on dashboard load
  useEffect(() => {
    async function tryLinkGuest() {
      if (!user) return
      
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        
        if (sessionData.session) {
          const linkRes = await fetch('/api/link-guest-requests', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sessionData.session.access_token}`,
              'Content-Type': 'application/json'
            },
          })
          
          const linkData = await linkRes.json()
          
          if (linkData.linked > 0) {
            toast.success(`Found ${linkData.linked} previous request(s)! Refreshing...`)
            setTimeout(() => window.location.reload(), 1000)
          }
        }
      } catch (err) {
        console.log('Could not link:', err)
      }
    }
    
    tryLinkGuest()
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const handleDeleteRequest = async (requestId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(requestId)

    try {
      // Delete all responses first
      const { error: responsesError } = await supabase
        .from('responses')
        .delete()
        .eq('feedback_request_id', requestId)

      if (responsesError) {
        console.error('Error deleting responses:', responsesError)
      }

      // Delete the request
      const { error: requestError } = await supabase
        .from('feedback_requests')
        .delete()
        .eq('id', requestId)
        .eq('user_id', user?.id)

      if (requestError) {
        toast.error("Failed to delete request: " + requestError.message)
      } else {
        toast.success("Request deleted successfully! 🗑️")
        // Remove from local state
        setRequests(requests.filter(req => req.id !== requestId))
      }
    } catch (err) {
      console.error('Delete error:', err)
      toast.error("Failed to delete request")
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading || loading) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
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
      <div className="min-h-screen flex bg-gray-50">
        {/* Unified Sidebar */}
        <DashboardSidebar
          user={user}
          onAccountSettingsClick={() => setShowAccountSettings(true)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!</p>
                  </div>
                  {/* Organization Switcher */}
                  {organizations.length > 1 && (
                    <div className="hidden md:block">
                      <Select
                        value={currentOrganization?.id || ''}
                        onValueChange={(orgId) => {
                          const org = organizations.find(o => o.id === orgId)
                          if (org) setCurrentOrganization(org)
                        }}
                      >
                        <SelectTrigger className="w-48 h-8">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-gray-500" />
                            <SelectValue />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex items-center gap-2"
                    onClick={() => {
                      setShowNotifications(true)
                      toast.info("No new notifications")
                    }}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="text-xs">Notifications</span>
                  </Button>
                  <Link href="/create">
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5">
                      <Plus className="h-4 w-4" />
                      <span className="text-xs">New Request</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto pb-20">
            <div className="px-4 sm:px-6 lg:px-8 py-4">

              {/* Account Confirmed Banner */}
              {showConfirmedBanner && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-green-900 mb-1 text-base">
                        🎉 Welcome to VoiceClara!
                      </h3>
                      <p className="text-sm text-green-800 leading-relaxed">
                        Your account has been confirmed successfully. You can now create feedback requests and start collecting honest, anonymous feedback from your team.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowConfirmedBanner(false)}
                      className="flex-shrink-0 p-1 hover:bg-green-100 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-green-700" />
                    </button>
                  </div>
                </div>
              )}

              {/* Stats Cards - More Compact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <Card className="p-3 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Requests</p>
                      <p className="text-xl font-bold text-gray-900">{requests.length}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-3 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Responses</p>
                      <p className="text-xl font-bold text-gray-900">
                        {requests.reduce((sum, req) => sum + (req.response_count || 0), 0)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Avg per Request</p>
                      <p className="text-xl font-bold text-gray-900">
                        {requests.length > 0
                          ? Math.round(requests.reduce((sum, req) => sum + (req.response_count || 0), 0) / requests.length)
                          : 0}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Requests List - More Compact */}
              <Card className="p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-gray-900">
                    Your Feedback Requests ({requests.length})
                  </h3>
                </div>

                {requests.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-3">🎯</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                      No requests yet
                    </h3>
                    <p className="text-sm text-gray-600">
                      Click "New Request" above to create your first feedback request!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {requests.map((request) => {
                      const responseCount = request.response_count || 0
                      const badgeColor =
                        responseCount === 0 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        responseCount >= 6 ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-green-100 text-green-700 border-green-200'
                      const badgeText =
                        responseCount === 0 ? 'Pending' :
                        responseCount >= 6 ? `${responseCount} responses` :
                        `${responseCount} response${responseCount !== 1 ? 's' : ''}`

                      return (
                      <Card key={request.id} className="p-3 hover:shadow-md transition-shadow border border-gray-200">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {request.title}
                              </h4>
                              <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}>
                                {badgeText}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0 flex-wrap sm:flex-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 md:h-7 px-2 md:px-3 text-xs min-h-[32px]"
                              onClick={() => {
                                const shareLink = `${window.location.origin}/feedback/${request.share_token}`
                                navigator.clipboard.writeText(shareLink)
                                toast.success("Link copied! 📋")
                              }}
                            >
                              <span className="hidden sm:inline">Copy link to share</span>
                              <span className="sm:hidden">Copy</span>
                            </Button>
                            <Link href={`/results/${request.results_token}`}>
                              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-8 md:h-7 px-3 md:px-2 text-xs min-h-[32px]">
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 md:h-7 px-2 text-red-600 hover:bg-red-50 border-red-200 min-h-[32px]"
                              onClick={() => handleDeleteRequest(request.id, request.title)}
                              disabled={deletingId === request.id}
                            >
                              <Trash2 className="h-3.5 w-3.5 md:h-3 md:w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                      )
                    })}
                  </div>
                )}
              </Card>

            </div>
          </main>

          {/* Footer */}
          <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 z-10">
            <div className="px-4 sm:px-6 lg:px-8 lg:pl-60">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  <span>🤖 Powered by AI</span>
                  <span className="hidden sm:inline">•</span>
                  <span>🔒 100% Anonymous</span>
                </div>
                <div className="text-center sm:text-right">
                  <div>© 2025 <a href="/" className="text-indigo-600 hover:underline font-semibold">VoiceClara</a></div>
                  <div className="mt-1">For questions: <a href="mailto:info@voiceclara.com" className="text-indigo-600 hover:underline">info@voiceclara.com</a></div>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </div>

      {/* Account Settings Modal */}
      {showAccountSettings && (
        <AccountSettingsModal
          user={user}
          onClose={() => setShowAccountSettings(false)}
        />
      )}
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </Card>
        </div>
      </>
    }>
      <DashboardContent />
    </Suspense>
  )
}