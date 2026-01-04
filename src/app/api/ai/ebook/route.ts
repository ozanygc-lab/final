import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { getUserPlan, canGeneratePdf } from '@/lib/subscription'

/**
 * POST API route to generate ebook content using AI
 * PAYWALL: Only subscribed users can generate ebooks
 */
export async function POST(request: NextRequest) {
  // Check if OpenAI API key is configured
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

    // Check user's subscription plan
    const userPlanData = await getUserPlan(user.id)
    const userPlan = userPlanData?.plan || 'free'

    // PAYWALL: Check if user can generate PDF
    if (!canGeneratePdf(userPlan)) {
      return NextResponse.json(
        {
          error: 'PAYMENT_REQUIRED',
          message: 'Un abonnement est requis pour générer des ebooks. Passez à un plan Basic ou Pro.',
          requiresUpgrade: true,
        },
        { status: 403 }
      )
    }

    // Read user idea from request body
    const { idea, chatHistory } = await request.json()

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json(
        { error: 'Idea is required', message: 'Une idée d\'ebook est requise.' },
        { status: 400 }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    // Build prompt from chat history and idea
    const systemPrompt = `Tu es un expert en rédaction d'ebooks. Génère un ebook complet et structuré basé sur l'idée de l'utilisateur.

Retourne UNIQUEMENT du JSON valide, sans markdown, sans blocs de code.

Format JSON requis:
{
  "title": "Titre de l'ebook",
  "description": "Description détaillée de l'ebook",
  "chapters": [
    {
      "title": "Titre du chapitre",
      "content": "Contenu complet du chapitre (minimum 500 mots, prêt à publier)",
      "order_index": 0
    }
  ]
}

Génère au moins 5 chapitres avec du contenu complet et de qualité.`

    const userPrompt = `Idée de l'utilisateur: ${idea}

${chatHistory ? `Historique de conversation:\n${JSON.stringify(chatHistory)}` : ''}

Génère un ebook complet basé sur cette idée.`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        {
          error: 'No response from AI',
          message: 'Aucune réponse de l\'IA. Veuillez réessayer.',
        },
        { status: 500 }
      )
    }

    // Parse JSON response
    let ebookData
    try {
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
      ebookData = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        {
          error: 'Failed to parse AI response',
          message: 'Erreur lors de l\'analyse de la réponse de l\'IA.',
        },
        { status: 500 }
      )
    }

    // Create ebook in database
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .insert({
        user_id: user.id,
        title: ebookData.title || 'Mon Ebook',
        description: ebookData.description || '',
        status: 'draft',
      })
      .select()
      .single()

    if (ebookError || !ebook) {
      console.error('Ebook creation error:', ebookError)
      return NextResponse.json(
        {
          error: 'Failed to create ebook',
          message: 'Échec de la création de l\'ebook dans la base de données.',
        },
        { status: 500 }
      )
    }

    // Create chapters
    if (ebookData.chapters && Array.isArray(ebookData.chapters)) {
      const chapters = ebookData.chapters.map((chapter: any, index: number) => ({
        ebook_id: ebook.id,
        title: chapter.title || `Chapitre ${index + 1}`,
        content: chapter.content || '',
        order_index: chapter.order_index ?? index,
      }))

      const { error: chaptersError } = await supabase
        .from('chapters')
        .insert(chapters)

      if (chaptersError) {
        console.error('Chapters error:', chaptersError)
        // Continue even if chapters fail - ebook is created
      }
    }

    // Return ebook data
    return NextResponse.json(
      {
        ebookId: ebook.id,
        title: ebook.title,
        description: ebook.description,
        message: 'Ebook créé avec succès.',
      },
      { headers: response.headers }
    )
  } catch (error: any) {
    console.error('Generate ebook error:', error)
    return NextResponse.json(
      {
        error: error.message || 'Server error',
        message: 'Une erreur inattendue est survenue.',
      },
      { status: 500 }
    )
  }
}













