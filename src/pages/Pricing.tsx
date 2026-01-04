import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Zap, BookOpen, ArrowRight, Sparkles, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Pour débuter avec l'IA",
      price: { monthly: 0, annual: 0 },
      icon: Zap,
      color: "neon-blue",
      features: [
        "3 ebooks par mois",
        "5 chapitres max par ebook",
        "Export PDF basique",
        "Support email",
        "Watermark EbookAI"
      ],
      cta: "Commencer gratuitement",
      popular: false
    },
    {
      name: "Basic",
      description: "Pour les créateurs réguliers",
      price: { monthly: 19, annual: 15 },
      icon: BookOpen,
      color: "neon-indigo",
      features: [
        "10 ebooks par mois",
        "15 chapitres max par ebook",
        "Export PDF professionnel",
        "Sans watermark",
        "Support prioritaire",
        "Templates premium"
      ],
      cta: "Choisir Basic",
      popular: false
    },
    {
      name: "Pro",
      description: "Pour les professionnels",
      price: { monthly: 49, annual: 39 },
      icon: Crown,
      color: "neon-emerald",
      features: [
        "Ebooks illimités",
        "Chapitres illimités",
        "Export multi-formats",
        "Publication directe",
        "Statistiques avancées",
        "API access",
        "Support 24/7"
      ],
      cta: "Choisir Pro",
      popular: true
    },
    {
      name: "Business",
      description: "Pour les équipes",
      price: { monthly: 149, annual: 119 },
      icon: Building2,
      color: "neon-indigo",
      features: [
        "Tout de Pro",
        "5 membres d'équipe",
        "Branding personnalisé",
        "SSO & Sécurité avancée",
        "Account manager dédié",
        "Formation incluse",
        "SLA garanti"
      ],
      cta: "Contacter les ventes",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Navbar />
      
      <main className="relative pt-32 pb-24">
        {/* Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-indigo w-[600px] h-[600px] -top-40 left-1/4" />
          <div className="orb orb-blue w-[500px] h-[500px] top-1/3 -right-40" style={{ animationDelay: "-2s" }} />
          <div className="orb orb-emerald w-[400px] h-[400px] bottom-0 left-0" style={{ animationDelay: "-4s" }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--glass-border)/0.1)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--glass-border)/0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-indigo/10 border border-neon-indigo/30 mb-6 animate-pulse-neon">
              <Sparkles className="w-4 h-4 text-neon-indigo" />
              <span className="text-sm font-medium text-neon-indigo tracking-tight">Tarification simple</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
              <span className="block text-foreground">Un prix pour</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-neon-indigo via-neon-blue to-neon-emerald">
                chaque ambition
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choisissez le plan qui correspond à vos besoins. Évoluez à tout moment.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                isAnnual ? 'bg-neon-indigo' : 'bg-glass-border'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                isAnnual ? 'translate-x-8' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annuel
            </span>
            {isAnnual && (
              <span className="px-2 py-1 rounded-full bg-neon-emerald/20 border border-neon-emerald/30 text-xs text-neon-emerald">
                -20%
              </span>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative glass-card p-6 flex flex-col ${
                  plan.popular ? 'ring-2 ring-neon-emerald shadow-[0_0_40px_rgba(52,211,153,0.2)]' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neon-emerald text-cyber-dark text-xs font-bold">
                    POPULAIRE
                  </div>
                )}

                {/* Glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-${plan.color}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl`} />

                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-${plan.color}/20 border border-${plan.color}/30 flex items-center justify-center mb-4`}>
                    <plan.icon className={`w-6 h-6 text-${plan.color}`} />
                  </div>

                  {/* Name & Description */}
                  <h3 className="text-xl font-bold tracking-tighter mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tighter">
                        {isAnnual ? plan.price.annual : plan.price.monthly}€
                      </span>
                      <span className="text-muted-foreground text-sm">/mois</span>
                    </div>
                    {isAnnual && plan.price.monthly > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Facturé {plan.price.annual * 12}€/an
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className={`w-5 h-5 rounded-full bg-${plan.color}/20 border border-${plan.color}/30 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className={`w-3 h-3 text-${plan.color}`} />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className={`w-full h-12 font-semibold ${
                      plan.popular
                        ? 'bg-gradient-to-r from-neon-emerald to-neon-blue hover:from-neon-blue hover:to-neon-indigo'
                        : 'bg-glass/50 border border-glass-border/50 hover:bg-glass hover:border-neon-indigo/50'
                    } transition-all duration-300`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <span className="flex items-center gap-2">
                      {plan.cta}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Link */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              Des questions ?{" "}
              <Link to="/faq" className="text-neon-indigo hover:text-neon-blue transition-colors">
                Consultez notre FAQ
              </Link>
              {" "}ou{" "}
              <Link to="/contact" className="text-neon-indigo hover:text-neon-blue transition-colors">
                contactez-nous
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
