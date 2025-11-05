import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    // Get auth token from request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      console.log('❌ No auth header')
      return NextResponse.json({ 
        error: 'Not authenticated',
        details: 'No authorization header'
      }, { status: 401 })
    }

    // Create client with service role for admin operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // But also create regular client to verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      console.log('❌ Invalid token:', userError?.message)
      return NextResponse.json({ 
        error: 'Not authenticated',
        details: userError?.message 
      }, { status: 401 })
    }

    console.log('🔗 Linking guest requests for:', user.email)

    // Find guest requests
    const { data: guestRequests, error: findError } = await supabaseAdmin
      .from('feedback_requests')
      .select('id, title, guest_email, created_at')
      .eq('guest_email', user.email)
      .is('user_id', null)

    console.log('🔍 Found guest requests:', guestRequests?.length || 0)

    if (findError) {
      console.error('❌ Find error:', findError)
      return NextResponse.json({ 
        error: findError.message 
      }, { status: 500 })
    }

    if (!guestRequests || guestRequests.length === 0) {
      console.log('✅ No guest requests to link')
      return NextResponse.json({ 
        success: true, 
        linked: 0,
        message: 'No guest requests found'
      })
    }

    // Link them
    const { data: linkedRequests, error: linkError } = await supabaseAdmin
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
      console.error('❌ Link error:', linkError)
      return NextResponse.json({ 
        error: linkError.message 
      }, { status: 500 })
    }

    console.log('✅ Successfully linked:', linkedRequests?.length || 0, 'requests')

    return NextResponse.json({ 
      success: true, 
      linked: linkedRequests?.length || 0,
      requests: linkedRequests,
      message: `Successfully linked ${linkedRequests?.length || 0} request(s)`
    })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({ 
      error: error.message || 'Unknown error'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'