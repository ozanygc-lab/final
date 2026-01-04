import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import slugify from 'slugify'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const generateEbookSchema = z.object({
  prompt: z.string().min(10, 'Le prompt doit contenir au moins 10 caractères'),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  goal: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier le plan et les limites
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', user.id)
      .single()

    const { count: ebookCount } = await supabase
      .from('ebooks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Limites par plan (MVP: Free uniquement)
    const limits = {
      free: 1,
      basic: 5,
      pro: 20,
      business: 999999,
    }

    const planType = subscription?.plan_type || 'free'
    const maxEbooks = limits[planType as keyof typeof limits]

    if ((ebookCount || 0) >= maxEbooks) {
      return NextResponse.json(
        { error: `Limite atteinte : ${maxEbooks} ebook(s) maximum pour le plan ${planType}` },
        { status: 403 }
      )
    }

    // Valider les données
    const body = await request.json()
    const validatedData = generateEbookSchema.parse(body)

    // Construire le prompt système
    const systemPrompt = `Tu es un expert en création de contenu éducatif et d'ebooks. 
Tu dois générer un ebook complet et structuré en français.

Format de réponse OBLIGATOIRE (JSON strict) :
{
  "title": "Titre accrocheur de l'ebook",
  "description": "Description courte de 2-3 phrases",
  "chapters": [
    {
      "title": "Titre du chapitre 1",
      "content": "Contenu complet du chapitre en Markdown (minimum 300 mots)"
    },
    {
      "title": "Titre du chapitre 2",
      "content": "Contenu complet du chapitre en Markdown (minimum 300 mots)"
    }
  ]
}

Règles :
- Minimum 5 chapitres
- Maximum 10 chapitres
- Chaque chapitre doit faire minimum 300 mots
- Utilise Markdown pour la mise en forme (titres, listes, gras, italique)
- Le contenu doit être actionnable et de qualité
- Adapte le ton selon la demande de l'utilisateur`

    const userPrompt = `Génère un ebook sur le sujet suivant :

Sujet : ${validatedData.prompt}
${validatedData.targetAudience ? `Public cible : ${validatedData.targetAudience}` : ''}
${validatedData.tone ? `Ton souhaité : ${validatedData.tone}` : ''}
${validatedData.goal ? `Objectif : ${validatedData.goal}` : ''}

Réponds UNIQUEMENT avec le JSON demandé, sans texte avant ou après.`

    // Appeler OpenAI
    // Utiliser le modèle depuis la variable d'environnement ou gpt-4o-mini par défaut
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('Aucune réponse de l\'IA')
    }

    const ebookData = JSON.parse(content)

    // Validation du format de réponse
    if (!ebookData.title || !ebookData.chapters || ebookData.chapters.length < 5) {
      throw new Error('Format de réponse invalide de l\'IA')
    }

    // Générer un slug unique
    let baseSlug = slugify(ebookData.title, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1

    while (true) {
      const { data: existing } = await supabase
        .from('ebooks')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Créer l'ebook dans la DB
    const { data: ebook, error: ebookError } = await supabase
      .from('ebooks')
      .insert({
        user_id: user.id,
        title: ebookData.title,
        description: ebookData.description || null,
        slug,
        status: 'draft',
        price_cents: 0,
        generation_prompt: validatedData.prompt,
        ai_metadata: {
          targetAudience: validatedData.targetAudience,
          tone: validatedData.tone,
          goal: validatedData.goal,
        },
      })
      .select()
      .single()

    if (ebookError) throw ebookError

    // Créer les chapitres
    const chaptersToInsert = ebookData.chapters.map((chapter: any, index: number) => ({
      ebook_id: ebook.id,
      title: chapter.title,
      content: chapter.content,
      position: index,
      word_count: chapter.content.split(/\s+/).length,
    }))

    const { error: chaptersError } = await supabase
      .from('chapters')
      .insert(chaptersToInsert)

    if (chaptersError) throw chaptersError

    return NextResponse.json({
      success: true,
      ebook: {
        id: ebook.id,
        title: ebook.title,
        slug: ebook.slug,
      },
    })
  } catch (error: any) {
    console.error('Error generating ebook:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération' },
      { status: 500 }
    )
  }
}
