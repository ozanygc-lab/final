import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header avec navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <span className="text-2xl font-bold text-gray-900">EbookAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition font-medium">
                Tarifs
              </Link>
              <Link
                href="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Créez vos ebooks IA en quelques clics
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Notre IA révolutionne la création de contenu. Générez des ebooks professionnels, optimisés et prêts à publier en quelques minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Commencer gratuitement →
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Voir les tarifs
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold text-blue-600">12K+</div>
              <div className="text-sm text-gray-600 mt-1">Ebooks créés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">5K+</div>
              <div className="text-sm text-gray-600 mt-1">Auteurs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">98%</div>
              <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          L'IA au service de l'édition
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-bold text-xl mb-3">Génération IA</h3>
            <p className="text-gray-600">
              Décrivez votre idée, l'IA génère un ebook structuré et complet avec plusieurs chapitres
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">✏️</div>
            <h3 className="font-bold text-xl mb-3">Édition simple</h3>
            <p className="text-gray-600">
              Modifiez le contenu, réorganisez les chapitres à votre guise avec notre éditeur intuitif
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-bold text-xl mb-3">Vente directe</h3>
            <p className="text-gray-600">
              Publiez et vendez votre ebook avec paiement Stripe intégré. Encaissez directement.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à créer votre premier ebook ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Commencez gratuitement, aucune carte bancaire requise
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Essai gratuit 🚀
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📚</span>
                <span className="text-xl font-bold">EbookAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                La plateforme IA pour créer et vendre vos ebooks en quelques minutes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/pricing" className="hover:text-white transition">Tarifs</Link></li>
                <li><Link href="#" className="hover:text-white transition">Fonctionnalités</Link></li>
                <li><Link href="#" className="hover:text-white transition">Démo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">À propos</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">CGU</Link></li>
                <li><Link href="#" className="hover:text-white transition">Confidentialité</Link></li>
                <li><Link href="#" className="hover:text-white transition">Mentions légales</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 EbookAI. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
