'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  BookOpen, Save, Eye, Download, Globe, EyeOff, 
  ChevronLeft, Plus, Trash2, GripVertical, FileText,
  AlertTriangle, Check, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase/client"
import ReactMarkdown from 'react-markdown'

interface Chapter {
  id: string
  title: string
  content: string
  order: number
}

interface Ebook {
  id: string
  title: string
  description?: string
  status: string
  edits_used?: number
  chapters?: Chapter[]
  [key: string]: any
}

interface EbookEditorProps {
  ebook: Ebook
}

const EbookEditor = ({ ebook: initialEbook }: EbookEditorProps) => {
  const router = useRouter()
  const [activeChapter, setActiveChapter] = useState(0)
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [ebook, setEbook] = useState(initialEbook)
  const [chapters, setChapters] = useState<Chapter[]>(
    initialEbook.chapters || []
  )

  useEffect(() => {
    // Charger les chapitres depuis l'API si nécessaire
    const loadChapters = async () => {
      try {
        const response = await fetch(`/api/ebooks/${ebook.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.chapters) {
            setChapters(data.chapters)
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des chapitres:', error)
      }
    }
    loadChapters()
  }, [ebook.id])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/ebooks/${ebook.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ebook.title,
          description: ebook.description,
          chapters: chapters,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      const data = await response.json()
      setEbook(data)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const response = await fetch(`/api/ebooks/${ebook.id}/publish`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la publication')
      }

      const data = await response.json()
      setEbook({ ...ebook, status: data.status })
      router.refresh()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la publication')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/ebooks/generate-pdf?ebookId=${ebook.id}`)
      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${ebook.title}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération du PDF')
    }
  }

  const wordCount = chapters[activeChapter]?.content?.split(/\s+/).filter(Boolean).length || 0
  const editsRemaining = ebook.edits_used !== undefined ? (50 - (ebook.edits_used || 0)) : null

  return (
    <>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="p-2">
            <Link href="/dashboard">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <Input
              value={ebook.title}
              onChange={(e) => setEbook({ ...ebook, title: e.target.value })}
              className="text-2xl font-bold tracking-tighter bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
              placeholder="Titre de l'ebook"
            />
            {ebook.description && (
              <p className="text-sm text-muted-foreground mt-1">{ebook.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Edits Counter */}
          {editsRemaining !== null && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-glass/50 border border-glass-border/50">
              <FileText className="w-4 h-4 text-neon-indigo" />
              <span className="text-sm">
                <span className="font-medium text-foreground">{editsRemaining}</span>
                <span className="text-muted-foreground">/50 modifications</span>
              </span>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="border-glass-border/50 bg-glass/30" 
            onClick={() => setIsPreview(!isPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? "Éditer" : "Aperçu"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-glass-border/50 bg-glass/30"
            onClick={handleDownloadPDF}
          >
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
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : ebook.status === 'published' ? (
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
                <Loader2 className="w-4 h-4 animate-spin" />
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
      {editsRemaining !== null && editsRemaining < 10 && (
        <div className="glass-card p-4 mb-6 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <p className="text-sm text-yellow-500">
              Il vous reste {editsRemaining} modifications ce mois-ci.{" "}
              <Link href="/pricing" className="underline hover:no-underline">Passez à Pro pour des modifications illimitées.</Link>
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
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => {
                const newChapter: Chapter = {
                  id: Date.now().toString(),
                  title: 'Nouveau chapitre',
                  content: '',
                  order: chapters.length
                }
                setChapters([...chapters, newChapter])
                setActiveChapter(chapters.length)
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {chapters.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun chapitre. Cliquez sur + pour en ajouter un.
              </p>
            ) : (
              chapters.map((chapter, index) => (
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
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      const newChapters = chapters.filter((_, i) => i !== index)
                      setChapters(newChapters)
                      if (activeChapter >= newChapters.length) {
                        setActiveChapter(Math.max(0, newChapters.length - 1))
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4 border-dashed border-glass-border/50"
            onClick={() => {
              const newChapter: Chapter = {
                id: Date.now().toString(),
                title: 'Nouveau chapitre',
                content: '',
                order: chapters.length
              }
              setChapters([...chapters, newChapter])
              setActiveChapter(chapters.length)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un chapitre
          </Button>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 glass-card p-6">
          {chapters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Aucun chapitre pour le moment</p>
              <Button
                onClick={() => {
                  const newChapter: Chapter = {
                    id: Date.now().toString(),
                    title: 'Nouveau chapitre',
                    content: '',
                    order: 0
                  }
                  setChapters([newChapter])
                  setActiveChapter(0)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer le premier chapitre
              </Button>
            </div>
          ) : (
            <>
              {/* Chapter Title */}
              <Input
                value={chapters[activeChapter]?.title || ""}
                onChange={(e) => {
                  const newChapters = [...chapters]
                  newChapters[activeChapter].title = e.target.value
                  setChapters(newChapters)
                }}
                className="text-xl font-bold bg-transparent border-0 border-b border-glass-border/50 rounded-none px-0 mb-6 focus-visible:ring-0 focus-visible:border-neon-indigo"
                placeholder="Titre du chapitre"
              />

              {isPreview ? (
                /* Preview Mode */
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {chapters[activeChapter]?.content || ''}
                  </ReactMarkdown>
                </div>
              ) : (
                /* Edit Mode */
                <Textarea
                  value={chapters[activeChapter]?.content || ""}
                  onChange={(e) => {
                    const newChapters = [...chapters]
                    newChapters[activeChapter].content = e.target.value
                    setChapters(newChapters)
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
                      <Loader2 className="w-3 h-3 animate-spin" />
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
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default EbookEditor









