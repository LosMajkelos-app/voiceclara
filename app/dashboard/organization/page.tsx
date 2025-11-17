"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useOrganization } from '@/lib/organization-context'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Users, Mail, Settings, Building2, UserPlus, Shield, Crown, Eye } from 'lucide-react'
import DashboardSidebar from '@/app/components/dashboard-sidebar'
import Link from 'next/link'

interface Member {
  id: string
  user_id: string
  email: string
  full_name: string | null
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
  created_at: string
}

export default function OrganizationPage() {
  const { user } = useAuth()
  const { currentOrganization, organizations, loading: orgLoading } = useOrganization()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'manager' | 'member' | 'viewer'>('member')
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    if (!orgLoading && currentOrganization) {
      fetchMembers()
    } else if (!orgLoading) {
      setLoading(false)
    }
  }, [currentOrganization, orgLoading])

  async function fetchMembers() {
    if (!currentOrganization) return

    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          created_at,
          users:user_id (
            email,
            raw_user_meta_data
          )
        `)
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Failed to fetch members:', error)
        toast.error('Failed to load team members')
        return
      }

      const formattedMembers = (data || []).map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        email: m.users?.email || 'Unknown',
        full_name: m.users?.raw_user_meta_data?.full_name || null,
        role: m.role,
        created_at: m.created_at,
      }))

      setMembers(formattedMembers)
    } catch (err) {
      console.error('Error loading members:', err)
      toast.error('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()

    if (!currentOrganization || !inviteEmail) return

    setInviting(true)

    try {
      const response = await fetch(`/api/organizations/${currentOrganization.id}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation')
      }

      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
      setInviteRole('member')
    } catch (error: any) {
      console.error('Invite error:', error)
      toast.error(error.message || 'Failed to send invitation')
    } finally {
      setInviting(false)
    }
  }

  async function handleRemoveMember(memberId: string, memberEmail: string) {
    if (!currentOrganization) return

    if (!confirm(`Remove ${memberEmail} from the organization?`)) return

    try {
      const response = await fetch(`/api/organizations/${currentOrganization.id}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove member')
      }

      toast.success(`Removed ${memberEmail}`)
      fetchMembers() // Refresh list
    } catch (error: any) {
      console.error('Remove error:', error)
      toast.error(error.message || 'Failed to remove member')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-purple-600" />
      case 'admin':
        return <Shield className="h-4 w-4 text-indigo-600" />
      case 'manager':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'member':
        return <UserPlus className="h-4 w-4 text-green-600" />
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-700 border-purple-200',
      admin: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      manager: 'bg-blue-100 text-blue-700 border-blue-200',
      member: 'bg-green-100 text-green-700 border-green-200',
      viewer: 'bg-gray-100 text-gray-700 border-gray-200'
    }

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${colors[role as keyof typeof colors] || colors.member}`}>
        {getRoleIcon(role)}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  if (loading || orgLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardSidebar user={user!} onAccountSettingsClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading organization...</p>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentOrganization) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardSidebar user={user!} onAccountSettingsClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Organization</h2>
            <p className="text-gray-600 mb-4">
              You need a Business account with an organization to access this page.
            </p>
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DashboardSidebar user={user!} onAccountSettingsClick={() => {}} />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Settings</h1>
            <p className="text-gray-600">{currentOrganization.name}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invite Member */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-indigo-600" />
                  Invite Team Member
                </h2>

                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="viewer">Viewer - Can only view</option>
                      <option value="member">Member - Can participate</option>
                      <option value="manager">Manager - Can manage team</option>
                      <option value="admin">Admin - Full access</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={inviting || !inviteEmail}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {inviting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </form>
              </Card>

              {/* Team Members List */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Team Members ({members.length})
                </h2>

                <div className="space-y-3">
                  {members.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No team members yet. Invite someone to get started!</p>
                  ) : (
                    members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">
                              {member.full_name || member.email}
                            </p>
                            {getRoleBadge(member.role)}
                          </div>
                          {member.full_name && (
                            <p className="text-sm text-gray-600">{member.email}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Joined {new Date(member.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        {member.role !== 'owner' && member.user_id !== user?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id, member.email)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Organization Info */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Organization
                </h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">{currentOrganization.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Plan</p>
                    <p className="font-semibold text-gray-900 capitalize">{currentOrganization.plan_type || 'Free'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Members</p>
                    <p className="font-semibold text-gray-900">{members.length}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link href="/dashboard/team">
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      View Team Hierarchy
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  Quick Actions
                </h3>

                <div className="space-y-2">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      My Feedback Requests
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Create New Request
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
