import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-indigo w-[500px] h-[500px] -top-40 -left-40" />
        <div className="orb orb-blue w-[400px] h-[400px] bottom-0 right-0" style={{ animationDelay: "-2s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--glass-border)/0.1)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--glass-border)/0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 text-center">
        <div className="glass-card p-12 inline-block">
          <div className="w-20 h-20 rounded-full bg-neon-indigo/20 border-2 border-neon-indigo flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-neon-indigo" />
          </div>
          
          <h1 className="text-6xl font-bold tracking-tighter mb-4">404</h1>
          <h2 className="text-2xl font-bold tracking-tighter mb-4">Page non trouvée</h2>
          <p className="text-muted-foreground mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-blue hover:from-neon-blue hover:to-neon-emerald transition-all duration-500 font-semibold"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}










