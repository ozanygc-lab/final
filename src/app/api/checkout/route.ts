import { createRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

const EBOOK_GENERATION_PRICE = 19.99

/**
 * Stripe Checkout Session API route
 * Creates a one-time payment session
 * Stores session ID in database
 * Does NOT generate any ebook
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Create Stripe Checkout Session (one-time payment)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Génération d\'Ebook',
              description: 'Génération complète de votre ebook avec contenu structuré par IA',
            },
            unit_amount: Math.round(EBOOK_GENERATION_PRICE * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/`,
      metadata: {
        user_id: user?.id || 'anonymous',
      },
    })

    // Store session ID in database
    const { error: orderError } = await supabase.from('orders').insert({
      user_id: user?.id || null,
      stripe_session_id: session.id,
      amount: EBOOK_GENERATION_PRICE,
      status: 'pending',
    })

    if (orderError) {
      console.error('Error storing order:', orderError)
      return NextResponse.json(
        { error: 'Error storing order' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { url: session.url },
      { headers: response.headers }
    )
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
