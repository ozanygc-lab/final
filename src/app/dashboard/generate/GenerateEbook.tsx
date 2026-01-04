'use client'

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, BookOpen, Users, Target, MessageSquare, 
  ArrowRight, ChevronLeft, Loader2, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const GenerateEbook = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    audience: "",
    tone: "professional",
    goal: "",
    chapters: 8
  });

  const tones = [
    { id: "professional", label: "Professionnel", icon: "💼" },
    { id: "casual", label: "Décontracté", icon: "😊" },
    { id: "academic", label: "Académique", icon: "🎓" },
    { id: "storytelling", label: "Narratif", icon: "📖" }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-ebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: formData.topic,
          target_audience: formData.audience,
          tone: formData.tone,
          goal: formData.goal,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Échec de la génération');
      }

      const data = await response.json();
      router.push(`/dashboard/ebooks/${data.ebook.id}`);
    } catch (error: any) {
      console.error("Erreur:", error);
      alert(error.message || "Une erreur est survenue");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="sm" className="p-2">
          <Link href="/dashboard">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-neon-indigo" />
            Générer un Ebook
          </h1>
          <p className="text-muted-foreground">Créez votre ebook en quelques clics avec l'IA</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              s < step 
                ? 'bg-neon-emerald text-cyber-dark' 
                : s === step 
                  ? 'bg-neon-indigo text-white' 
                  : 'bg-glass/50 border border-glass-border/50 text-muted-foreground'
            }`}>
              {s < step ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 h-0.5 ${s < step ? 'bg-neon-emerald' : 'bg-glass-border/50'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <div className="max-w-2xl mx-auto">
        {step === 1 && (
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-neon-indigo/20 border border-neon-indigo/30 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-neon-indigo" />
              </div>
              <h2 className="text-2xl font-bold tracking-tighter mb-2">Quel est le sujet ?</h2>
              <p className="text-muted-foreground">Décrivez le thème principal de votre ebook</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Sujet principal</label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Ex: Comment utiliser l'IA pour automatiser son business"
                  className="h-14 bg-glass/50 border-glass-border/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nombre de chapitres</label>
                <div className="flex gap-2">
                  {[5, 8, 10, 15].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFormData({ ...formData, chapters: num })}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        formData.chapters === num
                          ? 'bg-neon-indigo text-white'
                          : 'bg-glass/50 border border-glass-border/50 hover:bg-glass'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.topic}
                className="w-full h-14 font-semibold bg-gradient-to-r from-neon-indigo to-neon-blue hover:from-neon-blue hover:to-neon-emerald"
              >
                Continuer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-neon-blue" />
              </div>
              <h2 className="text-2xl font-bold tracking-tighter mb-2">Pour qui écrivez-vous ?</h2>
              <p className="text-muted-foreground">Définissez votre audience cible</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Audience cible</label>
                <Input
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  placeholder="Ex: Entrepreneurs débutants, freelances, marketeurs..."
                  className="h-14 bg-glass/50 border-glass-border/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ton de l'ebook</label>
                <div className="grid grid-cols-2 gap-3">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setFormData({ ...formData, tone: tone.id })}
                      className={`p-4 rounded-xl text-left transition-all ${
                        formData.tone === tone.id
                          ? 'bg-neon-indigo/20 border-2 border-neon-indigo'
                          : 'bg-glass/50 border border-glass-border/50 hover:bg-glass'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{tone.icon}</span>
                      <span className="font-medium">{tone.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-14 border-glass-border/50 bg-glass/30"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.audience}
                  className="flex-1 h-14 font-semibold bg-gradient-to-r from-neon-indigo to-neon-blue hover:from-neon-blue hover:to-neon-emerald"
                >
                  Continuer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-neon-emerald/20 border border-neon-emerald/30 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-neon-emerald" />
              </div>
              <h2 className="text-2xl font-bold tracking-tighter mb-2">Quel est l'objectif ?</h2>
              <p className="text-muted-foreground">Que voulez-vous que vos lecteurs retiennent ?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Objectif principal</label>
                <Textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="Ex: Apprendre à utiliser ChatGPT pour créer du contenu, automatiser des tâches répétitives et gagner du temps..."
                  className="min-h-[120px] bg-glass/50 border-glass-border/50"
                />
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-glass/30 border border-glass-border/30">
                <h3 className="font-medium mb-3">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Sujet:</span> {formData.topic}</p>
                  <p><span className="text-muted-foreground">Audience:</span> {formData.audience}</p>
                  <p><span className="text-muted-foreground">Ton:</span> {tones.find(t => t.id === formData.tone)?.label}</p>
                  <p><span className="text-muted-foreground">Chapitres:</span> {formData.chapters}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 h-14 border-glass-border/50 bg-glass/30"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !formData.goal}
                  className="flex-1 h-14 font-semibold bg-gradient-to-r from-neon-emerald to-neon-blue hover:from-neon-blue hover:to-neon-indigo"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Génération en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Générer mon Ebook
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GenerateEbook;
