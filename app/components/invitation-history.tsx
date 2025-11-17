"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Mail, CheckCircle, Clock, UserCheck } from 'lucide-react'

interface EmailInvitation {
  id: string
  recipient_email: string
  recipient_name: string | null
  status: 'sent' | 'opened' | 'responded'
  sent_at: string
  opened_at: string | null
}

interface InvitationHistoryProps {
  feedbackRequestId: string
}

export default function InvitationHistory({ feedbackRequestId }: InvitationHistoryProps) {
  const [invitations, setInvitations] = useState<EmailInvitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvitations() {
      try {
        const { data, error } = await supabase
          .from('email_invitations')
          .select('*')
          .eq('feedback_request_id', feedbackRequestId)
          .order('sent_at', { ascending: false })

        if (error) {
          console.error('Failed to fetch invitations:', error?.message || 'Unknown error')
          setInvitations([])
        } else {
          setInvitations(data || [])
        }
      } catch (err) {
        console.error('Error loading invitations:', err)
        setInvitations([])
      } finally {
        setLoading(false)
      }
    }

    fetchInvitations()
  }, [feedbackRequestId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'responded':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="h-3 w-3" />
            Responded
          </span>
        )
      case 'opened':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            <UserCheck className="h-3 w-3" />
            Opened
          </span>
        )
      case 'sent':
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            Sent
          </span>
        )
    }
  }

  const getStatusStats = () => {
    const total = invitations.length
    const responded = invitations.filter(i => i.status === 'responded').length
    const opened = invitations.filter(i => i.status === 'opened').length
    const sent = invitations.filter(i => i.status === 'sent').length

    return { total, responded, opened, sent }
  }

  if (loading) {
    return (
      <Card className="p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">Invitation History</h3>
        </div>
        <div className="text-sm text-gray-500">Loading invitations...</div>
      </Card>
    )
  }

  if (invitations.length === 0) {
    return (
      <Card className="p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">Invitation History</h3>
        </div>
        <div className="text-sm text-gray-500 text-center py-4">
          No invitations sent yet. Use the "Send Invitations" button above to invite people to provide feedback.
        </div>
      </Card>
    )
  }

  const stats = getStatusStats()

  return (
    <Card className="p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-gray-900">
            Invitation History ({invitations.length})
          </h3>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-50 rounded-lg p-2 text-center border border-green-200">
          <div className="text-lg font-bold text-green-700">{stats.responded}</div>
          <div className="text-xs text-green-600">Responded</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
          <div className="text-lg font-bold text-blue-700">{stats.opened}</div>
          <div className="text-xs text-blue-600">Opened</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-2 text-center border border-amber-200">
          <div className="text-lg font-bold text-amber-700">{stats.sent}</div>
          <div className="text-xs text-amber-600">Sent</div>
        </div>
      </div>

      {/* Invitations List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {invitation.recipient_name || invitation.recipient_email}
                </span>
                {getStatusBadge(invitation.status)}
              </div>
              {invitation.recipient_name && (
                <div className="text-xs text-gray-500 truncate">
                  {invitation.recipient_email}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                Sent {new Date(invitation.sent_at).toLocaleDateString()} at{' '}
                {new Date(invitation.sent_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
