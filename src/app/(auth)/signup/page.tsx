import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignupForm from './SignupForm'

export default async function SignupPage() {
  const supabase = await createServerClient()

  // If user is already authenticated, redirect to dashboard
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return <SignupForm />
}
