import { Shield, TrendingUp, Users, Clock, Award, Zap, BookOpen, Globe, LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  color: "indigo" | "blue" | "emerald";
  size: "large" | "medium" | "small";
}

const BentoGrid = () => {
  const features: Feature[] = [
    {
      icon: TrendingUp,
      title: "1.2M+",
      subtitle: "Ventes générées",
      description: "Par nos auteurs en 2024",
      color: "indigo",
      size: "large",
    },
    {
      icon: Users,
      title: "50K+",
      subtitle: "Lecteurs actifs",
      description: "Audience mensuelle combinée",
      color: "blue",
      size: "small",
    },
    {
      icon: Clock,
      title: "< 5 min",
      subtitle: "Temps de génération",
      description: "Pour un ebook complet",
      color: "emerald",
      size: "small",
    },
    {
      icon: Shield,
      title: "Copyright",
      subtitle: "100% Protégé",
      description: "Contenu original garanti avec certificat d'authenticité",
      color: "blue",
      size: "medium",
    },
    {
      icon: Award,
      title: "Qualité Pro",
      subtitle: "Standard éditorial",
      description: "Relecture et optimisation automatiques",
      color: "emerald",
      size: "medium",
    },
    {
      icon: Globe,
      title: "30+ Langues",
      subtitle: "Traduction instantanée",
      description: "Publiez dans le monde entier",
      color: "indigo",
      size: "small",
    },
    {
      icon: Zap,
      title: "IA Avancée",
      subtitle: "GPT-4 & Claude",
      description: "Meilleurs modèles du marché",
      color: "blue",
      size: "small",
    },
    {
      icon: BookOpen,
      title: "Multi-formats",
      subtitle: "EPUB, PDF, MOBI",
      description: "Compatible toutes plateformes",
      color: "emerald",
      size: "large",
    },
  ];

  const getColorClasses = (color: Feature["color"]) => {
    const colorMap = {
      indigo: {
        bg: "bg-neon-indigo/10",
        border: "border-neon-indigo/30",
        text: "text-neon-indigo",
        hover: "hover:border-neon-indigo/40",
      },
      blue: {
        bg: "bg-neon-blue/10",
        border: "border-neon-blue/30",
        text: "text-neon-blue",
        hover: "hover:border-neon-blue/40",
      },
      emerald: {
        bg: "bg-neon-emerald/10",
        border: "border-neon-emerald/30",
        text: "text-neon-emerald",
        hover: "hover:border-neon-emerald/40",
      },
    };
    return colorMap[color];
  };

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="orb orb-indigo w-[500px] h-[500px] -top-20 left-1/4 opacity-15" />
        <div className="orb orb-emerald w-[400px] h-[400px] bottom-0 right-1/4 opacity-15" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-emerald/10 border border-neon-emerald/30 mb-6">
            <Zap className="w-4 h-4 text-neon-emerald" />
            <span className="text-sm font-medium text-neon-emerald">Statistiques & Garanties</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Des résultats </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-emerald to-neon-blue">exceptionnels</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Rejoignez des milliers d'auteurs qui ont transformé leur façon de créer
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = getColorClasses(feature.color);
            const colSpan = feature.size === "large" || feature.size === "medium" ? "md:col-span-2" : "";
            const rowSpan = feature.size === "large" ? "md:row-span-2" : "";

            return (
              <div
                key={index}
                className={`glass-card p-6 group ${colorClasses.hover} transition-all duration-500 hover:-translate-y-1 ${colSpan} ${rowSpan} ${
                  feature.size === "large" ? "flex flex-col justify-between min-h-[280px]" : ""
                }`}
              >
                <div>
                  <div className={`inline-flex p-3 rounded-xl ${colorClasses.bg} ${colorClasses.border} border mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${colorClasses.text}`} />
                  </div>
                  <h3 className={`font-bold text-foreground mb-1 ${feature.size === "large" ? "text-4xl" : "text-2xl md:text-3xl"}`}>
                    {feature.title}
                  </h3>
                  <p className={`font-medium mb-2 ${colorClasses.text}`}>
                    {feature.subtitle}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
