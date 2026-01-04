import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier que l'ebook existe et appartient à l'utilisateur
    const { data: ebook, error: fetchError } = await supabase
      .from('ebooks')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !ebook) {
      console.error('Ebook fetch error:', fetchError)
      return NextResponse.json({ error: 'Ebook non trouvé' }, { status: 404 })
    }

    // Vérifier qu'un PDF existe
    const { data: pdfAsset } = await supabase
      .from('ebook_assets')
      .select('id')
      .eq('ebook_id', id)
      .eq('type', 'pdf')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!pdfAsset) {
      return NextResponse.json(
        { error: 'Vous devez générer un PDF avant de publier' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut
    const { error: updateError } = await supabase
      .from('ebooks')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: `Erreur de mise à jour: ${updateError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur inconnue' },
      { status: 500 }
    )
  }
}

