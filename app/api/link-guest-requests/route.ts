import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return NextResponse.json({
        error: 'Not authenticated',
        details: 'No authorization header'
      }, { status: 401 })
    }

    // Create authenticated client with user's token (respects RLS)
    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    })

    // Verify user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({
        error: 'Not authenticated',
        details: userError?.message
      }, { status: 401 })
    }

    // Find guest requests for this user's email
    const { data: guestRequests, error: findError } = await supabase
      .from('feedback_requests')
      .select('id, title, guest_email, created_at')
      .eq('guest_email', user.email)
      .is('user_id', null)

    if (findError) {
      return NextResponse.json({
        error: findError.message
      }, { status: 500 })
    }

    if (!guestRequests || guestRequests.length === 0) {
      return NextResponse.json({
        success: true,
        linked: 0,
        message: 'No guest requests found'
      })
    }

    // Link them to authenticated user (RLS policy must allow this)
    const { data: linkedRequests, error: linkError } = await supabase
      .from('feedback_requests')
      .update({
        user_id: user.id,
        creator_email: user.email,
        guest_email: null
      })
      .eq('guest_email', user.email)
      .is('user_id', null)
      .select()

    if (linkError) {
      return NextResponse.json({
        error: linkError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      linked: linkedRequests?.length || 0,
      requests: linkedRequests,
      message: `Successfully linked ${linkedRequests?.length || 0} request(s)`
    })

  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'