import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// GET /api/organizations/[orgId]/invitations - Get pending invitations
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

    // Check if user is admin/owner
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    if (membership?.role !== 'owner' && membership?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get pending invitations
    const { data: invitations, error } = await supabase
      .from('organization_invitations')
      .select('*')
      .eq('organization_id', orgId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching invitations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ invitations })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/organizations/[orgId]/invitations - Send invitation
export async function POST(
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
    const { email, role = 'member' } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if user is admin/owner
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    if (membership?.role !== 'owner' && membership?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can invite members' },
        { status: 403 }
      )
    }

    // Get organization details
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('name, plan_type')
      .eq('id', orgId)
      .single()

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Check member limit based on plan
    const { count: memberCount } = await supabase
      .from('organization_members')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', orgId)

    const limits = {
      free: 1, // Solo
      pro: 5,
      business: Infinity,
    }

    if ((memberCount || 0) >= limits[organization.plan_type as keyof typeof limits]) {
      return NextResponse.json(
        { error: `Member limit reached for ${organization.plan_type} plan. Upgrade to add more members.` },
        { status: 403 }
      )
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('user_id')
      .eq('organization_id', orgId)
      .eq('user_id', (await supabase.from('auth.users').select('id').eq('email', email).single()).data?.id || '')
      .single()

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 409 }
      )
    }

    // Check if invitation already exists
    const { data: existingInvite } = await supabase
      .from('organization_invitations')
      .select('id')
      .eq('organization_id', orgId)
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (existingInvite) {
      return NextResponse.json(
        { error: 'Invitation already sent to this email' },
        { status: 409 }
      )
    }

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('organization_invitations')
      .insert({
        organization_id: orgId,
        email,
        role,
        invited_by: user.id,
      })
      .select()
      .single()

    if (inviteError) {
      console.error('Error creating invitation:', inviteError)
      return NextResponse.json({ error: inviteError.message }, { status: 500 })
    }

    // Send invitation email
    try {
      const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${invitation.invitation_token}`

      await resend.emails.send({
        from: 'VoiceClara <noreply@voiceclara.com>',
        to: email,
        subject: `You've been invited to join ${organization.name} on VoiceClara`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">You've been invited to VoiceClara</h2>
            <p>You've been invited to join <strong>${organization.name}</strong> on VoiceClara.</p>
            <p>Click the button below to accept your invitation:</p>
            <a href="${inviteUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
              Accept Invitation
            </a>
            <p style="color: #666; font-size: 14px;">
              This invitation will expire in 7 days.
            </p>
            <p style="color: #666; font-size: 14px;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
        `,
      })

      console.log('✅ Invitation email sent to:', email)
    } catch (emailError) {
      console.error('❌ Error sending invitation email:', emailError)
      // Don't fail the request - invitation is created
    }

    return NextResponse.json({ invitation }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/organizations/[orgId]/invitations?invitationId=xxx - Cancel invitation
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
    const invitationId = request.nextUrl.searchParams.get('invitationId')

    if (!invitationId) {
      return NextResponse.json(
        { error: 'invitationId parameter is required' },
        { status: 400 }
      )
    }

    // Check if user is admin/owner
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', user.id)
      .single()

    if (membership?.role !== 'owner' && membership?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can cancel invitations' },
        { status: 403 }
      )
    }

    // Delete invitation
    const { error } = await supabase
      .from('organization_invitations')
      .delete()
      .eq('id', invitationId)
      .eq('organization_id', orgId)

    if (error) {
      console.error('Error deleting invitation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
