'use client'

import { useState } from 'react'
import GenerateEbookModal from './GenerateEbookModal'

export default function GenerateButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
      >
        <span>🚀</span>
        Créer un ebook
      </button>
      <GenerateEbookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}










