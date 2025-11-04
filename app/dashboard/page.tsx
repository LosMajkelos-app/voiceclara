


"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, BarChart3, Clock } from "lucide-react"

interface FeedbackRequest {
  id: string
  title: string
  creator_name: string
  created_at: string
  share_token: string
  results_token: string
  response_count?: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<FeedbackRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔵 Dashboard mounted')
    console.log('🔵 User:', user)
    console.log('🔵 Loading:', loading)
  }, [user, loading])

  // If we get here, we're on dashboard page
  console.log('🟢 Dashboard page rendered!')

  useEffect(() => {
    async function fetchRequests() {
      if (!user) return

      try {
        // Fetch user's requests
        const { data, error } = await supabase
          .from('feedback_requests')
          .select(`
            *,
            responses:responses(count)
          `)
          .eq('creator_email', user.email)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching requests:', error)
          setLoading(false)
          return
        }

        // Add response count
        const requestsWithCount = data?.map(req => ({
          ...req,
          response_count: req.responses?.[0]?.count || 0
        })) || []

        setRequests(requestsWithCount)
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setLoading(false)
      }
    }

    fetchRequests()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-indigo-900">{requests.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-green-900">
                  {requests.reduce((sum, req) => sum + (req.response_count || 0), 0)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Quick Action</p>
                <Link href="/create">
                  <Button variant="link" className="p-0 h-auto text-purple-600 font-bold">
                    Create New →
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Requests List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Feedback Requests
          </h2>
          <Link href="/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        {requests.length === 0 ? (
          <Card className="p-12 text-center bg-white/80 backdrop-blur-sm">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
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
          </Card>
        ) : (
          <div className="grid gap-4">
            {requests.map((request) => (
              <Card key={request.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {request.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                      <span>Created {new Date(request.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <Badge variant="secondary">
                        {request.response_count} {request.response_count === 1 ? 'response' : 'responses'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/results/${request.results_token}`}>
                      <Button variant="outline">
                        View Results
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(`${window.location.origin}/feedback/${request.share_token}`)
                          alert('Feedback link copied!')
                        }
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}