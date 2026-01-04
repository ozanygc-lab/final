import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Import conditionnel de Resend pour éviter les erreurs
let resend: any = null

try {
  const { Resend } = require('resend')
  resend = new Resend(process.env.RESEND_API_KEY)
} catch (e) {
  console.warn('Resend not configured')
}

const schema = z.object({
  ebookId: z.string().uuid(),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ebookId, email } = schema.parse(body)

    const supabase = await createServerSupabaseClient()

    // Récupérer l'ebook
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .eq('status', 'published')
      .single()

    if (ebookError || !ebook) {
      console.error('Ebook error:', ebookError)
      return NextResponse.json({ error: 'Ebook non trouvé' }, { status: 404 })
    }

    if (ebook.price_cents !== 0) {
      return NextResponse.json({ error: 'Cet ebook est payant' }, { status: 400 })
    }

    // Récupérer le PDF
    const { data: pdfAsset, error: pdfError } = await supabase
      .from('ebook_assets')
      .select('*')
      .eq('ebook_id', ebookId)
      .eq('type', 'pdf')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (pdfError || !pdfAsset) {
      console.error('PDF error:', pdfError)
      return NextResponse.json({ error: 'PDF non disponible' }, { status: 404 })
    }

    // Envoyer l'email (si Resend est configuré)
    if (resend && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: email,
          subject: `Votre ebook gratuit : ${ebook.title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Votre ebook est prêt ! 📚</h1>
                </div>
                <div class="content">
                  <p>Bonjour,</p>
                  <p>Merci d'avoir téléchargé <strong>${ebook.title}</strong>.</p>
                  <p>Votre PDF est disponible ci-dessous :</p>
                  <p style="text-align: center;">
                    <a href="${pdfAsset.file_url || pdfAsset.pdf_url}" class="button">
                      📥 Télécharger le PDF
                    </a>
                  </p>
                  <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    <strong>⚠️ Contenu généré par IA</strong><br>
                    Cet ebook a été créé avec l'assistance d'une intelligence artificielle générative.
                  </p>
                </div>
                <div class="footer">
                  <p>Propulsé par Marketing Digital AI</p>
                  <p>Ce lien est valide pendant 30 jours.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        })

        console.log('Email sent successfully to:', email)
      } catch (emailError: any) {
        console.error('Email send error:', emailError)
        // Ne pas bloquer si l'email échoue, on retourne quand même le lien
      }
    } else {
      console.warn('Resend not configured, skipping email')
    }

    // Incrémenter les stats
    await supabase
      .from('ebooks')
      .update({ total_sales: ebook.total_sales + 1 })
      .eq('id', ebookId)

    // Retourner le lien PDF même si l'email échoue
    const pdfUrl = pdfAsset.file_url || pdfAsset.pdf_url
    return NextResponse.json({ 
      success: true,
      pdfUrl: pdfUrl,
      message: resend ? 'Email envoyé ! Vérifiez votre boîte de réception.' : 'Téléchargez directement votre PDF ci-dessous.'
    })
  } catch (error: any) {
    console.error('Error in free-download:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Erreur lors du traitement' },
      { status: 500 }
    )
  }
}
