import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('🔗 Linking guest requests for:', user.email)

    // Find all guest requests with this email
    const { data: guestRequests, error: findError } = await supabase
      .from('feedback_requests')
      .select('id, title, guest_email')
      .eq('guest_email', user.email)
      .is('user_id', null)

    console.log('🔍 Found guest requests:', guestRequests?.length || 0)

    if (findError) {
      console.error('❌ Find error:', findError)
      return NextResponse.json({ error: findError.message }, { status: 500 })
    }

    if (!guestRequests || guestRequests.length === 0) {
      return NextResponse.json({ 
        success: true, 
        linked: 0,
        message: 'No guest requests to link'
      })
    }

    // Link them to user account
    const { data, error } = await supabase
      .from('feedback_requests')
      .update({ 
        user_id: user.id,
        creator_email: user.email,
        guest_email: null  // Clear guest_email once linked
      })
      .eq('guest_email', user.email)
      .is('user_id', null)
      .select()

    if (error) {
      console.error('❌ Link error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Linked requests:', data?.length || 0)

    return NextResponse.json({ 
      success: true, 
      linked: data?.length || 0,
      requests: data,
      message: `Successfully linked ${data?.length || 0} request(s) to your account`
    })
  } catch (error: any) {
    console.error('❌ Catch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'