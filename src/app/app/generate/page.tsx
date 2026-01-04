'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Loader2 } from '@/components/icons'
import UpgradeModal from '@/components/UpgradeModal'

export default function GeneratePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [editsInfo, setEditsInfo] = useState<{ used: number; max: number } | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setDownloadUrl(null)

    try {
      // First, generate ebook content (free)
      const generateResponse = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: 'Générer mon ebook',
          chatHistory: [],
        }),
      })

      const generateData = await generateResponse.json()

      if (!generateResponse.ok) {
        throw new Error(generateData.message || generateData.error || 'Erreur lors de la génération')
      }

      // Then, generate PDF (paid only)
      const pdfResponse = await fetch('/api/ebooks/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ebookId: generateData.ebookId,
        }),
      })

      const pdfData = await pdfResponse.json()

      if (!pdfResponse.ok) {
        // Check if it's an upgrade required error
        if (pdfData.requiresUpgrade) {
          setEditsInfo({
            used: pdfData.editsUsed || 0,
            max: pdfData.maxEdits || 5,
          })
          setShowUpgradeModal(true)
          return
        }
        throw new Error(pdfData.message || pdfData.error || 'Erreur lors de la génération du PDF')
      }

      if (pdfData.downloadUrl) {
        setDownloadUrl(pdfData.downloadUrl)
      }
    } catch (err: any) {
      console.error('Generate error:', err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Générer votre ebook
          </h1>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Votre idée a été affinée. Cliquez sur le bouton pour générer votre ebook complet.
          </p>

          {!downloadUrl && !isGenerating && (
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-indigo-500/20"
            >
              Générer mon ebook
            </button>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} />
              <p className="text-slate-400">Génération en cours...</p>
            </div>
          )}

          {downloadUrl && (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-green-500/20 border border-green-500 rounded-xl p-6">
                <p className="text-green-400 font-semibold mb-4">
                  Votre ebook est prêt ! 🎉
                </p>
                <a
                  href={downloadUrl}
                  download
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Download size={20} /> Télécharger le PDF
                </a>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500 rounded-xl p-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        editsUsed={editsInfo?.used || 0}
        maxEdits={editsInfo?.max || 5}
      />
    </div>
  )
}

