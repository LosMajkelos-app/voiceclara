import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/organizations - Get user's organizations
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all organizations the user owns or is a member of
    const { data: ownedOrgs, error: ownedError } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_id', user.id)

    if (ownedError) {
      console.error('Error fetching owned organizations:', ownedError?.message || 'Unknown error')
      return NextResponse.json({ error: ownedError.message }, { status: 500 })
    }

    // Get organizations where user is a member
    const { data: memberOrgs, error: memberError } = await supabase
      .from('organization_members')
      .select('organization_id, role, organizations(*)')
      .eq('user_id', user.id)

    if (memberError) {
      console.error('Error fetching member organizations:', memberError?.message || 'Unknown error')
      // Don't fail, just continue with owned orgs
    }

    // Combine and deduplicate
    const allOrgs = [...(ownedOrgs || [])]
    const ownedOrgIds = new Set(ownedOrgs?.map(o => o.id) || [])

    // Add member orgs that aren't already in owned orgs
    if (memberOrgs) {
      memberOrgs.forEach((m: any) => {
        if (m.organizations && typeof m.organizations === 'object' && !Array.isArray(m.organizations) && m.organizations.id && !ownedOrgIds.has(m.organizations.id)) {
          allOrgs.push({
            ...m.organizations,
            role: m.role
          })
        }
      })
    }

    if (!allOrgs || allOrgs.length === 0) {
      return NextResponse.json({ organizations: [] })
    }

    // Get member counts for each organization
    const orgsWithCounts = await Promise.all(
      allOrgs.map(async (org) => {
        const { count } = await supabase
          .from('organization_members')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', org.id)

        return {
          ...org,
          member_count: count || 0,
        }
      })
    )

    return NextResponse.json({ organizations: orgsWithCounts })
  } catch (error: any) {
    console.error('Unexpected error:', error?.message || 'Unknown error')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/organizations - Create new organization
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Validate slug format (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      )
    }

    // Check if slug is already taken
    const { data: existing } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Slug is already taken' },
        { status: 409 }
      )
    }

    // Create organization
    const { data: organization, error: createError } = await supabase
      .from('organizations')
      .insert({
        name,
        slug,
        owner_id: user.id,
        plan_type: 'free',
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating organization:', createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    // Add creator as owner member
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organization.id,
        user_id: user.id,
        role: 'owner',
      })

    if (memberError) {
      console.error('Error adding owner as member:', memberError)
      // Don't fail the request, organization is already created
    }

    return NextResponse.json({ organization }, { status: 201 })
  } catch (error: any) {
    console.error('Unexpected error:', error?.message || 'Unknown error')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
