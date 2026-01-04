import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Helper function to protect server components pages
 * Checks if user is authenticated, redirects to /login if not
 */
export async function requireAuth() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}













