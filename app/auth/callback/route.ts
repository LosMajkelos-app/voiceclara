import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = cookies()  // Remove await - it's synchronous in route handlers
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Auth callback error:', error)
        return NextResponse.redirect(
          new URL('/auth/login?error=Could not authenticate', requestUrl.origin)
        )
      }

      console.log('✅ Email confirmed, user logged in:', data.user?.email)

      // Check if this is a new signup (user just confirmed email)
      const isNewSignup = data.user?.created_at &&
        new Date(data.user.created_at).getTime() > Date.now() - 300000 // Within last 5 minutes

      // Link guest requests after email confirmation
      if (data.user && data.session) {
        try {
          console.log('🔗 Linking guest requests after email confirmation...')

          const linkRes = await fetch(`${requestUrl.origin}/api/link-guest-requests`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`,
              'Content-Type': 'application/json'
            },
          })

          const linkData = await linkRes.json()
          console.log('🔗 Link result:', linkData)

          if (linkData.linked > 0) {
            const redirectUrl = new URL(`${next}?linked=${linkData.linked}`, requestUrl.origin)
            if (isNewSignup) {
              redirectUrl.searchParams.append('confirmed', 'true')
            }
            return NextResponse.redirect(redirectUrl)
          }
        } catch (err) {
          console.error('❌ Could not link guest requests:', err)
        }
      }

      // Redirect with confirmation message if new signup
      if (isNewSignup) {
        return NextResponse.redirect(new URL(`${next}?confirmed=true`, requestUrl.origin))
      }

      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      return NextResponse.redirect(
        new URL('/auth/login?error=Authentication failed', requestUrl.origin)
      )
    }
  }

  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}

export const dynamic = 'force-dynamic'