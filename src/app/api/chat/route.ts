import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

/**
 * POST route for AI chat
 * Server-only implementation using OpenAI SDK
 * 
 * Accepts either:
 * - { message: string } - Single message
 * - { messages: Array } - Conversation history (for compatibility)
 */
export async function POST(request: NextRequest) {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: 'OpenAI API key not configured',
        message: 'La clé API OpenAI n\'est pas configurée. Veuillez ajouter OPENAI_API_KEY dans votre fichier .env.local',
      },
      { status: 500 }
    )
  }

  try {
    // Read request body
    const body = await request.json()

    // Support both single message and messages array
    let conversationMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = []

    // Enhanced system prompt for natural, human-like conversation
    const systemPrompt = `Tu es un assistant éditorial qui discute naturellement avec les utilisateurs pour développer leurs idées d'ebook.

TON STYLE DE COMMUNICATION :
- Parle comme un humain, de manière naturelle et conversationnelle
- Utilise des réparties spontanées : "Ah ça c'est un détail qui change tout !", "Parfait, merci pour les détails", "Intéressant !", "Ah oui je vois", "C'est noté", "Super point !"
- Réagis aux informations données par l'utilisateur avec enthousiasme et curiosité
- Pose des questions de suivi naturelles basées sur ce qu'il vient de dire
- Utilise des emojis avec parcimonie (1-2 par message max) pour garder un ton naturel
- Sois concis (2-3 phrases max) sauf si l'utilisateur demande plus de détails
- Utilise des sauts de ligne pour aérer quand nécessaire

TON RÔLE :
1. ÉCOUTER activement ce que dit l'utilisateur et réagir naturellement
2. POSER maximum 3-4 questions au début pour comprendre l'idée, puis passer à la validation
3. VALIDER les bonnes idées avec des réparties naturelles
4. SUGGÉRER des améliorations de manière conversationnelle, pas comme un coach
5. Après 3-4 échanges, commencer à structurer l'idée et proposer de générer l'ebook

EXEMPLES DE TON :
- "Ah ça c'est un détail qui change tout ! Ça va vraiment renforcer votre positionnement. 📚"
- "Parfait, merci pour les détails. Du coup, qui est votre audience principale ?"
- "Intéressant ! Et vous avez déjà pensé à la structure ?"
- "Ah oui je vois, c'est un angle original. Ça va se démarquer !"
- "Super point ! Ça va rendre votre ebook vraiment actionnable."

RÈGLES STRICTES :
- Ne génère JAMAIS le contenu complet de l'ebook
- Ne crée JAMAIS de chapitres entiers
- Reste dans le rôle de conversation naturelle, pas de coach formel
- Guide vers la génération payante sans donner le contenu`

    if (body.message && typeof body.message === 'string') {
      // Single message format
      conversationMessages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: body.message,
        },
      ]
    } else if (body.messages && Array.isArray(body.messages)) {
      // Messages array format (for conversation history)
      conversationMessages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...body.messages.map((msg: { role: string; content: string }) => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content,
        })),
      ]
    } else {
      return NextResponse.json(
        { error: 'Message or messages array is required' },
        { status: 400 }
      )
    }

    // Initialize OpenAI client using the SDK on the server
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Get model from environment variable, fallback to gpt-4o-mini
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: conversationMessages,
      temperature: 0.9, // Higher temperature for more natural, varied responses
      max_tokens: 250, // Shorter messages for natural conversation
    })

    // Extract AI response
    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        {
          error: 'No response from AI',
          message: 'Aucune réponse de l\'IA. Veuillez réessayer.',
        },
        { status: 500 }
      )
    }

    // Return AI response as JSON
    return NextResponse.json({
      message: aiResponse,
    })
  } catch (error: any) {
    console.error('Chat API error:', error)

    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        {
          error: 'Invalid OpenAI API key',
          message: 'La clé API OpenAI n\'est pas valide. Veuillez vérifier votre configuration.',
        },
        { status: 401 }
      )
    }

    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Limite de taux dépassée. Veuillez patienter quelques instants avant de réessayer.',
        },
        { status: 429 }
      )
    }

    return NextResponse.json(
      {
        error: error.message || 'An error occurred',
        message: 'Une erreur est survenue lors de la communication avec l\'IA. Veuillez réessayer.',
      },
      { status: 500 }
    )
  }
}
