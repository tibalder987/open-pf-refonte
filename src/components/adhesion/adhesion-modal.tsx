'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AdhesionForm } from './adhesion-form'

export function AdhesionModal() {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const close = useCallback(() => {
    dialogRef.current?.close()
    router.back()
  }, [router])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) close()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key === 'Escape') close()
  }

  return (
    <dialog
      ref={dialogRef}
      className="adhesion-dialog"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      aria-label="Formulaire d'adhésion OPEN PF"
    >
      <div className="adhesion-dialog-inner">
        <button
          type="button"
          className="adhesion-dialog-close"
          onClick={close}
          aria-label="Fermer le formulaire"
        >
          ✕
        </button>
        <div className="adhesion-dialog-header">
          <h2>Rejoignez OPEN PF</h2>
          <p>Complétez les 3 étapes pour soumettre votre demande d&apos;adhésion.</p>
        </div>
        <AdhesionForm onSuccess={close} />
      </div>
    </dialog>
  )
}
