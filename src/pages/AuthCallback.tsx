import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate auth callback processing
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-indigo to-neon-blue flex items-center justify-center animate-pulse">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="glass-card p-8 inline-block">
          <Loader2 className="w-8 h-8 text-neon-indigo animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold tracking-tighter mb-2">Connexion en cours...</h2>
          <p className="text-muted-foreground text-sm">Vous allez être redirigé automatiquement</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
