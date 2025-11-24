import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ share_token: string }> }
) {
  try {
    const { share_token } = await params

    if (!share_token) {
      return NextResponse.json(
        { error: 'Share token is required' },
        { status: 400 }
      )
    }

    // Fetch feedback request from Supabase (server-side, no CORS issues)
    const { data, error } = await supabase
      .from('feedback_requests')
      .select('*')
      .eq('share_token', share_token)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch feedback request', details: error.message },
        { status: 404 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Feedback request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching feedback request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
