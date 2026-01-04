/**
 * Server-only PDF generation module
 * This module should only be imported in server components or API routes
 */

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer'

interface Chapter {
  id?: string
  title: string
  content: string
  order_index: number
}

interface Ebook {
  id: string
  title: string
  description: string | null
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  cover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },
  chapterContent: {
    fontSize: 11,
    lineHeight: 1.6,
    textAlign: 'justify',
  },
})

const EbookPDFDocument = ({ ebook, chapters }: { ebook: Ebook; chapters: Chapter[] }) => (
  <Document>
    {/* Cover page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.cover}>
        <Text style={styles.title}>{ebook.title}</Text>
        {ebook.description && (
          <Text style={styles.description}>{ebook.description}</Text>
        )}
      </View>
    </Page>

    {/* Chapters in order */}
    {chapters
      .sort((a, b) => a.order_index - b.order_index)
      .map((chapter, index) => (
        <Page key={chapter.id || index} size="A4" style={styles.page}>
          <View>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <Text style={styles.chapterContent}>{chapter.content}</Text>
          </View>
        </Page>
      ))}
  </Document>
)

/**
 * Generate a PDF document from ebook data
 * Server-only implementation that returns a Buffer
 * 
 * @param ebook - The ebook object with id, title, and description
 * @param chapters - Array of chapters with title, content, and order_index
 * @returns Promise<Buffer> - PDF document as a Buffer
 */
export async function generateEbookPDF(ebook: Ebook, chapters: Chapter[]): Promise<Buffer> {
  const doc = <EbookPDFDocument ebook={ebook} chapters={chapters} />
  const asPdf = pdf(doc)
  const blob = await asPdf.toBlob()
  
  // Convert Blob to Buffer for Node.js
  const arrayBuffer = await blob.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
