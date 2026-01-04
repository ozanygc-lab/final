'use client'

import { useRouter } from 'next/navigation'
import { X } from './icons'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  editsUsed: number
  maxEdits: number
}

export default function UpgradeModal({ isOpen, onClose, editsUsed, maxEdits }: UpgradeModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Limite atteinte</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Vous avez utilisé {editsUsed} sur {maxEdits} modifications disponibles.
        </p>
        
        <p className="text-gray-600 mb-6">
          Passez au plan Pro pour obtenir des modifications illimitées.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              router.push('/pricing')
              onClose()
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Voir les tarifs
          </button>
        </div>
      </div>
    </div>
  )
}

