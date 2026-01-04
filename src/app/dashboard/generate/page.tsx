import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import GenerateEbook from './GenerateEbook'
import DashboardLayout from '@/components/DashboardLayout'

export default async function GeneratePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user has active subscription
  const { data: activeSubscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (!activeSubscription) {
    redirect('/pricing')
  }

  return (
    <DashboardLayout>
      <GenerateEbook />
    </DashboardLayout>
  )
}
