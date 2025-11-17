"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useOrganization } from '@/lib/organization-context'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Users, Plus, Mail, Trash2, Edit, ChevronDown, ChevronRight, Building2, UserCog } from 'lucide-react'
import DashboardSidebar from '@/app/components/dashboard-sidebar'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TeamMember {
  id: string
  user_id: string
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
  manager_id: string | null
  department: string | null
  job_title: string | null
  level: number
  email: string
  full_name: string | null
  subordinates?: TeamMember[]
}

export default function TeamManagementPage() {
  const { user } = useAuth()
  const { currentOrganization, loading: orgLoading } = useOrganization()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [allMembers, setAllMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set())
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Wait for organization context to load
    if (orgLoading) return

    if (currentOrganization) {
      fetchTeamMembers()
    } else {
      // No organization, stop loading
      setLoading(false)
    }
  }, [currentOrganization, orgLoading])

  async function fetchTeamMembers() {
    if (!currentOrganization) return

    try {
      const { data, error } = await supabase
        .from('organization_hierarchy')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('level', { ascending: true })

      if (error) {
        console.error('Failed to fetch team members:', error?.message || 'Unknown error')
        toast.error('Failed to load team members')
        setMembers([])
        setAllMembers([])
      } else {
        // Build hierarchy tree
        const membersMap = new Map<string, TeamMember>()
        const rootMembers: TeamMember[] = []
        const flatMembers: TeamMember[] = []

        // First pass: create all members
        data.forEach((member: any) => {
          const teamMember: TeamMember = {
            id: member.id,
            user_id: member.user_id,
            role: member.role,
            manager_id: member.manager_id,
            department: member.department,
            job_title: member.job_title,
            level: member.level || 0,
            email: member.email,
            full_name: member.full_name,
            subordinates: []
          }
          membersMap.set(member.id, teamMember)
          flatMembers.push(teamMember)
        })

        // Second pass: build hierarchy
        membersMap.forEach((member) => {
          if (member.manager_id) {
            const manager = membersMap.get(member.manager_id)
            if (manager) {
              manager.subordinates = manager.subordinates || []
              manager.subordinates.push(member)
            } else {
              // Manager not found, add to root
              rootMembers.push(member)
            }
          } else {
            // No manager, this is a root member (owner/admin)
            rootMembers.push(member)
          }
        })

        setMembers(rootMembers)
        setAllMembers(flatMembers)
      }
    } catch (err) {
      console.error('Error loading team:', err)
      toast.error('Failed to load team members')
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (memberId: string) => {
    const newExpanded = new Set(expandedMembers)
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId)
    } else {
      newExpanded.add(memberId)
    }
    setExpandedMembers(newExpanded)
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setEditDialogOpen(true)
  }

  const handleUpdateMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentOrganization || !editingMember) return

    setSubmitting(true)
    try {
      const formData = new FormData(e.currentTarget)
      const role = formData.get('role') as string
      const manager_id = formData.get('manager_id') as string
      const department = formData.get('department') as string
      const job_title = formData.get('job_title') as string

      const res = await fetch(`/api/organizations/${currentOrganization.id}/members`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingMember.user_id,
          role: role || undefined,
          manager_id: manager_id === '' ? null : (manager_id || undefined),
          department: department || undefined,
          job_title: job_title || undefined,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Member updated successfully')
        setEditDialogOpen(false)
        setEditingMember(null)
        fetchTeamMembers()
      } else {
        toast.error(data.error || 'Failed to update member')
      }
    } catch (error) {
      console.error('Error updating member:', error)
      toast.error('Failed to update member')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveMember = async (member: TeamMember) => {
    if (!currentOrganization) return
    if (member.role === 'owner') {
      toast.error('Cannot remove the owner')
      return
    }

    if (!confirm(`Remove ${member.full_name || member.email} from the team?`)) return

    try {
      const res = await fetch(
        `/api/organizations/${currentOrganization.id}/members?userId=${member.user_id}`,
        { method: 'DELETE' }
      )

      if (res.ok) {
        toast.success('Member removed')
        fetchTeamMembers()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to remove member')
      }
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error('Failed to remove member')
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
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[role as keyof typeof colors] || colors.member}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    )
  }

  const renderMemberTree = (member: TeamMember, depth: number = 0) => {
    const hasSubordinates = member.subordinates && member.subordinates.length > 0
    const isExpanded = expandedMembers.has(member.id)
    const paddingLeft = depth * 24

    return (
      <div key={member.id}>
        <div
          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-2 border-transparent hover:border-indigo-500"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
        >
          {hasSubordinates && (
            <button
              onClick={() => toggleExpanded(member.id)}
              className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}
          {!hasSubordinates && <div className="w-6" />}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 text-sm">
                {member.full_name || member.email}
              </span>
              {getRoleBadge(member.role)}
              {member.job_title && (
                <span className="text-xs text-gray-500">• {member.job_title}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Mail className="h-3 w-3" />
              <span>{member.email}</span>
              {member.department && (
                <>
                  <span>•</span>
                  <Building2 className="h-3 w-3" />
                  <span>{member.department}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleEditMember(member)}
              title="Edit member"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {member.role !== 'owner' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleRemoveMember(member)}
                title="Remove member"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Render subordinates */}
        {hasSubordinates && isExpanded && (
          <div className="mt-1">
            {member.subordinates!.map((sub) => renderMemberTree(sub, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DashboardSidebar user={user!} onAccountSettingsClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading team...</p>
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
          <Card className="p-8 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Organization Selected</h2>
            <p className="text-gray-600 mb-4">Please select an organization to manage your team.</p>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Team Management</h1>
              <p className="text-sm text-gray-600">
                Manage your team members and organizational hierarchy
              </p>
            </div>
            <Link href="/dashboard/organization">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{allMembers.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Managers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allMembers.filter(m => m.role === 'manager').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allMembers.filter(m => m.role === 'member').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(allMembers.map(m => m.department).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Team Hierarchy */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Team Hierarchy</h2>
              <span className="text-sm text-gray-500">
                {currentOrganization.name}
              </span>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start building your team by inviting members
                </p>
                <Link href="/dashboard/organization">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Your First Member
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {members.map((member) => renderMemberTree(member))}
              </div>
            )}
          </Card>
        </div>

        {/* Edit Member Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>
                Update member information and assign manager
              </DialogDescription>
            </DialogHeader>
            {editingMember && (
              <form onSubmit={handleUpdateMember} className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Member</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {editingMember.full_name || editingMember.email}
                  </p>
                  <p className="text-xs text-gray-500">{editingMember.email}</p>
                </div>

                <div>
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role
                  </Label>
                  <Select name="role" defaultValue={editingMember.role}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="manager_id" className="text-sm font-medium text-gray-700">
                    Reports To (Manager)
                  </Label>
                  <Select
                    name="manager_id"
                    defaultValue={editingMember.manager_id || ''}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="No manager (top level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No manager (top level)</SelectItem>
                      {allMembers
                        .filter(m => m.id !== editingMember.id)
                        .map(m => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.full_name || m.email} ({m.role})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select who this person reports to
                  </p>
                </div>

                <div>
                  <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                    Department
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    defaultValue={editingMember.department || ''}
                    placeholder="e.g., Engineering, Sales, Marketing"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="job_title" className="text-sm font-medium text-gray-700">
                    Job Title
                  </Label>
                  <Input
                    id="job_title"
                    name="job_title"
                    defaultValue={editingMember.job_title || ''}
                    placeholder="e.g., Senior Developer, Account Manager"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
