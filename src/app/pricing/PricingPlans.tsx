'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from '@/components/icons'
import { supabase } from '@/lib/supabase/client'

const PLANS = [
  {
    id: 'single',
    name: '1 Ebook',
    price: 1,
    period: 'une seule fois',
    features: [
      'Génération de 1 ebook',
      'Contenu généré par IA',
      'Export PDF inclus',
      'Support par email',
    ],
    popular: false,
    isOneTime: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'gratuit',
    features: [
      'Génération illimitée d\'ebooks',
      'Contenu généré par IA',
      'Chat avec l\'IA pour développer vos idées',
      'Pas d\'export PDF (passez au plan Pro)',
    ],
    popular: false,
    isOneTime: false,
    isFree: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: 'mois',
    features: [
      'Tout du plan Starter',
      'Génération prioritaire',
      'Support prioritaire',
      'Branding personnalisé',
      'Analytics avancés',
    ],
    popular: true,
    isOneTime: false,
  },
]

export default function PricingPlans() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubscribe = async (planId: string) => {
    setError(null)
    setLoading(planId)
    
    try {
      // Check if user is authenticated
      // supabase client is already imported
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Redirect to login with return URL
        router.push(`/login?redirect=/pricing`)
        return
      }

      // Check if this is the free starter plan
      const plan = PLANS.find(p => p.id === planId)
      if (plan?.isFree) {
        // Activate free plan directly without Stripe
        const response = await fetch('/api/subscriptions/activate-free', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ planId }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Une erreur est survenue')
          return
        }

        // Redirect to app
        router.push('/app')
        return
      }

      // User is authenticated, proceed with checkout for paid plans
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Une erreur est survenue')
        return
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        setError('Aucune URL de paiement reçue')
      }
    } catch (error: any) {
      console.error('Subscribe error:', error)
      setError(error.message || 'Une erreur est survenue lors de la connexion à Stripe')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-8">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`relative border-2 rounded-2xl p-8 ${
            plan.popular
              ? 'border-indigo-600 shadow-lg shadow-indigo-500/20 bg-slate-800/50'
              : 'border-slate-700 bg-slate-800/30'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Populaire
              </span>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-2">
              {plan.isFree ? (
                <span className="text-5xl font-bold">Gratuit</span>
              ) : (
                <>
                  <span className="text-5xl font-bold">{plan.price}€</span>
                  {plan.period && (
                    <span className="text-slate-400">/{plan.period}</span>
                  )}
                </>
              )}
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe(plan.id)}
            disabled={loading !== null}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              plan.popular
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading === plan.id
              ? 'Traitement...'
              : plan.isFree
              ? 'Activer gratuitement'
              : plan.isOneTime
              ? 'Acheter'
              : "S'abonner"}
          </button>
        </div>
      ))}
      </div>
    </div>
  )
}

