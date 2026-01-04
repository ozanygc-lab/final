import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PricingContent from './PricingContent'

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in and has active subscription, redirect to app
  if (user) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (subscription) {
      redirect('/app')
    }
  }

  return <PricingContent />
}
