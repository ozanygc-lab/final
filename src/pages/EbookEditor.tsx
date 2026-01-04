import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BookOpen, Save, Eye, Download, Globe, EyeOff, 
  ChevronLeft, Plus, Trash2, GripVertical, FileText,
  AlertTriangle, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";

const EbookEditor = () => {
  const { id } = useParams();
  const [activeChapter, setActiveChapter] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data
  const [ebook, setEbook] = useState({
    title: "Maîtriser l'Intelligence Artificielle",
    subtitle: "Guide complet pour les entrepreneurs",
    status: "draft",
    editsRemaining: 47,
    maxEdits: 50,
    chapters: [
      { id: "1", title: "Introduction à l'IA", content: "# Introduction à l'IA\n\nL'intelligence artificielle révolutionne notre façon de travailler...\n\n## Pourquoi l'IA ?\n\nL'IA offre des opportunités sans précédent pour les entrepreneurs..." },
      { id: "2", title: "Les fondamentaux du Machine Learning", content: "# Machine Learning\n\nLe Machine Learning est une branche de l'IA..." },
      { id: "3", title: "Outils pratiques", content: "# Outils pratiques\n\nDécouvrez les meilleurs outils..." }
    ]
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const wordCount = ebook.chapters[activeChapter]?.content.split(/\s+/).filter(Boolean).length || 0;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="p-2">
            <Link to="/dashboard">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">{ebook.title}</h1>
            <p className="text-sm text-muted-foreground">{ebook.subtitle}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Edits Counter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-glass/50 border border-glass-border/50">
            <FileText className="w-4 h-4 text-neon-indigo" />
            <span className="text-sm">
              <span className="font-medium text-foreground">{ebook.editsRemaining}</span>
              <span className="text-muted-foreground">/{ebook.maxEdits} modifications</span>
            </span>
          </div>

          <Button variant="outline" size="sm" className="border-glass-border/50 bg-glass/30" onClick={() => setIsPreview(!isPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? "Éditer" : "Aperçu"}
          </Button>
          <Button variant="outline" size="sm" className="border-glass-border/50 bg-glass/30">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className={ebook.status === 'published' 
              ? "border-neon-emerald/50 bg-neon-emerald/10 text-neon-emerald" 
              : "border-glass-border/50 bg-glass/30"
            }
          >
          {ebook.status === 'published' ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Dépublier
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Publier
              </>
            )}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-neon-indigo to-neon-blue hover:from-neon-blue hover:to-neon-emerald"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sauvegarde...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      {ebook.editsRemaining < 10 && (
        <div className="glass-card p-4 mb-6 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <p className="text-sm text-yellow-500">
              Il vous reste {ebook.editsRemaining} modifications ce mois-ci.{" "}
              <Link to="/pricing" className="underline hover:no-underline">Passez à Pro pour des modifications illimitées.</Link>
            </p>
          </div>
        </div>
      )}

      {/* Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chapters Sidebar */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold tracking-tighter flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neon-indigo" />
              Chapitres
            </h2>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {ebook.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                  activeChapter === index
                    ? 'bg-neon-indigo/20 border border-neon-indigo/30'
                    : 'bg-glass/30 border border-glass-border/30 hover:bg-glass/50'
                }`}
                onClick={() => setActiveChapter(index)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground">Chapitre {index + 1}</span>
                  <p className="text-sm font-medium truncate">{chapter.title}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-3 h-3 text-red-400" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 border-dashed border-glass-border/50">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un chapitre
          </Button>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 glass-card p-6">
          {/* Chapter Title */}
          <Input
            value={ebook.chapters[activeChapter]?.title || ""}
            onChange={(e) => {
              const newChapters = [...ebook.chapters];
              newChapters[activeChapter].title = e.target.value;
              setEbook({ ...ebook, chapters: newChapters });
            }}
            className="text-xl font-bold bg-transparent border-0 border-b border-glass-border/50 rounded-none px-0 mb-6 focus-visible:ring-0 focus-visible:border-neon-indigo"
            placeholder="Titre du chapitre"
          />

          {isPreview ? (
            /* Preview Mode */
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {ebook.chapters[activeChapter]?.content}
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <Textarea
              value={ebook.chapters[activeChapter]?.content || ""}
              onChange={(e) => {
                const newChapters = [...ebook.chapters];
                newChapters[activeChapter].content = e.target.value;
                setEbook({ ...ebook, chapters: newChapters });
              }}
              className="min-h-[500px] bg-glass/30 border-glass-border/50 font-mono text-sm resize-none"
              placeholder="Écrivez votre contenu en Markdown..."
            />
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-glass-border/50">
            <span className="text-sm text-muted-foreground">
              {wordCount} mots
            </span>
            <div className="flex items-center gap-2">
              {isSaving ? (
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                  Sauvegarde en cours...
                </span>
              ) : (
                <span className="text-sm text-neon-emerald flex items-center gap-2">
                  <Check className="w-3 h-3" />
                  Sauvegardé
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EbookEditor;
