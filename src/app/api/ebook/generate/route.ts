import { createRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserSubscription, getRemainingPdfEdits } from '@/lib/subscription'
import { generateEbookPDF } from '@/lib/pdf'
import { createClient as createServiceClient } from '@supabase/supabase-js'

/**
 * POST API route to generate an ebook PDF
 * PAYWALL: Only subscribed users can generate PDFs
 * LIMIT: Respects max PDF edits based on subscription plan
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Vous devez être connecté.' },
        { status: 401 }
      )
    }

    // Check user's subscription
    const subscription = await getUserSubscription(user.id)

    // PAYWALL: Check if user has a subscription
    if (subscription.plan === 'free') {
      return NextResponse.json(
        {
          error: 'Payment required',
          message: 'Un abonnement est requis pour générer des PDFs. Passez à un plan Basic ou Premium.',
          requiresUpgrade: true,
        },
        { status: 403 }
      )
    }

    // Check remaining PDF edits
    const remainingEdits = await getRemainingPdfEdits(user.id)

    if (remainingEdits !== null && remainingEdits <= 0) {
      return NextResponse.json(
        {
          error: 'Upgrade required',
          message: `Vous avez atteint la limite de modifications PDF (${subscription.maxPdfEdits}). Passez au plan Premium pour des modifications illimitées.`,
          requiresUpgrade: true,
          maxEdits: subscription.maxPdfEdits,
        },
        { status: 403 }
      )
    }

    // Get ebook ID from request
    const { ebookId } = await request.json()

    if (!ebookId) {
      return NextResponse.json(
        { error: 'ebookId is required', message: 'L\'ID de l\'ebook est requis.' },
        { status: 400 }
      )
    }

    // Fetch ebook and chapters
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .select('*')
      .eq('id', ebookId)
      .eq('user_id', user.id)
      .single()

    if (ebookError || !ebook) {
      return NextResponse.json(
        { error: 'Ebook not found', message: 'Ebook introuvable.' },
        { status: 404 }
      )
    }

    // Fetch chapters
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('ebook_id', ebook.id)
      .order('order_index', { ascending: true })

    if (chaptersError || !chapters || chapters.length === 0) {
      return NextResponse.json(
        { error: 'No chapters found', message: 'Aucun chapitre trouvé pour cet ebook.' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfBuffer = await generateEbookPDF(ebook, chapters)

    // Upload PDF to Supabase Storage
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const slug = `${ebook.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
    const fileName = `${user.id}/${ebook.id}/${slug}.pdf`

    const { data: uploadData, error: uploadError } = await serviceClient.storage
      .from('ebooks')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('PDF upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload PDF', message: 'Échec du téléchargement du PDF.' },
        { status: 500 }
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = serviceClient.storage.from('ebooks').getPublicUrl(fileName)

    // Update ebook with PDF URL and increment edit_count
    const currentEditCount = ebook.edit_count || 0
    const { error: updateError } = await supabase
      .from('ebooks')
      .update({
        pdf_url: publicUrl,
        edit_count: currentEditCount + 1,
      })
      .eq('id', ebook.id)

    if (updateError) {
      console.error('Ebook update error:', updateError)
      // Continue anyway - PDF is uploaded
    }

    // Save PDF path in ebook_assets table
    await supabase.from('ebook_assets').upsert({
      ebook_id: ebook.id,
      pdf_path: fileName,
      pdf_url: publicUrl,
    })

    // Get updated remaining edits
    const updatedRemainingEdits = await getRemainingPdfEdits(user.id)

    return NextResponse.json(
      {
        success: true,
        downloadUrl: publicUrl,
        ebookId: ebook.id,
        editCount: currentEditCount + 1,
        remainingEdits: updatedRemainingEdits,
      },
      { headers: response.headers }
    )
  } catch (error: any) {
    console.error('Generate PDF error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Server error',
        message: 'Une erreur inattendue est survenue lors de la génération du PDF.',
      },
      { status: 500 }
    )
  }
}
