import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/organizations/[orgId]/members - Get organization members
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orgId } = params

    // Verify user has access to this organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get all members with their user details
    const { data: members, error } = await supabase
      .from('organization_members')
      .select(`
        *,
        user:user_id (
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('organization_id', orgId)
      .order('joined_at', { ascending: true })

    if (error) {
      console.error('Error fetching members:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format member data
    const formattedMembers = members?.map((member: any) => ({
      id: member.id,
      user_id: member.user_id,
      email: member.user?.email,
      name: member.user?.raw_user_meta_data?.full_name,
      role: member.role,
      joined_at: member.joined_at,
    }))

    return NextResponse.json({ members: formattedMembers })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/organizations/[orgId]/members?userId=xxx - Remove member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orgId } = params
    const userIdToRemove = request.nextUrl.searchParams.get('userId')

    if (!userIdToRemove) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    // Check if user is admin/owner or removing themselves
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    const isSelfRemoval = user.id === userIdToRemove
    const isAdmin = membership?.role === 'owner' || membership?.role === 'admin'

    if (!isSelfRemoval && !isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can remove other members' },
        { status: 403 }
      )
    }

    // Prevent owner from removing themselves if they're the only owner
    if (isSelfRemoval && membership?.role === 'owner') {
      const { count } = await supabase
        .from('organization_members')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .eq('role', 'owner')

      if (count === 1) {
        return NextResponse.json(
          { error: 'Cannot remove the only owner. Transfer ownership first.' },
          { status: 400 }
        )
      }
    }

    // Remove member
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('organization_id', orgId)
      .eq('user_id', userIdToRemove)

    if (error) {
      console.error('Error removing member:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/organizations/[orgId]/members - Update member role
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orgId } = params
    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['owner', 'admin', 'member', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be: owner, admin, member, or viewer' },
        { status: 400 }
      )
    }

    // Check if current user is admin/owner
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    if (membership?.role !== 'owner' && membership?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can update member roles' },
        { status: 403 }
      )
    }

    // Update member role
    const { data, error } = await supabase
      .from('organization_members')
      .update({ role })
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating member role:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ member: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
