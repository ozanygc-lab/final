interface Chapter {
  title: string
  content: string
}

interface GeneratePDFOptions {
  title: string
  description?: string
  chapters: Chapter[]
  author?: string
}

export async function generateEbookPDF(options: GeneratePDFOptions): Promise<Buffer> {
  // TEMPORAIREMENT DÉSACTIVÉ pour debug
  throw new Error('Génération PDF temporairement désactivée')
}
