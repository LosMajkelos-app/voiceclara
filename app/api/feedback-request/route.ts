import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    const body = await request.json()
    const { 
      creator_name, 
      creator_email, 
      title, 
      questions, 
      guest_email, 
      user_id,
      share_token,
      results_token 
    } = body

    console.log('📝 Creating feedback request:', { 
      creator_email, 
      guest_email, 
      user_id,
      is_guest: !!guest_email,
      title 
    })

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!share_token || !results_token) {
      return NextResponse.json(
        { error: 'Tokens are required' },
        { status: 400 }
      )
    }

    // Default questions if not provided
    const defaultQuestions = questions || [
      "What am I doing well?",
      "What could I improve?",
      "What's my biggest blind spot?",
      "What should I start/stop/continue?",
      "Any other thoughts?"
    ]

    // Insert feedback request
    const { data, error } = await supabase
      .from('feedback_requests')
      .insert([
        {
          user_id: user_id || null,
          creator_name: creator_name || null,
          creator_email: creator_email || null,
          guest_email: guest_email || null,
          title,
          questions: defaultQuestions,
          share_token,
          results_token,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Request created:', data.id)

    return NextResponse.json({ 
      success: true,
      data 
    })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET - Fetch user's requests (for dashboard)
export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch user's requests
    const { data, error } = await supabase
      .from('feedback_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Fetch error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      data 
    })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Force dynamic
export const dynamic = 'force-dynamic'