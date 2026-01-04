import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from './Navbar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Ensure user has a subscription (create free starter if needed)
  // Use .maybeSingle() to avoid errors if no subscription exists
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .maybeSingle()

  if (!subscription) {
    // Create free starter plan automatically (fire and forget - don't block rendering)
    const { error: subscriptionError } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_id: 'starter',
      status: 'active',
      stripe_session_id: null,
      stripe_subscription_id: null,
      stripe_customer_id: null,
    })
    
    // Ignore errors - subscription might already exist
    if (subscriptionError) {
      console.log('Subscription might already exist:', subscriptionError)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar user={user} />
      <main>{children}</main>
    </div>
  )
}




