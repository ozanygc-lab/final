import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase browser client for Next.js App Router.
 * 
 * This client must be used ONLY in client components.
 * For server components, use createServerClient from @/lib/supabase/server
 * 
 * Usage in client components:
 * ```ts
 * 'use client'
 * import { supabase } from '@/lib/supabase/client'
 * 
 * await supabase.auth.signInWithPassword({ email, password })
 * ```
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  )
}

// createBrowserClient from @supabase/ssr automatically handles PKCE code verifier
// It stores it in cookies with the correct configuration
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

/**
 * Creates a Supabase browser client (function form as per instructions)
 * Usage: const supabase = createClient()
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
