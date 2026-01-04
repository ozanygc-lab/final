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

    const { error } = await supabase
      .from('ebooks')
      .update({ status: 'draft' })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Unpublish error:', error)
      return NextResponse.json(
        { error: error.message || 'Erreur' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Unpublish error:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur inconnue' },
      { status: 500 }
    )
  }
}

