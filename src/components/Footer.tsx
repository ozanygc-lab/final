import { BookOpen, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-glass-border/30 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="orb orb-indigo w-[300px] h-[300px] -bottom-40 left-0 opacity-10" />
        <div className="orb orb-blue w-[200px] h-[200px] -bottom-20 right-1/4 opacity-10" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
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
            <p className="text-sm text-muted-foreground mb-6">
              La révolution de l'édition numérique propulsée par l'intelligence artificielle.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg bg-glass border border-glass-border/30 hover:border-neon-indigo/50 transition-colors">
                <Twitter className="w-4 h-4 text-muted-foreground hover:text-neon-indigo transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-glass border border-glass-border/30 hover:border-neon-blue/50 transition-colors">
                <Linkedin className="w-4 h-4 text-muted-foreground hover:text-neon-blue transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-glass border border-glass-border/30 hover:border-neon-emerald/50 transition-colors">
                <Github className="w-4 h-4 text-muted-foreground hover:text-neon-emerald transition-colors" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produit</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tarifs</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Ressources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tutoriels</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entreprises</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Partenariats</a></li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                contact@ebookai.fr
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-glass-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 EbookAI. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              CGU
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
