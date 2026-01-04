import { useState, useEffect } from "react";
import { Terminal, Cpu, Zap, CheckCircle, Loader2, BookOpen, Send } from "lucide-react";

const ChatInterface = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Analyse du sujet", completed: true },
    { label: "Génération du plan", completed: true },
    { label: "Rédaction des chapitres", completed: false },
    { label: "Mise en forme", completed: false },
  ];

  const messages = [
    {
      type: "system",
      content: "SESSION INITIALISÉE • ID: EBK-2024-0847",
      timestamp: "14:32:01",
    },
    {
      type: "user",
      content: "Génère un ebook sur l'intelligence artificielle dans le marketing digital",
      timestamp: "14:32:15",
    },
    {
      type: "ai",
      content: "Analyse en cours... Sujet détecté: IA & Marketing Digital",
      timestamp: "14:32:17",
      status: "processing",
    },
    {
      type: "ai",
      content: "Structure générée: 8 chapitres • 45,000 mots estimés",
      timestamp: "14:32:24",
      details: [
        "Ch.1: Introduction à l'IA",
        "Ch.2: Personnalisation client",
        "Ch.3: Automatisation marketing",
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 74) return 74;
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 74) {
      setCurrentStep(2);
    }
  }, [progress]);

  return (
    <section id="demo" className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="orb orb-blue w-[400px] h-[400px] top-0 right-0 opacity-20" />
        <div className="orb orb-emerald w-[300px] h-[300px] bottom-0 left-0 opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue/10 border border-neon-blue/30 mb-6">
            <Terminal className="w-4 h-4 text-neon-blue" />
            <span className="text-sm font-medium text-neon-blue">Interface de génération</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Cockpit </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-emerald">Créatif</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Une interface futuriste pour piloter votre création de contenu en temps réel
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Terminal Window */}
          <div className="glass-card overflow-hidden animated-border scanlines">
            {/* System Status Bar */}
            <div className="bg-cyber-darker/80 border-b border-glass-border/30 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neon-emerald animate-pulse" />
                  <span className="font-mono text-xs text-neon-emerald">SYSTEM STATUS: OPTIMAL</span>
                </div>
                <div className="h-4 w-px bg-glass-border/50" />
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">GPU: 87%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-neon-indigo" />
                <span className="font-mono text-xs text-neon-indigo">AI-MODEL: GPT-4 TURBO</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-4 bg-cyber-darker/50 border-b border-glass-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-muted-foreground">PROGRESSION GÉNÉRATION</span>
                <span className="font-mono text-sm text-neon-emerald">{progress}%</span>
              </div>
              <div className="h-2 bg-glass rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-indigo via-neon-blue to-neon-emerald rounded-full transition-all duration-300 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-progress-shine" />
                </div>
              </div>
              {/* Steps */}
              <div className="flex items-center justify-between mt-4 gap-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-xs font-mono ${
                      index <= currentStep ? "text-neon-emerald" : "text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : index === currentStep ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-muted-foreground/50" />
                    )}
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-6 space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.type === "system"
                        ? "w-full text-center"
                        : message.type === "user"
                        ? "bg-neon-indigo/20 border border-neon-indigo/30 rounded-2xl rounded-tr-sm"
                        : "bg-glass border border-glass-border/30 rounded-2xl rounded-tl-sm"
                    } px-4 py-3`}
                  >
                    {message.type === "system" ? (
                      <span className="font-mono text-xs text-muted-foreground">
                        {message.content}
                      </span>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          {message.type === "ai" && (
                            <BookOpen className="w-4 h-4 text-neon-blue" />
                          )}
                          <span className="font-mono text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                          {message.status === "processing" && (
                            <span className="flex items-center gap-1 text-neon-emerald">
                              <Loader2 className="w-3 h-3 animate-spin" />
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${message.type === "user" ? "text-foreground" : "text-muted-foreground"}`}>
                          {message.content}
                        </p>
                        {message.details && (
                          <div className="mt-2 pt-2 border-t border-glass-border/30 space-y-1">
                            {message.details.map((detail, i) => (
                              <p key={i} className="font-mono text-xs text-neon-blue/80">
                                → {detail}
                              </p>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              <div className="flex justify-start">
                <div className="bg-glass border border-glass-border/30 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-neon-blue animate-typing" />
                    <span className="w-2 h-2 rounded-full bg-neon-blue animate-typing" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 rounded-full bg-neon-blue animate-typing" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="px-6 py-4 bg-cyber-darker/50 border-t border-glass-border/30">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Décrivez votre prochain ebook..."
                    className="w-full bg-glass border border-glass-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-indigo/50 transition-colors"
                  />
                </div>
                <button className="p-3 bg-gradient-to-r from-neon-indigo to-neon-blue rounded-xl hover:from-neon-blue hover:to-neon-emerald transition-all duration-300 group">
                  <Send className="w-5 h-5 text-primary-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;
