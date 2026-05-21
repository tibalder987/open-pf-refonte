'use client'

import { useEffect, useRef } from 'react'
import { AdhesionForm } from './adhesion-form'

interface AdhesionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AdhesionModal({ isOpen, onClose }: AdhesionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className="adhesion-dialog"
      aria-label="Formulaire d'adhésion à OPEN PF"
      onClose={onClose}
    >
      <div className="adhesion-dialog-inner">
        <button
          type="button"
          className="adhesion-dialog-close"
          aria-label="Fermer"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M18 6 6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="adhesion-dialog-header">
          <h2>Rejoindre OPEN PF</h2>
          <p>Remplissez ce formulaire pour soumettre votre demande d&apos;adhésion.</p>
        </div>
        <AdhesionForm />
      </div>
    </dialog>
  )
}
