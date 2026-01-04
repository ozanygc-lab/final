import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles } from '@/components/icons'
import { getRemainingEdits, type PlanType } from '@/lib/permissions'

export default async function AppPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Récupérer les données en parallèle pour améliorer les performances
  const [subscriptionsResult, ebooksResult] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('ebooks')
      .select('edits_used')
      .eq('user_id', user.id),
  ])

  const subscription = subscriptionsResult.data?.[0]
  const ebooks = ebooksResult.data
  const totalEditsUsed = ebooks?.reduce((sum, ebook) => sum + (ebook.edits_used || 0), 0) || 0
  const planType = (subscription?.plan_id || 'starter') as PlanType
  const remainingEdits = getRemainingEdits(planType, totalEditsUsed)

  // Get plan display name
  const planNames: Record<PlanType, string> = {
    starter: 'Starter (Gratuit)',
    single: '1 Ebook',
    pro: 'Pro',
  }

  const planName = planNames[planType] || 'Starter'

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bienvenue ! 👋
          </h1>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Créez votre premier ebook avec notre IA
          </p>

          {/* Subscription Status */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Votre abonnement</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Plan:</span>
                <span className="font-semibold">{planName}</span>
              </div>
              {remainingEdits !== null && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Modifications restantes:</span>
                  <span className={`font-semibold ${remainingEdits === 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {remainingEdits}
                  </span>
                </div>
              )}
              {remainingEdits === null && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Modifications:</span>
                  <span className="font-semibold text-green-400">Illimitées</span>
                </div>
              )}
            </div>
          </div>

          {/* Create Ebook Button */}
          <Link
            href="/app/chat"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-indigo-500/20"
          >
            <Sparkles size={20} /> Créer mon ebook
          </Link>

          {/* Upgrade prompt if free plan and edits used */}
          {planType === 'starter' && totalEditsUsed >= 5 && (
            <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-yellow-400 font-semibold mb-2">
                Limite de modifications atteinte
              </p>
              <p className="text-slate-300 text-sm mb-4">
                Vous avez atteint la limite de 5 modifications. Passez au plan Pro pour continuer.
              </p>
              <Link
                href="/pricing"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                Passer au plan Pro
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
