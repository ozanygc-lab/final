'use client'

import { useState } from 'react'
import type { Ebook } from '@/lib/types/database'

interface BuyButtonProps {
  ebook: Ebook
  pdfUrl?: string | null
}

export default function BuyButton({ ebook, pdfUrl }: BuyButtonProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleBuy = async () => {
    if (!pdfUrl) {
      alert('PDF non disponible')
      return
    }

    // Si gratuit, télécharger directement
    if (ebook.price_cents === 0) {
      if (!showEmailInput) {
        setShowEmailInput(true)
        return
      }

      if (!email) {
        alert('Entrez votre email')
        return
      }

      setLoading(true)
      try {
        const response = await fetch('/api/ebook/free-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ebookId: ebook.id, email }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erreur')
        }

        // Afficher le message et le lien de téléchargement
        alert(data.message || 'Email envoyé !')
        setDownloadUrl(data.pdfUrl)
        setEmail('')
      } catch (error: any) {
        alert(`Erreur : ${error.message}`)
      } finally {
        setLoading(false)
      }
      return
    }

    // Si payant, rediriger vers Stripe Checkout
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ebookId: ebook.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur')
      }

      window.location.href = data.url
    } catch (error: any) {
      alert(error.message)
      setLoading(false)
    }
  }

  const priceEuros = ebook.price_cents / 100

  // Si le lien de téléchargement est disponible
  if (downloadUrl) {
    return (
      <div className="w-full sm:w-auto space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-semibold mb-2">✅ Prêt à télécharger !</p>
          <p className="text-sm text-green-700 mb-3">Vérifiez aussi votre email (et les spams)</p>
        </div>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition text-center"
        >
          📥 Télécharger le PDF
        </a>
        <button
          onClick={() => {
            setDownloadUrl(null)
            setShowEmailInput(false)
          }}
          className="w-full text-sm text-gray-600 hover:text-gray-900"
        >
          ← Retour
        </button>
      </div>
    )
  }

  if (ebook.price_cents === 0 && showEmailInput) {
    return (
      <div className="w-full sm:w-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleBuy}
          disabled={loading || !email}
          className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Envoi...' : '📧 Recevoir le PDF'}
        </button>
        <button
          onClick={() => setShowEmailInput(false)}
          className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading || !pdfUrl}
      className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-lg hover:shadow-xl"
    >
      {loading ? (
        'Chargement...'
      ) : priceEuros === 0 ? (
        '📥 Télécharger gratuitement'
      ) : (
        `💳 Acheter pour ${priceEuros.toFixed(2)}€`
      )}
    </button>
  )
}
