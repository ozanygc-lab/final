import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { Resend } from 'resend'
import Stripe from 'stripe'

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured')
    return null
  }
  return new Resend(apiKey)
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const ebookId = session.metadata?.ebookId
    const pdfUrl = session.metadata?.pdfUrl
    const buyerEmail = session.customer_details?.email
    const buyerName = session.customer_details?.name

    if (!ebookId || !pdfUrl || !buyerEmail) {
      console.error('Missing metadata in checkout session')
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Récupérer l'ebook
    const { data: ebook } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .single()

    if (!ebook) {
      console.error('Ebook not found:', ebookId)
      return NextResponse.json({ error: 'Ebook not found' }, { status: 404 })
    }

    // Créer la commande
    await supabase.from('orders').insert({
      ebook_id: ebookId,
      buyer_email: buyerEmail,
      buyer_name: buyerName || null,
      amount_cents: session.amount_total || ebook.price_cents,
      currency: ebook.currency,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_checkout_session_id: session.id,
      status: 'completed',
      pdf_delivered_at: new Date().toISOString(),
    })

    // Mettre à jour les stats de l'ebook
    await supabase
      .from('ebooks')
      .update({
        total_sales: ebook.total_sales + 1,
        total_revenue_cents: ebook.total_revenue_cents + (session.amount_total || ebook.price_cents),
      })
      .eq('id', ebookId)

    // Envoyer l'email avec le PDF
    try {
      const resend = getResend()
      if (!resend) {
        console.warn('Resend not configured, skipping email send')
      } else {
        await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: buyerEmail,
        subject: `Votre ebook : ${ebook.title}`,
        html: `
          <h1>Merci pour votre achat !</h1>
          <p>Bonjour${buyerName ? ` ${buyerName}` : ''},</p>
          <p>Merci d'avoir acheté <strong>${ebook.title}</strong>.</p>
          <p>Votre PDF est prêt :</p>
          <p>
            <a href="${pdfUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              📥 Télécharger le PDF
            </a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Ce lien est valide pendant 30 jours. Conservez cet email précieusement.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #999; font-size: 12px;">
            Montant payé : ${((session.amount_total || 0) / 100).toFixed(2)}€
          </p>
          <p style="color: #999; font-size: 12px;">
            Propulsé par Marketing Digital AI
          </p>
        `,
        })
        console.log('Email sent to:', buyerEmail)
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Ne pas fail le webhook si l'email échoue
    }
  }

  return NextResponse.json({ received: true })
}
