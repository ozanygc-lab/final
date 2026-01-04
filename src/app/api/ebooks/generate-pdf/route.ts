import { createRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { generateEbookPDF } from '@/lib/pdf'
import { canEditEbook, getRemainingEdits, type PlanType } from '@/lib/permissions'

/**
 * POST route to generate PDF from ebook content
 * Only accessible if user has paid subscription (Pro or Single)
 * Blocks free Starter plan
 */
export async function POST(request: NextRequest) {
  // Check if OpenAI API key is configured (for potential content regeneration)
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: 'OpenAI API key not configured',
        message: 'La clé API OpenAI n\'est pas configurée.',
      },
      { status: 500 }
    )
  }

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

    // Verify user has PAID subscription (not free starter)
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)

    const subscription = subscriptions?.[0]

    if (!subscription) {
      return NextResponse.json(
        {
          error: 'Active subscription required',
          message: 'Un abonnement actif est requis pour générer des PDFs.',
        },
        { status: 403 }
      )
    }

    // Block free starter plan from generating PDFs
    if (subscription.plan_id === 'starter') {
      return NextResponse.json(
        {
          error: 'PDF generation not available',
          message: 'L\'export PDF n\'est pas disponible avec le plan Starter gratuit. Passez au plan Pro pour générer des PDFs.',
          requiresUpgrade: true,
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

    // Check if user can still edit (for free plan limits)
    const planType = subscription.plan_id as PlanType
    const editsUsed = ebook.edits_used || 0

    if (!canEditEbook(planType, editsUsed)) {
      const remaining = getRemainingEdits(planType, editsUsed)
      return NextResponse.json(
        {
          error: 'Edit limit reached',
          message: `Vous avez atteint la limite de modifications (${editsUsed}/5). Passez à l'abonnement Pro pour continuer.`,
          requiresUpgrade: true,
          editsUsed,
          maxEdits: 5,
        },
        { status: 403 }
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

    // Update ebook with PDF URL and increment edits_used
    const { error: updateError } = await supabase
      .from('ebooks')
      .update({
        pdf_url: publicUrl,
        edits_used: (editsUsed || 0) + 1,
      })
      .eq('id', ebook.id)

    if (updateError) {
      console.error('Ebook update error:', updateError)
      // Continue even if update fails - PDF is uploaded
    }

    // Save PDF path in ebook_assets table
    await supabase.from('ebook_assets').upsert({
      ebook_id: ebook.id,
      pdf_path: fileName,
      pdf_url: publicUrl,
    })

    return NextResponse.json(
      {
        downloadUrl: publicUrl,
        ebookId: ebook.id,
        editsUsed: (editsUsed || 0) + 1,
        remainingEdits: getRemainingEdits(planType, (editsUsed || 0) + 1),
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













