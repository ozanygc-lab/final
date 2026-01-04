import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BuyButton from './BuyButton'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: PageProps) {
  const supabase = await createServerClient()

  const { data: ebook, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (error || !ebook) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {ebook.title}
            </h1>

            {ebook.description && (
              <p className="text-lg text-gray-600 mb-8">{ebook.description}</p>
            )}

            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {ebook.price ? `${ebook.price.toFixed(2)} €` : 'Free'}
                </span>
              </div>

              <BuyButton ebookId={ebook.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
