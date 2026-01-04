import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BookOpen, ShoppingCart, Download, Star, Users, FileText, Clock, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EbookProduct = () => {
  const { slug } = useParams();
  const [email, setEmail] = useState("");

  // Mock ebook data
  const ebook = {
    title: "Maîtriser l'Intelligence Artificielle",
    subtitle: "Guide complet pour les entrepreneurs",
    author: "Marie Dupont",
    price: 27,
    isFree: false,
    rating: 4.8,
    reviews: 124,
    readers: 2847,
    pages: 156,
    readTime: "4h",
    cover: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop",
    description: "Découvrez comment l'IA peut transformer votre business. Ce guide pratique vous accompagne étape par étape dans l'intégration des outils d'intelligence artificielle dans votre activité professionnelle.",
    chapters: [
      "Introduction à l'IA pour les entrepreneurs",
      "Les fondamentaux du Machine Learning",
      "Outils pratiques pour votre business",
      "Automatiser vos processus",
      "Créer du contenu avec l'IA",
      "Analyse de données simplifiée",
      "Éthique et bonnes pratiques",
      "Cas d'études concrets"
    ],
    tags: ["IA", "Business", "Entrepreneuriat", "Technologie"]
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Navbar />
      
      <main className="relative pt-32 pb-24">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-indigo w-[600px] h-[600px] -top-40 -left-40" />
          <div className="orb orb-blue w-[400px] h-[400px] top-1/2 -right-40" style={{ animationDelay: "-2s" }} />
          <div className="orb orb-emerald w-[300px] h-[300px] bottom-0 left-1/3" style={{ animationDelay: "-4s" }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--glass-border)/0.1)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--glass-border)/0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-neon-indigo transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/ebooks" className="hover:text-neon-indigo transition-colors">Ebooks</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{ebook.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Cover */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-indigo to-neon-blue rounded-2xl blur-2xl opacity-30" />
                  <div className="relative glass-card p-4">
                    <img
                      src={ebook.cover}
                      alt={ebook.title}
                      className="w-full rounded-xl shadow-2xl"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {ebook.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-glass/50 border border-glass-border/50 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2">
              {/* Title Section */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4">
                  {ebook.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-4">{ebook.subtitle}</p>
                <p className="text-sm text-muted-foreground">Par <span className="text-neon-indigo">{ebook.author}</span></p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(ebook.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{ebook.rating}</span>
                  <span className="text-sm text-muted-foreground">({ebook.reviews} avis)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-neon-blue" />
                  {ebook.readers.toLocaleString()} lecteurs
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 text-neon-emerald" />
                  {ebook.pages} pages
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-neon-indigo" />
                  ~{ebook.readTime} de lecture
                </div>
              </div>

              {/* Price & CTA Card */}
              <div className="glass-card p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    {ebook.isFree ? (
                      <span className="text-3xl font-bold text-neon-emerald">Gratuit</span>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tighter">{ebook.price}€</span>
                        <span className="text-muted-foreground line-through">39€</span>
                        <span className="px-2 py-1 rounded-full bg-neon-emerald/20 text-neon-emerald text-xs font-medium">-30%</span>
                      </div>
                    )}
                  </div>
                </div>

                {ebook.isFree && (
                  <div className="mb-4">
                    <Input
                      type="email"
                      placeholder="Votre email pour recevoir l'ebook"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-glass/50 border-glass-border/50"
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 h-14 text-base font-semibold bg-gradient-to-r from-neon-indigo to-neon-blue hover:from-neon-blue hover:to-neon-emerald transition-all duration-500">
                    <span className="flex items-center gap-2">
                      {ebook.isFree ? (
                        <>
                          <Download className="w-5 h-5" />
                          Télécharger gratuitement
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Acheter maintenant
                        </>
                      )}
                    </span>
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-neon-emerald" />
                    Paiement sécurisé
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-neon-emerald" />
                    Accès immédiat
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-neon-emerald" />
                    Satisfait ou remboursé
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold tracking-tighter mb-4">À propos de cet ebook</h2>
                <p className="text-muted-foreground leading-relaxed">{ebook.description}</p>
              </div>

              {/* Table of Contents */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold tracking-tighter mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-neon-indigo" />
                  Table des matières
                </h2>
                <ul className="space-y-3">
                  {ebook.chapters.map((chapter, index) => (
                    <li key={index} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                      <span className="w-6 h-6 rounded-full bg-neon-indigo/20 border border-neon-indigo/30 flex items-center justify-center text-xs text-neon-indigo font-mono">
                        {index + 1}
                      </span>
                      {chapter}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EbookProduct;
