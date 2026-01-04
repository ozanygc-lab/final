'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Pour débuter avec l\'IA',
    price: 0,
    period: '/mois',
    icon: '⚡',
    popular: false,
    features: [
      { text: '1 ebook', included: true },
      { text: '10 éditions/mois', included: true },
      { text: '1 génération PDF/mois', included: true },
      { text: '15% de commission', included: true },
      { text: 'Watermark "EbookAI"', included: true },
      { text: 'Support email', included: true },
    ],
    cta: 'Commencer gratuitement',
    ctaLink: '/login',
    isFree: true,
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Pour les créateurs réguliers',
    price: 10,
    period: '/mois',
    icon: '📚',
    popular: false,
    features: [
      { text: '5 ebooks', included: true },
      { text: '100 éditions/mois', included: true },
      { text: '10 générations PDF/mois', included: true },
      { text: '10% de commission', included: true },
      { text: 'Sans watermark', included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Templates premium', included: true },
    ],
    cta: 'Choisir Basic',
    ctaLink: '/login',
    isFree: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les professionnels',
    price: 49,
    period: '/mois',
    icon: '👑',
    popular: true,
    features: [
      { text: '20 ebooks', included: true },
      { text: '500 éditions/mois', included: true },
      { text: '50 générations PDF/mois', included: true },
      { text: '5% de commission', included: true },
      { text: 'Export multi-formats', included: true },
      { text: 'Publication directe', included: true },
      { text: 'Statistiques avancées', included: true },
      { text: 'API access', included: true },
      { text: 'Support 24/7', included: true },
    ],
    cta: 'Choisir Pro',
    ctaLink: '/login',
    isFree: false,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Pour les équipes',
    price: 149,
    period: '/mois',
    icon: '🏢',
    popular: false,
    features: [
      { text: 'Ebooks illimités', included: true },
      { text: 'Éditions illimitées', included: true },
      { text: 'Génération PDF illimitée', included: true },
      { text: '0% de commission', included: true },
      { text: '5 membres d\'équipe', included: true },
      { text: 'Branding personnalisé', included: true },
      { text: 'SSO & Sécurité avancée', included: true },
      { text: 'Account manager dédié', included: true },
      { text: 'Formation incluse', included: true },
      { text: 'SLA garanti', included: true },
    ],
    cta: 'Contacter les ventes',
    ctaLink: '/login',
    isFree: false,
  },
]

export default function PricingContent() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (plan: typeof plans[0]) => {
    setError(null)
    setLoading(plan.id)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push(`/login?redirect=/pricing`)
        return
      }

      if (plan.isFree) {
        const response = await fetch('/api/subscriptions/activate-free', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ planId: plan.id }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Une erreur est survenue')
          return
        }

        router.push('/app')
        return
      }

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: plan.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
        return
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Aucune URL de paiement reçue')
      }
    } catch (error: any) {
      console.error('Subscribe error:', error)
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-white">EbookAI</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-white/80 hover:text-white transition text-sm">
                Fonctionnalités
              </Link>
              <Link href="/pricing" className="text-white hover:text-white transition text-sm font-semibold">
                Tarifs
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
              >
                Connexion
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Tarifs simples et transparents
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
          Choisissez le plan adapté à vos besoins. Changez ou annulez à tout moment.
        </p>

        {/* Toggle Mensuel/Annuel (pour futur) */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-white font-semibold">Mensuel</span>
          <div className="relative inline-flex items-center">
            <input type="checkbox" className="sr-only peer" disabled />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-blue-600 opacity-50 cursor-not-allowed"></div>
          </div>
          <span className="text-white/60">Annuel</span>
          <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">Bientôt</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-600/20 to-blue-900/20 border-2 border-blue-500 shadow-xl shadow-blue-500/20'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {/* Badge Popular */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                    Populaire
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-2xl ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    : 'bg-white/10'
                }`}
              >
                {plan.icon}
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-blue-200 mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">{plan.price}€</span>
                  <span className="text-white/60">{plan.period}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading !== null}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition mb-8 disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {loading === plan.id ? 'Traitement...' : plan.cta}
              </button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        feature.included ? 'text-blue-400' : 'text-white/30'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className={feature.included ? 'text-white' : 'text-white/40'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Questions fréquentes
          </h2>
          <div className="space-y-6">
            <details className="bg-white/5 border border-white/10 rounded-lg p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex justify-between items-center">
                Puis-je changer de plan à tout moment ?
                <svg
                  className="w-5 h-5 text-white/60 group-open:rotate-180 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 text-sm">
                Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les changements sont
                appliqués immédiatement et vous êtes facturé au prorata.
              </p>
            </details>

            <details className="bg-white/5 border border-white/10 rounded-lg p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex justify-between items-center">
                Comment fonctionnent les commissions ?
                <svg
                  className="w-5 h-5 text-white/60 group-open:rotate-180 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 text-sm">
                Nous prenons une petite commission sur chaque vente d'ebook. Le taux dépend de votre plan : 15%
                (Starter), 10% (Basic), 5% (Pro), 0% (Business). Les frais Stripe s'appliquent en plus.
              </p>
            </details>

            <details className="bg-white/5 border border-white/10 rounded-lg p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex justify-between items-center">
                Que se passe-t-il si je dépasse mes limites ?
                <svg
                  className="w-5 h-5 text-white/60 group-open:rotate-180 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 text-sm">
                Vous serez invité à passer à un plan supérieur. Vos ebooks existants restent accessibles, mais
                vous ne pourrez pas créer/éditer/générer de nouveaux contenus jusqu'au passage à un plan
                supérieur ou le prochain cycle de facturation.
              </p>
            </details>

            <details className="bg-white/5 border border-white/10 rounded-lg p-6 group">
              <summary className="text-white font-semibold cursor-pointer list-none flex justify-between items-center">
                Puis-je annuler mon abonnement ?
                <svg
                  className="w-5 h-5 text-white/60 group-open:rotate-180 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-white/70 text-sm">
                Oui, vous pouvez annuler à tout moment depuis votre dashboard. Vous conserverez l'accès jusqu'à
                la fin de votre période de facturation. Aucun remboursement n'est accordé pour les périodes
                partielles.
              </p>
            </details>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à créer vos ebooks IA ?
          </h2>
          <p className="text-lg text-blue-200 mb-8">
            Commencez gratuitement, aucune carte bancaire requise
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-blue-500/50 transition"
          >
            <span className="text-2xl">🚀</span>
            Essai gratuit
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2025 EbookAI. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-white/60 hover:text-white transition">
                CGU
              </Link>
              <Link href="#" className="text-white/60 hover:text-white transition">
                Confidentialité
              </Link>
              <Link href="#" className="text-white/60 hover:text-white transition">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}









