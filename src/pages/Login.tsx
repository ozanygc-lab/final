import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate magic link sending
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-indigo w-[500px] h-[500px] -top-40 -left-40" />
        <div className="orb orb-blue w-[400px] h-[400px] bottom-0 right-0" style={{ animationDelay: "-2s" }} />
        <div className="orb orb-emerald w-[300px] h-[300px] top-1/2 left-1/2" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--glass-border)/0.1)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--glass-border)/0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-indigo to-neon-blue flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">
            Ebook<span className="text-neon-indigo">AI</span>
          </span>
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-indigo via-neon-blue to-neon-emerald opacity-10 blur-xl" />
          
          <div className="relative z-10">
            {!isSent ? (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-indigo/10 border border-neon-indigo/30 mb-4 animate-pulse-neon">
                    <Sparkles className="w-3.5 h-3.5 text-neon-indigo" />
                    <span className="text-xs font-medium text-neon-indigo">Connexion sécurisée</span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter mb-2">Bon retour !</h1>
                  <p className="text-muted-foreground text-sm">Connectez-vous avec un lien magique</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 bg-glass/50 border-glass-border/50 focus:border-neon-indigo/50 text-base"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-base font-semibold bg-gradient-to-r from-neon-indigo to-neon-blue hover:from-neon-blue hover:to-neon-emerald transition-all duration-500"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Envoyer le lien magique
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Pas encore de compte ?{" "}
                  <Link to="/signup" className="text-neon-indigo hover:text-neon-blue transition-colors">
                    S'inscrire
                  </Link>
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-neon-emerald/20 border border-neon-emerald/30 flex items-center justify-center mx-auto mb-6 animate-pulse-neon">
                  <Mail className="w-8 h-8 text-neon-emerald" />
                </div>
                <h2 className="text-2xl font-bold tracking-tighter mb-2">Vérifiez vos emails</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Nous avons envoyé un lien de connexion à<br />
                  <span className="text-foreground font-medium">{email}</span>
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSent(false)}
                  className="border-glass-border/50 bg-glass/30 hover:bg-glass/50"
                >
                  Utiliser une autre adresse
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          En vous connectant, vous acceptez nos{" "}
          <Link to="/terms" className="text-neon-indigo hover:underline">CGU</Link>
          {" "}et notre{" "}
          <Link to="/privacy" className="text-neon-indigo hover:underline">politique de confidentialité</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
