import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EbookEditor from './EbookEditor'
import DashboardLayout from '@/components/DashboardLayout'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EbookEditorPage({ params }: PageProps) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Récupérer l'ebook
  const { data: ebook, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !ebook) {
    notFound()
  }

  return (
    <DashboardLayout>
      <EbookEditor ebook={ebook} />
    </DashboardLayout>
  )
}









