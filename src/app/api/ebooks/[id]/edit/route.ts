import { createRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserPlan, canEditPdf, incrementPdfEdits } from '@/lib/subscription'

/**
 * POST route to edit an existing ebook
 * Limits edits based on subscription plan
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const ebookId = params.id

    // Fetch ebook to verify ownership
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

    // Get user's plan and edits used
    const userPlanData = await getUserPlan(user.id)
    const userPlan = userPlanData?.plan || 'free'
    const editsUsed = userPlanData?.pdf_edits_used || 0

    // Check if user can edit PDF
    if (!canEditPdf(userPlan, editsUsed)) {
      const remaining = editsUsed >= 5 ? 0 : 5 - editsUsed
      return NextResponse.json(
        {
          error: 'EDIT_LIMIT_REACHED',
          message: `Vous avez atteint la limite de modifications (${editsUsed}/5). Passez au plan Pro pour des modifications illimitées.`,
          requiresUpgrade: true,
          editsUsed,
          maxEdits: 5,
          remainingEdits: remaining,
        },
        { status: 403 }
      )
    }

    // Get edit data from request body
    const { title, description, chapters } = await request.json()

    // Update ebook
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('ebooks')
        .update(updateData)
        .eq('id', ebookId)

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update ebook', message: 'Échec de la mise à jour de l\'ebook.' },
          { status: 500 }
        )
      }
    }

    // Update chapters if provided
    if (chapters && Array.isArray(chapters)) {
      // Delete existing chapters
      await supabase.from('chapters').delete().eq('ebook_id', ebookId)

      // Insert new chapters
      const chaptersData = chapters.map((chapter: any, index: number) => ({
        ebook_id: ebookId,
        title: chapter.title || `Chapitre ${index + 1}`,
        content: chapter.content || '',
        order_index: chapter.order_index ?? index,
      }))

      const { error: chaptersError } = await supabase
        .from('chapters')
        .insert(chaptersData)

      if (chaptersError) {
        console.error('Chapters update error:', chaptersError)
        // Continue anyway
      }
    }

    // Increment PDF edits count
    await incrementPdfEdits(user.id)

    return NextResponse.json(
      {
        success: true,
        message: 'Ebook mis à jour avec succès.',
        editsUsed: editsUsed + 1,
      },
      { headers: response.headers }
    )
  } catch (error: any) {
    console.error('Edit ebook error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Server error',
        message: 'Une erreur inattendue est survenue.',
      },
      { status: 500 }
    )
  }
}













