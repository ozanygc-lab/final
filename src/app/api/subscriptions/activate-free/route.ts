import { createRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST route to activate free starter plan
 * Creates a subscription without Stripe payment
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await request.json()

    if (planId !== 'starter') {
      return NextResponse.json(
        { error: 'Seul le plan Starter peut être activé gratuitement' },
        { status: 400 }
      )
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .eq('plan_id', 'starter')
      .single()

    if (existingSubscription) {
      // User already has starter plan, redirect to app
      return NextResponse.json({ success: true, message: 'Plan déjà actif' })
    }

    // Create free starter subscription
    const { error: insertError } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      plan_id: 'starter',
      status: 'active',
      stripe_session_id: null,
      stripe_subscription_id: null,
      stripe_customer_id: null,
    })

    if (insertError) {
      console.error('Error creating free subscription:', insertError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'activation du plan gratuit' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Plan Starter activé avec succès' },
      { headers: response.headers }
    )
  } catch (error: any) {
    console.error('Activate free plan error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}













