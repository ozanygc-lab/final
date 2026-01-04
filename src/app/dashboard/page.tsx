import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Plus, Sparkles, Eye, Users, DollarSign, FileText, BarChart3, Clock, Edit, Trash2, ExternalLink, MoreVertical } from '@/components/icons'
import { Button } from '@/components/ui/button'
import DashboardLayout from '@/components/DashboardLayout'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Récupérer les ebooks et le plan en parallèle
  const [ebooksResult, subscriptionResult] = await Promise.all([
    supabase
      .from('ebooks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('user_id', user.id)
      .maybeSingle()
  ])

  const ebooks = ebooksResult.data || []
  const planType = subscriptionResult.data?.plan_id || 'free'
  
  // Calculer les statistiques
  const totalRevenue = ebooks.reduce((sum, ebook) => sum + (ebook.total_revenue_cents || 0), 0) / 100
  const totalSales = ebooks.reduce((sum, ebook) => sum + (ebook.total_sales || 0), 0)
  const totalViews = ebooks.reduce((sum, ebook) => sum + (ebook.total_sales || 0), 0) // Utilisons total_sales comme proxy pour les vues
  const publishedCount = ebooks.filter(ebook => ebook.status === 'published').length

  // Limite d'ebooks par plan
  const planLimits: Record<string, number> = {
    free: 1,
    starter: 1,
    basic: 10,
    pro: 50,
    business: 999999,
  }
  const maxEbooks = planLimits[planType] || 1
  const remainingEbooks = Math.max(0, maxEbooks - ebooks.length)

  const stats = [
    { label: "Total Ebooks", value: ebooks.length.toString(), icon: BookOpen, color: "neon-indigo", change: `+${publishedCount} publiés` },
    { label: "Vues totales", value: totalViews.toLocaleString('fr-FR'), icon: Eye, color: "neon-blue", change: "+12%" },
    { label: "Lecteurs", value: totalSales.toLocaleString('fr-FR'), icon: Users, color: "neon-emerald", change: "+8%" },
    { label: "Revenus", value: `${totalRevenue.toFixed(2)}€`, icon: DollarSign, color: "neon-indigo", change: "+23%" }
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Gérez vos ebooks et suivez vos performances</p>
        </div>
        <Button asChild className="h-12 px-6 font-semibold bg-gradient-to-r from-neon-indigo to-neon-blue hover:from-neon-blue hover:to-neon-emerald transition-all duration-500">
          <Link href="/dashboard/generate">
            <Plus className="w-5 h-5 mr-2" />
            Nouvel Ebook
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5 group hover:border-neon-indigo/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}/20 border border-${stat.color}/30 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <span className="text-xs text-neon-emerald bg-neon-emerald/10 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold tracking-tighter mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold tracking-tighter mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-indigo" />
            Actions rapides
          </h2>
          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start h-12 border-glass-border/50 bg-glass/30 hover:bg-glass/50 hover:border-neon-indigo/50">
              <Link href="/dashboard/generate">
                <Plus className="w-4 h-4 mr-3 text-neon-indigo" />
                Générer un ebook
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12 border-glass-border/50 bg-glass/30 hover:bg-glass/50 hover:border-neon-blue/50">
              <Link href="/app/chat">
                <FileText className="w-4 h-4 mr-3 text-neon-blue" />
                Discuter avec l'IA
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12 border-glass-border/50 bg-glass/30 hover:bg-glass/50 hover:border-neon-emerald/50">
              <Link href="/pricing">
                <BarChart3 className="w-4 h-4 mr-3 text-neon-emerald" />
                Voir les stats
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold tracking-tighter mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-neon-blue" />
            Activité récente
          </h2>
          <div className="space-y-4">
            {ebooks.slice(0, 3).map((ebook: any, i: number) => (
              <div key={ebook.id} className="flex items-center gap-4 p-3 rounded-lg bg-glass/30 border border-glass-border/30">
                <div className={`w-8 h-8 rounded-lg bg-neon-indigo/20 border border-neon-indigo/30 flex items-center justify-center`}>
                  <BookOpen className={`w-4 h-4 text-neon-indigo`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{ebook.status === 'published' ? 'Ebook publié' : 'Ebook créé'}</p>
                  <p className="text-xs text-muted-foreground">{ebook.title}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(ebook.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            ))}
            {ebooks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Aucune activité récente</p>
            )}
          </div>
        </div>
      </div>

      {/* Ebooks List */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tighter flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neon-indigo" />
            Mes Ebooks
          </h2>
          <Link href="/dashboard/ebooks" className="text-sm text-neon-indigo hover:text-neon-blue transition-colors">
            Voir tout →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Ebook</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Vues</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Ventes</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ebooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <p>Aucun ebook pour le moment</p>
                    <div className="mt-4">
                      <Button asChild>
                        <Link href="/dashboard/generate">
                          <Plus className="w-4 h-4 mr-2" />
                          Créer un ebook
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                ebooks.map((ebook: any) => (
                  <tr key={ebook.id} className="border-b border-glass-border/30 hover:bg-glass/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📘</span>
                        <span className="font-medium">{ebook.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ebook.status === 'published' 
                          ? 'bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/30' 
                          : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                      }`}>
                        {ebook.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{ebook.total_sales || 0}</td>
                    <td className="py-4 px-4 text-muted-foreground">{ebook.total_sales || 0}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Link href={`/dashboard/ebooks/${ebook.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        {ebook.status === 'published' && (
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" asChild>
                            <Link href={`/ebook/${ebook.slug}`} target="_blank">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
