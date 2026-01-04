import { createServerClient as createSupabaseServerClientFromSSR } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'

/**
 * Creates a Supabase server client using createServerClient from @supabase/ssr.
 * Uses cookies from next/headers.
 * Ensures it can read the authenticated user session.
 * 
 * Usage in Server Components:
 * ```ts
 * const supabase = await createServerClient()
 * // Read authenticated user session
 * const { data: { user } } = await supabase.auth.getUser()
 * // Or read session
 * const { data: { session } } = await supabase.auth.getSession()
 * ```
 */
export async function createServerClient() {
  // Use cookies from next/headers
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }

  // Use createServerClient from @supabase/ssr
  // This ensures it can read the authenticated user session from cookies
  return createSupabaseServerClientFromSSR(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // Read cookies from next/headers
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        try {
          // Write cookies using next/headers
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Crée un client Supabase pour les Route Handlers
 * Utilise les cookies de la requête et de la réponse pour la gestion des sessions
 */
export function createRouteHandlerClient(
  request: NextRequest,
  response: NextResponse
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }

  // Use createServerClient for route handlers (it works with request cookies)
  // Important: This must read ALL cookies from the request, including PKCE code verifier
  return createSupabaseServerClientFromSSR(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // Get all cookies from the request - this includes PKCE code verifier
        const cookies = request.cookies.getAll()
        return cookies
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        // Set cookies in both request and response
        cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })
}

/**
 * Creates a Supabase server client for route handlers
 * Uses createServerClient from @supabase/ssr (createRouteHandlerClient doesn't exist)
 * Reads cookies from NextRequest
 * 
 * Usage in Route Handlers:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const response = NextResponse.next()
 *   const supabase = getSupabaseServerClient(request, response)
 *   const { data: { user } } = await supabase.auth.getUser()
 * }
 * ```
 */
export function getSupabaseServerClient(
  request: NextRequest,
  response: NextResponse
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }

  // Use createServerClient from @supabase/ssr for route handlers
  // Note: createRouteHandlerClient doesn't exist in @supabase/ssr
  // This reads cookies from the request
  return createSupabaseServerClientFromSSR(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // Read cookies from request
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        // Set cookies in both request and response
        cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })
}

/**
 * Creates a Supabase server client helper for Next.js App Router.
 * Uses createServerClient from @supabase/ssr (which is the underlying function).
 * Accepts cookies from next/headers.
 * 
 * This is the recommended way to create a Supabase client in Server Components.
 * 
 * Usage in Server Components:
 * ```ts
 * const supabase = await createSupabaseServerClient()
 * const { data: { user } } = await supabase.auth.getUser()
 * ```
 * 
 * @returns A Supabase client instance configured for server-side usage
 */
export async function createSupabaseServerClient() {
  // Accept cookies from next/headers
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
  }

  // Use createServerClient from @supabase/ssr
  // This is the underlying function that createRouteHandlerClient uses internally
  return createSupabaseServerClientFromSSR(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // Read cookies from next/headers
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        try {
          // Write cookies using next/headers
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Alias pour createServerClient pour maintenir la compatibilité
 */
export const createClient = createServerClient

/**
 * Alias pour createServerClient selon les instructions
 * (utilise la même implémentation que createServerClient)
 */
export const createServerSupabaseClient = createServerClient
