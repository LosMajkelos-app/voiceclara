"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useOrganization } from "@/lib/organization-context"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Mail, Trash2, UserPlus, Crown, Shield, Eye } from "lucide-react"
import { toast } from "sonner"

interface Member {
  id: string
  user_id: string
  email: string
  name?: string
  role: string
  joined_at: string
}

interface Invitation {
  id: string
  email: string
  role: string
  created_at: string
  expires_at: string
}

export default function TeamPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { currentOrganization, organizations } = useOrganization()
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (currentOrganization) {
      fetchTeamData()
    }
  }, [currentOrganization])

  const fetchTeamData = async () => {
    if (!currentOrganization) return

    setLoading(true)
    try {
      // Fetch members
      const membersRes = await fetch(`/api/organizations/${currentOrganization.id}/members`)
      const membersData = await membersRes.json()
      if (membersData.members) {
        setMembers(membersData.members)
      }

      // Fetch invitations
      const invitesRes = await fetch(`/api/organizations/${currentOrganization.id}/invitations`)
      const invitesData = await invitesRes.json()
      if (invitesData.invitations) {
        setInvitations(invitesData.invitations)
      }
    } catch (error) {
      console.error("Error fetching team data:", error)
      toast.error("Failed to load team data")
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentOrganization || !inviteEmail) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/organizations/${currentOrganization.id}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Invitation sent to ${inviteEmail}`)
        setInviteEmail("")
        setInviteRole("member")
        setInviteDialogOpen(false)
        fetchTeamData()
      } else {
        toast.error(data.error || "Failed to send invitation")
      }
    } catch (error) {
      console.error("Error sending invitation:", error)
      toast.error("Failed to send invitation")
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!currentOrganization) return

    if (!confirm(`Remove ${memberEmail} from the team?`)) return

    try {
      const member = members.find(m => m.id === memberId)
      const res = await fetch(
        `/api/organizations/${currentOrganization.id}/members?userId=${member?.user_id}`,
        { method: "DELETE" }
      )

      if (res.ok) {
        toast.success("Member removed")
        fetchTeamData()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to remove member")
      }
    } catch (error) {
      console.error("Error removing member:", error)
      toast.error("Failed to remove member")
    }
  }

  const handleCancelInvitation = async (invitationId: string) => {
    if (!currentOrganization) return

    try {
      const res = await fetch(
        `/api/organizations/${currentOrganization.id}/invitations?invitationId=${invitationId}`,
        { method: "DELETE" }
      )

      if (res.ok) {
        toast.success("Invitation cancelled")
        fetchTeamData()
      } else {
        toast.error("Failed to cancel invitation")
      }
    } catch (error) {
      console.error("Error cancelling invitation:", error)
      toast.error("Failed to cancel invitation")
    }
  }

  const handleChangeRole = async (memberId: string, newRole: string) => {
    if (!currentOrganization) return

    try {
      const member = members.find(m => m.id === memberId)
      const res = await fetch(`/api/organizations/${currentOrganization.id}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: member?.user_id, role: newRole }),
      })

      if (res.ok) {
        toast.success("Role updated")
        fetchTeamData()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update role")
      }
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Failed to update role")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-600" />
      default:
        return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  const currentMember = members.find(m => m.user_id === user?.id)
  const isAdmin = currentMember?.role === "owner" || currentMember?.role === "admin"

  const planLimits = {
    free: 1,
    pro: 5,
    business: Infinity,
  }

  const memberLimit = planLimits[currentOrganization?.plan_type as keyof typeof planLimits] || 1
  const canAddMembers = members.length < memberLimit

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-center text-gray-500">Loading...</p>
          </div>
        </div>
      </>
    )
  }

  if (!currentOrganization) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-center text-gray-500">No organization selected</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
              <p className="text-sm text-gray-600">{currentOrganization.name}</p>
            </div>
            {isAdmin && (
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    disabled={!canAddMembers}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join {currentOrganization.name}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInvite} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer - Can view results</SelectItem>
                          <SelectItem value="member">Member - Can create requests</SelectItem>
                          <SelectItem value="admin">Admin - Can manage team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? "Sending..." : "Send Invitation"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Plan Limit Warning */}
          {!canAddMembers && (
            <Card className="p-4 bg-amber-50 border-amber-200">
              <p className="text-sm text-amber-800">
                You've reached the member limit for the {currentOrganization.plan_type} plan ({memberLimit}{" "}
                {memberLimit === 1 ? "member" : "members"}).{" "}
                <a href="/pricing" className="underline font-medium">
                  Upgrade to add more members
                </a>
              </p>
            </Card>
          )}

          {/* Team Members */}
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Team Members ({members.length})
            </h2>
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getRoleIcon(member.role)}
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.name || member.email}
                      </p>
                      {member.name && (
                        <p className="text-sm text-gray-500">{member.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && member.user_id !== user?.id && (
                      <>
                        <Select
                          value={member.role}
                          onValueChange={(role) => handleChangeRole(member.id, role)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id, member.email)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {!isAdmin || member.user_id === user?.id ? (
                      <span className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700 capitalize">
                        {member.role}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending Invitations */}
          {isAdmin && invitations.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-600" />
                Pending Invitations ({invitations.length})
              </h2>
              <div className="space-y-3">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <p className="text-sm text-gray-500">
                        Invited {new Date(invitation.created_at).toLocaleDateString()} • Expires{" "}
                        {new Date(invitation.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 capitalize">
                        {invitation.role}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelInvitation(invitation.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
