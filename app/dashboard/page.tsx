"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, MessageSquare, Plus, LogOut, User } from "lucide-react"
import { toast } from "sonner"

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
  const [requests, setRequests] = useState<FeedbackRequest[]>([])
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)

  console.log('🔵 Dashboard mounted')
  console.log('🔵 User:', user)
  console.log('🔵 Loading:', loading)

  // Show linked success message
  const linkedCount = searchParams.get('linked')
  
  useEffect(() => {
    if (linkedCount) {
      toast.success(`Found ${linkedCount} previous request(s)! Added to your dashboard.`)
      // Clear the URL parameter
      router.replace('/dashboard')
    }
  }, [linkedCount, router])

  useEffect(() => {
    console.log('🟢 Dashboard page rendered!')
  })

  useEffect(() => {
    async function fetchRequests() {
      if (!user || hasFetched.current) {
        return
      }

      hasFetched.current = true
      console.log('🔍 Starting fetch for:', user.email)
      setLoading(true)

      try {
        const { data, error } = await supabase
          .from('feedback_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        console.log('📊 Query result:', { data: data?.length, error })

        if (error) {
          console.error('❌ Supabase error:', error)
          setRequests([])
          setLoading(false)
          return
        }

        const requestsWithCount = (data || []).map(req => ({
          ...req,
          response_count: 0
        }))

        console.log('✅ Setting requests:', requestsWithCount.length)
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-indigo-900">VoiceClara</h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/create">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Create Request
                </Button>
              </Link>
              
              {/* User Menu */}
              <div className="relative group">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      My Requests
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-900 mb-2">
            My Dashboard
          </h2>
          <p className="text-gray-600">
            Welcome back, {user.user_metadata?.full_name || 'there'}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.reduce((sum, req) => sum + (req.response_count || 0), 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-indigo-900 font-medium mb-1">Quick Action</p>
                <Link href="/create">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 w-full">
                    Create New →
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Requests List */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Your Feedback Requests
            </h3>
            <Link href="/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                + New Request
              </Button>
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No requests yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first feedback request to get started!
              </p>
              <Link href="/create">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Create Your First Request
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {request.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Created {new Date(request.created_at).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span className="text-gray-600">
                          📊 {request.response_count || 0} responses
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/feedback/${request.share_token}`}>
                        <Button variant="outline" size="sm">
                          Share Link
                        </Button>
                      </Link>
                      <Link href={`/results/${request.results_token}`}>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          View Results
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </Card>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}