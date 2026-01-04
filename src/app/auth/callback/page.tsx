'use client'

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError('Erreur lors de la connexion. Veuillez réessayer.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            setError(exchangeError.message || 'Erreur lors de la connexion.');
            setTimeout(() => {
              router.push('/login');
            }, 2000);
            return;
          }

          router.push('/dashboard');
        } catch (err: any) {
          setError(err.message || 'Une erreur est survenue.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, searchParams, supabase]);

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
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-indigo to-neon-blue flex items-center justify-center animate-pulse">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        </Link>

        <div className="glass-card p-8 inline-block">
          {error ? (
            <>
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-xl">✕</span>
              </div>
              <h2 className="text-xl font-bold tracking-tighter mb-2">Erreur</h2>
              <p className="text-muted-foreground text-sm">{error}</p>
            </>
          ) : (
            <>
              <Loader2 className="w-8 h-8 text-neon-indigo animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold tracking-tighter mb-2">Connexion en cours...</h2>
              <p className="text-muted-foreground text-sm">Vous allez être redirigé automatiquement</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
