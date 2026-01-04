import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Debug route to log the authenticated user using Supabase server client
 */
export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG: Checking authenticated user ===')
    
    // Use Supabase server client
    const supabase = await createServerClient()
    
    // Try to get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    
    console.log('User error:', userError)
    console.log('User data:', user ? { id: user.id, email: user.email } : null)
    
    // Also try to get session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()
    
    console.log('Session error:', sessionError)
    console.log('Session exists:', !!session)
    console.log('Session user:', session?.user ? { id: session.user.id, email: session.user.email } : null)
    
    // Check cookies
    const cookies = request.cookies.getAll()
    console.log('All cookies:', cookies.map(c => ({ name: c.name, hasValue: !!c.value })))
    
    // Check for Supabase auth cookies
    const supabaseCookies = cookies.filter(c => 
      c.name.includes('supabase') || 
      c.name.includes('auth') ||
      c.name.includes('sb-')
    )
    console.log('Supabase-related cookies:', supabaseCookies.map(c => c.name))
    
    // If no user is found, explain why
    if (!user) {
      const reasons = []
      
      if (userError) {
        reasons.push(`Error from getUser(): ${userError.message}`)
      }
      
      if (!session) {
        reasons.push('No session found')
        if (sessionError) {
          reasons.push(`Session error: ${sessionError.message}`)
        }
      }
      
      if (supabaseCookies.length === 0) {
        reasons.push('No Supabase auth cookies found in request')
      } else {
        reasons.push(`Found ${supabaseCookies.length} Supabase-related cookies but no valid session`)
      }
      
      return NextResponse.json({
        authenticated: false,
        user: null,
        session: null,
        reasons: reasons,
        cookies: {
          total: cookies.length,
          supabaseRelated: supabaseCookies.length,
          cookieNames: cookies.map(c => c.name),
        },
        errors: {
          userError: userError?.message || null,
          sessionError: sessionError?.message || null,
        },
      })
    }
    
    // User found
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
      },
      session: session ? {
        expiresAt: session.expires_at,
        accessToken: session.access_token ? 'present' : 'missing',
      } : null,
      cookies: {
        total: cookies.length,
        supabaseRelated: supabaseCookies.length,
      },
    })
  } catch (error: any) {
    console.error('Debug route error:', error)
    return NextResponse.json({
      error: error.message || 'An error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 })
  }
}













