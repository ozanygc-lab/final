import { useParams, Link } from "react-router-dom";
import { CheckCircle, Mail, Download, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Success = () => {
  const { slug } = useParams();
  const isEbookPurchase = !!slug;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb orb-emerald w-[500px] h-[500px] -top-40 -left-40" />
        <div className="orb orb-blue w-[400px] h-[400px] bottom-0 right-0" style={{ animationDelay: "-2s" }} />
        <div className="orb orb-indigo w-[300px] h-[300px] top-1/3 left-1/2" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--glass-border)/0.1)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--glass-border)/0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 w-full max-w-lg px-6 text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-indigo to-neon-blue flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">
            Ebook<span className="text-neon-indigo">AI</span>
          </span>
        </Link>

        {/* Success Card */}
        <div className="glass-card p-8 relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-emerald via-neon-blue to-neon-indigo opacity-10 blur-xl" />
          
          <div className="relative z-10">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-neon-emerald/20 border-2 border-neon-emerald flex items-center justify-center mx-auto mb-6 animate-pulse-neon">
              <CheckCircle className="w-10 h-10 text-neon-emerald" />
            </div>

            {/* Confetti Animation */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2">
              <Sparkles className="w-6 h-6 text-neon-indigo animate-bounce" style={{ animationDelay: "0s" }} />
              <Sparkles className="w-4 h-4 text-neon-emerald animate-bounce" style={{ animationDelay: "0.2s" }} />
              <Sparkles className="w-5 h-5 text-neon-blue animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>

            <h1 className="text-3xl font-bold tracking-tighter mb-4">
              {isEbookPurchase ? "Achat confirmé !" : "Paiement réussi !"}
            </h1>

            <p className="text-muted-foreground mb-8">
              {isEbookPurchase ? (
                <>Merci pour votre achat ! Votre ebook vous a été envoyé par email.</>
              ) : (
                <>Votre paiement a été traité avec succès. Merci pour votre confiance !</>
              )}
            </p>

            {/* Email Notification */}
            <div className="glass-card p-4 mb-6 bg-neon-blue/5 border-neon-blue/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-neon-blue" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Vérifiez votre boîte mail</p>
                  <p className="text-xs text-muted-foreground">
                    {isEbookPurchase ? "Votre ebook a été envoyé" : "Un récapitulatif vous a été envoyé"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {isEbookPurchase && (
                <Button className="w-full h-12 font-semibold bg-gradient-to-r from-neon-emerald to-neon-blue hover:from-neon-blue hover:to-neon-indigo transition-all duration-500">
                  <span className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Télécharger maintenant
                  </span>
                </Button>
              )}
              
              <Button
                variant="outline"
                asChild
                className="w-full h-12 font-semibold border-glass-border/50 bg-glass/30 hover:bg-glass/50"
              >
                <Link to="/dashboard">
                  <span className="flex items-center gap-2">
                    Accéder au dashboard
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Link>
              </Button>

              <Link to="/" className="text-sm text-muted-foreground hover:text-neon-indigo transition-colors mt-2">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>

        {/* Support Note */}
        <p className="text-xs text-muted-foreground mt-8">
          Un problème ? Contactez-nous à{" "}
          <a href="mailto:support@ebookai.com" className="text-neon-indigo hover:underline">
            support@ebookai.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Success;
