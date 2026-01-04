import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BuyButton from './BuyButton'

export const revalidate = 60 // Cache 1 minute

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PublicEbookPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  // Récupérer l'ebook publié
  const { data: ebook } = await supabase
    .from('ebooks')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!ebook) {
    notFound()
  }

  // Récupérer les données en parallèle
  const [chaptersResult, pdfAssetResult] = await Promise.all([
    supabase
      .from('chapters')
      .select('title, position')
      .eq('ebook_id', ebook.id)
      .order('position', { ascending: true }),
    supabase
      .from('ebook_assets')
      .select('*')
      .eq('ebook_id', ebook.id)
      .eq('type', 'pdf')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const chapters = chaptersResult.data
  const pdfAsset = pdfAssetResult.data

  const priceEuros = ebook.price_cents / 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-gray-900 font-bold text-xl">
            Marketing Digital AI
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white">
            <div className="max-w-2xl">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">
                📚 Ebook
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {ebook.title}
              </h1>
              {ebook.description && (
                <p className="text-xl text-blue-100 leading-relaxed">
                  {ebook.description}
                </p>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="p-12">
            {/* Disclaimer IA */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-3">
              <div className="text-2xl">🤖</div>
              <div className="flex-1 text-sm">
                <p className="font-semibold text-blue-900 mb-1">
                  Contenu généré avec l'assistance d'une IA
                </p>
                <p className="text-blue-800">
                  Cet ebook a été créé avec l'assistance d'une intelligence artificielle générative
                  et validé par son auteur.
                </p>
              </div>
            </div>

            {/* Table des matières */}
            {chapters && chapters.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Table des matières
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ol className="space-y-2">
                    {chapters.map((chapter, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="font-semibold text-blue-600 min-w-[2rem]">
                          {idx + 1}.
                        </span>
                        <span className="text-gray-700">{chapter.title}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {chapters?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Chapitres</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">PDF</div>
                <div className="text-sm text-gray-600">Format</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {ebook.total_sales}
                </div>
                <div className="text-sm text-gray-600">Ventes</div>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {priceEuros === 0 ? 'Gratuit' : `${priceEuros.toFixed(2)}€`}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Accès immédiat • PDF téléchargeable
                  </p>
                </div>
                <BuyButton ebook={ebook} pdfUrl={pdfAsset?.file_url} />
              </div>
            </div>

            {/* Garantie */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>✅</span>
                <span>Paiement sécurisé par Stripe</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                <span>✅</span>
                <span>Livraison immédiate par email</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Propulsé par{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              Marketing Digital AI
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

