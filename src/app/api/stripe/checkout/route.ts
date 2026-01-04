import { createRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

const PLANS = {
  single: { price: 1, name: '1 Ebook', isOneTime: true },
  starter: { price: 0, name: 'Starter Plan', isOneTime: false, isFree: true },
  pro: { price: 49, name: 'Pro Plan', isOneTime: false },
}

/**
 * POST route to create Stripe Checkout Session for subscription
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

    if (!planId || !PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const plan = PLANS[planId as keyof typeof PLANS]

    // Starter plan is free, should use activate-free endpoint instead
    if ('isFree' in plan && plan.isFree) {
      return NextResponse.json(
        { error: 'Le plan Starter est gratuit. Utilisez le bouton "Activer gratuitement".' },
        { status: 400 }
      )
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    // For "single" plan, use one-time payment, otherwise use subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: plan.name,
              description: plan.isOneTime
                ? `Génération de 1 ebook - ${plan.name}`
                : `Abonnement ${plan.name} - Génération illimitée d'ebooks`,
            },
            unit_amount: Math.round(plan.price * 100),
            ...(plan.isOneTime
              ? {}
              : {
                  recurring: {
                    interval: 'month',
                  },
                }),
          },
          quantity: 1,
        },
      ],
      mode: plan.isOneTime ? 'payment' : 'subscription',
      success_url: `${appUrl}/app?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
    })

    // Store subscription or one-time payment in database
    const { error: insertError } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      stripe_session_id: session.id,
      plan_id: planId,
      status: 'pending',
      ebooks_generated: plan.isOneTime ? 0 : null, // Initialize counter for single plan
    })

    if (insertError) {
      console.error('Error storing subscription:', insertError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement de l\'abonnement' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { url: session.url },
      { headers: response.headers }
    )
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}

