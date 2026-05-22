'use client'

import type { UseFormReturn } from 'react-hook-form'
import type { AdhesionData } from '@/lib/validations/adhesion'
import { ACTIVITY_DOMAINS } from '@/lib/data/referentials'

interface Props {
  form: UseFormReturn<AdhesionData>
}

export function StepActivites({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form
  return (
    <fieldset className="form-step">
      <legend className="form-step-legend">
        Domaines d&apos;activité <span aria-hidden="true">*</span>
      </legend>
      <p className="form-step-hint">
        Sélectionnez tous les domaines qui correspondent à votre activité.
      </p>
      {errors.activityDomains?.message && (
        <p className="field-error" role="alert">
          {errors.activityDomains.message}
        </p>
      )}
      <div className="domain-grid" role="group" aria-label="Domaines d'activité">
        {ACTIVITY_DOMAINS.map((domain) => (
          <label key={domain.id} className="domain-chip">
            <input type="checkbox" value={domain.id} {...register('activityDomains')} />
            <span>{domain.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
