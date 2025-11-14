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

      // Check if this is a new signup (first login after email confirmation)
      // Method 1: Compare last_sign_in_at with created_at - if very close, it's first login
      const user = data.user
      const createdRecently = user?.created_at && user?.last_sign_in_at &&
        Math.abs(new Date(user.created_at).getTime() - new Date(user.last_sign_in_at).getTime()) < 60000 // Within 1 minute

      // Method 2: Check if email was confirmed recently (within last 2 minutes)
      const emailConfirmedRecently = user?.email_confirmed_at &&
        Date.now() - new Date(user.email_confirmed_at).getTime() < 120000 // Within 2 minutes

      const isNewSignup = createdRecently || emailConfirmedRecently

      console.log('🔍 Signup detection:', {
        created_at: user?.created_at,
        last_sign_in_at: user?.last_sign_in_at,
        email_confirmed_at: user?.email_confirmed_at,
        createdRecently,
        emailConfirmedRecently,
        isNewSignup,
        timeDiff: user?.created_at && user?.last_sign_in_at ?
          Math.abs(new Date(user.created_at).getTime() - new Date(user.last_sign_in_at).getTime()) : null
      })

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
              console.log('✅ Adding confirmed=true to redirect (with linked requests)')
            }
            return NextResponse.redirect(redirectUrl)
          }
        } catch (err) {
          console.error('❌ Could not link guest requests:', err)
        }
      }

      // Redirect with confirmation message if new signup
      if (isNewSignup) {
        console.log('✅ Adding confirmed=true to redirect')
        return NextResponse.redirect(new URL(`${next}?confirmed=true`, requestUrl.origin))
      }

      console.log('ℹ️ Regular login, no confirmed banner')
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