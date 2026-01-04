import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const schema = z.object({
  ebookId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ebookId } = schema.parse(body)

    const supabase = await createServerSupabaseClient()

    // Récupérer l'ebook
    const { data: ebook } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .eq('status', 'published')
      .single()

    if (!ebook) {
      return NextResponse.json({ error: 'Ebook non trouvé' }, { status: 404 })
    }

    if (ebook.price_cents === 0) {
      return NextResponse.json({ error: 'Ebook gratuit' }, { status: 400 })
    }

    // Vérifier que le PDF existe
    const { data: pdfAsset } = await supabase
      .from('ebook_assets')
      .select('*')
      .eq('ebook_id', ebookId)
      .eq('type', 'pdf')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!pdfAsset) {
      return NextResponse.json({ error: 'PDF non disponible' }, { status: 404 })
    }

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: ebook.currency.toLowerCase(),
            product_data: {
              name: ebook.title,
              description: ebook.description || undefined,
            },
            unit_amount: ebook.price_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/ebook/${ebook.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/ebook/${ebook.slug}`,
      metadata: {
        ebookId: ebook.id,
        pdfUrl: pdfAsset.file_url,
      },
      customer_email: undefined, // Stripe demandera l'email
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur' },
      { status: 500 }
    )
  }
}










