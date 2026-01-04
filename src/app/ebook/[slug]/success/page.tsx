import Link from 'next/link'
import { CheckCircle2, Download, ArrowRight } from '@/components/icons'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle2 size={40} />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Paiement Réussi !</h1>
      <p className="text-slate-600 max-w-md mb-8">
        Merci pour votre achat. Votre ebook est prêt et a été envoyé par email.
        Vérifiez votre boîte de réception (et les spams).
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="bg-indigo-600 gap-2 h-12 px-8">
          <Download size={18} /> Télécharger maintenant
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" className="gap-2 h-12 px-8 border-slate-300">
            Retour au Dashboard <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
