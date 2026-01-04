import { useState, useEffect, useRef } from "react";
import { ArrowRight, Zap, BookOpen, Users, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [counter, setCounter] = useState(12847);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 25;
      const y = (e.clientY - rect.top - rect.height / 2) / 25;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + Math.floor(Math.random() * 50) + 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-indigo w-[600px] h-[600px] -top-40 -left-40" />
        <div className="orb orb-blue w-[500px] h-[500px] top-1/3 -right-40" style={{ animationDelay: "-2s" }} />
        <div className="orb orb-emerald w-[400px] h-[400px] bottom-0 left-1/3" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--glass-border)/0.1)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--glass-border)/0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-6 max-w-xl">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-indigo/10 border border-neon-indigo/30 mb-8 animate-pulse-neon">
              <Zap className="w-4 h-4 text-neon-indigo" />
              <span className="text-sm font-medium text-neon-indigo tracking-tight">L'IA au service de l'édition</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tighter mb-8">
              <span className="block text-foreground">Créez vos</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-neon-indigo via-neon-blue to-neon-emerald">
                Ebooks en
              </span>
              <span className="block text-foreground">quelques clics</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-md mb-10 leading-relaxed tracking-tight">
              Notre IA révolutionne la création de contenu. Générez des ebooks professionnels, 
              optimisés et prêts à publier en quelques minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
              <Button 
                size="lg" 
                className="relative group h-14 px-8 text-lg font-semibold bg-gradient-to-r from-neon-indigo to-neon-blue hover:from-neon-blue hover:to-neon-emerald transition-all duration-500 animate-pulse-neon"
              >
                <span className="flex items-center gap-2 tracking-tight">
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg font-semibold border-glass-border/50 bg-glass/30 hover:bg-glass/50 hover:border-neon-indigo/50 transition-all duration-300 tracking-tight"
              >
                Voir la démo
              </Button>
            </div>

            {/* Mini Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-neon-indigo" />
                <span className="text-sm font-medium text-muted-foreground tracking-tight">12K+ Ebooks</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-blue" />
                <span className="text-sm font-medium text-muted-foreground tracking-tight">5K+ Auteurs</span>
              </div>
            </div>
          </div>

          {/* Right Column - Profit Growth Visual */}
          <div 
            className="lg:col-span-6 relative flex items-center justify-center"
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            {/* Glow Background */}
            <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-neon-indigo/30 via-neon-blue/20 to-neon-emerald/30 rounded-full blur-[100px] animate-glow-pulse" />
            
            {/* Main Floating Card */}
            <div 
              className="relative glass-card p-8 w-[340px] animate-float"
              style={{ animationDuration: "4s" }}
            >
              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-indigo via-neon-blue to-neon-emerald opacity-20 blur-xl" />
              
              {/* Card Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono text-muted-foreground tracking-tight">PROFIT GROWTH</span>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neon-emerald/20 border border-neon-emerald/30">
                    <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse" />
                    <span className="text-xs font-mono text-neon-emerald">LIVE</span>
                  </div>
                </div>

                {/* Arrow and Revenue Display */}
                <div className="flex items-center gap-6 mb-6">
                  {/* 3D Arrow */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-neon-indigo to-neon-emerald blur-xl opacity-60 animate-glow-pulse" />
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg viewBox="0 0 80 80" className="w-full h-full">
                        <defs>
                          <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--neon-indigo))" />
                            <stop offset="50%" stopColor="hsl(var(--neon-blue))" />
                            <stop offset="100%" stopColor="hsl(var(--neon-emerald))" />
                          </linearGradient>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <path
                          d="M20 60 L40 20 L60 60 L40 50 Z"
                          fill="url(#arrowGradient)"
                          filter="url(#glow)"
                          className="animate-pulse"
                        />
                        <path
                          d="M40 20 L60 60 L40 50 Z"
                          fill="hsl(var(--neon-emerald))"
                          opacity="0.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Revenue Counter */}
                  <div>
                    <div className="flex items-baseline gap-1">
                      <DollarSign className="w-6 h-6 text-neon-emerald" />
                      <span className="text-3xl font-bold text-foreground tracking-tighter font-mono">
                        {counter.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-neon-emerald" />
                      <span className="text-sm text-neon-emerald font-medium tracking-tight">+127% ce mois</span>
                    </div>
                  </div>
                </div>

                {/* Mini Graph */}
                <div className="relative h-16 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 280 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="graphGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--neon-blue))" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="hsl(var(--neon-blue))" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 50 Q20 45 40 40 T80 35 T120 25 T160 30 T200 15 T240 20 T280 5 V60 H0 Z"
                      fill="url(#graphGradient)"
                    />
                    <path
                      d="M0 50 Q20 45 40 40 T80 35 T120 25 T160 30 T200 15 T240 20 T280 5"
                      fill="none"
                      stroke="hsl(var(--neon-blue))"
                      strokeWidth="2"
                      className="drop-shadow-[0_0_8px_hsl(var(--neon-blue))]"
                    />
                    {/* Animated Dot */}
                    <circle cx="280" cy="5" r="4" fill="hsl(var(--neon-blue))" className="animate-pulse" />
                  </svg>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-glass/50 border border-glass-border/30">
                    <span className="block text-lg font-bold text-foreground tracking-tighter">847</span>
                    <span className="text-xs text-muted-foreground tracking-tight">Ventes</span>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-glass/50 border border-glass-border/30">
                    <span className="block text-lg font-bold text-foreground tracking-tighter">12.4K</span>
                    <span className="text-xs text-muted-foreground tracking-tight">Lecteurs</span>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-glass/50 border border-glass-border/30">
                    <span className="block text-lg font-bold text-neon-emerald tracking-tighter">98%</span>
                    <span className="text-xs text-muted-foreground tracking-tight">Profit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Mini Cards */}
            <div 
              className="absolute -top-4 -left-4 glass-card p-3 animate-float"
              style={{ 
                animationDelay: "-1s",
                animationDuration: "5s",
                transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neon-indigo/20 border border-neon-indigo/30 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-neon-indigo" />
                </div>
                <div>
                  <span className="block text-xs font-mono text-neon-indigo">+12</span>
                  <span className="block text-[10px] text-muted-foreground">Ebooks/h</span>
                </div>
              </div>
            </div>

            <div 
              className="absolute -bottom-4 -right-4 glass-card p-3 animate-float"
              style={{ 
                animationDelay: "-2s",
                animationDuration: "6s",
                transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neon-emerald/20 border border-neon-emerald/30 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-neon-emerald" />
                </div>
                <div>
                  <span className="block text-xs font-mono text-neon-emerald">+$2.4K</span>
                  <span className="block text-[10px] text-muted-foreground">Aujourd'hui</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
