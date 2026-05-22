'use client'

import type { UseFormReturn } from 'react-hook-form'
import type { AdhesionData } from '@/lib/validations/adhesion'
import { CERTIFICATIONS } from '@/lib/data/referentials'

interface Props {
  form: UseFormReturn<AdhesionData>
}

export function StepCertifications({ form }: Props) {
  const { register } = form
  return (
    <fieldset className="form-step">
      <legend className="form-step-legend">Compétences &amp; certifications</legend>
      <p className="form-step-hint">
        Optionnel — Cochez les certifications et labels que votre entreprise détient.
      </p>
      <div className="domain-grid" role="group" aria-label="Certifications">
        {CERTIFICATIONS.map((cert) => (
          <label key={cert.id} className="domain-chip">
            <input type="checkbox" value={cert.id} {...register('certifications')} />
            <span>{cert.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
