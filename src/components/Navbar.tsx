import { useState, useEffect } from "react";
import { BookOpen, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 bg-cyber-dark/80 backdrop-blur-2xl border-b border-glass-border/30"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-indigo/30 blur-xl rounded-full" />
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-neon-indigo/20 to-neon-blue/20 border border-neon-indigo/30">
              <BookOpen className="w-6 h-6 text-neon-indigo" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-foreground">Ebook</span>
            <span className="text-neon-indigo">AI</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Fonctionnalités
          </a>
          <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Démo
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Tarifs
          </a>
          <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Témoignages
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            Connexion
          </Button>
          <Button className="relative group overflow-hidden bg-gradient-to-r from-neon-indigo to-neon-blue text-primary-foreground font-semibold px-6">
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Essai Gratuit
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-emerald opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-cyber-dark/95 backdrop-blur-2xl border-b border-glass-border/30 p-6">
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors py-2">
              Fonctionnalités
            </a>
            <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors py-2">
              Démo
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors py-2">
              Tarifs
            </a>
            <Button className="w-full bg-gradient-to-r from-neon-indigo to-neon-blue text-primary-foreground font-semibold">
              <Sparkles className="w-4 h-4 mr-2" />
              Essai Gratuit
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
