'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Stepper } from './stepper'
import { ArrowIcon } from '@/components/public/arrow-icon'
import { LEGAL_STATUSES, ACTIVITY_DOMAINS } from '@/lib/data/referentials'
import {
  adhesionSchema,
  stepEntrepriseSchema,
  stepContactsSchema,
  type AdhesionData,
} from '@/lib/validations/adhesion'
import { submitAdhesion } from '@/lib/actions/adhesion'

const DRAFT_KEY = 'adhesion-draft'

const STEPS = [
  { label: 'Entreprise', description: 'Informations générales' },
  { label: "Domaines d'activité", description: 'Secteurs couverts' },
  { label: 'Contacts', description: 'Équipe & RGPD' },
]

type FormData = AdhesionData

interface AdhesionFormProps {
  onSuccess?: (slug: string) => void
}

export function AdhesionForm({ onSuccess }: AdhesionFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(adhesionSchema),
    defaultValues: {
      name: '',
      legalStatus: '',
      tahitiNumber: '',
      websiteUrl: '',
      description: '',
      isMedefMember: false,
      activityDomains: [],
      contacts: [{ name: '', role: '', email: '', phone: '', isPrimary: true }],
      rgpdConsent: false,
    },
    mode: 'onTouched',
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts',
  })

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>
        form.reset({ ...form.getValues(), ...parsed })
      }
    } catch {
      // ignore corrupted draft
    }
  }, [form])

  // Persist draft on every change
  useEffect(() => {
    const sub = form.watch((values) => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
      } catch {
        // ignore storage errors
      }
    })
    return () => sub.unsubscribe()
  }, [form])

  async function handleNext() {
    let valid = false
    if (step === 1) {
      valid = await form.trigger(Object.keys(stepEntrepriseSchema.shape) as (keyof FormData)[])
    } else if (step === 2) {
      valid = await form.trigger(['activityDomains'])
    }
    if (valid) setStep((s) => s + 1)
  }

  function handleInvalid() {
    setServerError('Certains champs sont invalides. Vérifiez les étapes précédentes.')
  }

  async function handleSubmit(data: FormData) {
    // Step 3 validation before submit
    const step3 = stepContactsSchema.safeParse({
      contacts: data.contacts,
      rgpdConsent: data.rgpdConsent,
    })
    if (!step3.success) {
      const first = step3.error.issues[0]
      if (first) setServerError(first.message)
      return
    }

    setIsSubmitting(true)
    setServerError(null)

    try {
      const result = await submitAdhesion(data)

      setIsSubmitting(false)

      if (!result.success) {
        const firstError = Object.values(result.errors)[0]?.[0]
        setServerError(firstError ?? 'Une erreur est survenue. Réessayez.')
        return
      }

      localStorage.removeItem(DRAFT_KEY)
      setSubmitted(true)

      if (onSuccess) {
        onSuccess(result.slug)
      }
    } catch {
      setIsSubmitting(false)
      setServerError('Une erreur est survenue. Veuillez réessayer dans quelques instants.')
    }
  }

  if (submitted) {
    return (
      <div className="adhesion-success">
        <div className="adhesion-success-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
            <circle cx="24" cy="24" r="24" fill="var(--open-magenta)" opacity=".12" />
            <path
              d="M14 24l7 7 13-13"
              stroke="var(--open-magenta)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>Demande envoyée !</h2>
        <p>
          Votre demande d&apos;adhésion a été transmise au bureau d&apos;OPEN. Vous recevrez une
          confirmation par email sous 48 h.
        </p>
        <button type="button" className="btn" onClick={() => router.push('/')}>
          Retour à l&apos;accueil <ArrowIcon />
        </button>
      </div>
    )
  }

  return (
    <div className="adhesion-shell">
      <Stepper steps={STEPS} currentStep={step} />

      <form onSubmit={form.handleSubmit(handleSubmit, handleInvalid)} noValidate>
        {step === 1 && (
          <fieldset className="form-step">
            <legend className="form-step-legend">Informations entreprise</legend>
            <div className="form-grid">
              <div className="form-field form-field--full">
                <label htmlFor="name">
                  Raison sociale <span aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="organization"
                  aria-required="true"
                  aria-describedby={form.formState.errors.name ? 'name-error' : undefined}
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p id="name-error" className="field-error" role="alert">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="legalStatus">
                  Statut juridique <span aria-hidden="true">*</span>
                </label>
                <select
                  id="legalStatus"
                  aria-required="true"
                  aria-describedby={
                    form.formState.errors.legalStatus ? 'legalStatus-error' : undefined
                  }
                  {...form.register('legalStatus')}
                >
                  <option value="">Choisir…</option>
                  {LEGAL_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.legalStatus && (
                  <p id="legalStatus-error" className="field-error" role="alert">
                    {form.formState.errors.legalStatus.message}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="tahitiNumber">N° TAHITI</label>
                <input
                  id="tahitiNumber"
                  type="text"
                  placeholder="123456"
                  aria-describedby={
                    form.formState.errors.tahitiNumber ? 'tahitiNumber-error' : 'tahitiNumber-hint'
                  }
                  {...form.register('tahitiNumber')}
                />
                <p id="tahitiNumber-hint" className="help-text">
                  6 chiffres, optionnellement suivi d&apos;une lettre
                </p>
                {form.formState.errors.tahitiNumber && (
                  <p id="tahitiNumber-error" className="field-error" role="alert">
                    {form.formState.errors.tahitiNumber.message}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="websiteUrl">Site web</label>
                <input
                  id="websiteUrl"
                  type="text"
                  placeholder="www.monsite.pf"
                  aria-describedby={
                    form.formState.errors.websiteUrl ? 'websiteUrl-error' : 'websiteUrl-hint'
                  }
                  {...form.register('websiteUrl', {
                    setValueAs: (v: string) => {
                      if (!v) return v
                      if (/^www\./i.test(v)) return `https://${v}`
                      return v
                    },
                  })}
                />
                <p id="websiteUrl-hint" className="help-text">
                  Ex : www.monsite.pf ou https://monsite.pf
                </p>
                {form.formState.errors.websiteUrl && (
                  <p id="websiteUrl-error" className="field-error" role="alert">
                    {form.formState.errors.websiteUrl.message}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="yearFounded">Année de création</label>
                <input
                  id="yearFounded"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2010"
                  {...form.register('yearFounded', {
                    setValueAs: (v: string) => v === '' ? undefined : parseInt(v, 10),
                  })}
                />
              </div>

              <div className="form-field">
                <label htmlFor="employeeCount">Nombre de salariés</label>
                <input
                  id="employeeCount"
                  type="number"
                  min="0"
                  placeholder="10"
                  {...form.register('employeeCount', {
                    setValueAs: (v: string) => v === '' ? undefined : parseInt(v, 10),
                  })}
                />
              </div>

              <div className="form-field form-field--full">
                <label htmlFor="description">Description (500 car. max.)</label>
                <textarea
                  id="description"
                  rows={4}
                  maxLength={500}
                  aria-describedby={
                    form.formState.errors.description ? 'description-error' : undefined
                  }
                  {...form.register('description')}
                />
                {form.formState.errors.description && (
                  <p id="description-error" className="field-error" role="alert">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="form-field form-field--full">
                <label className="checkbox-label">
                  <input type="checkbox" {...form.register('isMedefMember')} />
                  <span>Notre entreprise est membre du MEDEF Polynésie française</span>
                </label>
              </div>
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="form-step">
            <legend className="form-step-legend">
              Domaines d&apos;activité <span aria-hidden="true">*</span>
            </legend>
            <p className="form-step-hint">
              Sélectionnez tous les domaines qui correspondent à votre activité.
            </p>
            {form.formState.errors.activityDomains && (
              <p className="field-error" role="alert">
                {form.formState.errors.activityDomains.message}
              </p>
            )}
            <div className="domain-grid" role="group" aria-label="Domaines d'activité">
              {ACTIVITY_DOMAINS.map((domain) => (
                <label key={domain.id} className="domain-chip">
                  <input type="checkbox" value={domain.id} {...form.register('activityDomains')} />
                  <span>{domain.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset className="form-step">
            <legend className="form-step-legend">Contacts &amp; RGPD</legend>

            <div className="contacts-list">
              {fields.map((field, index) => (
                <div key={field.id} className="contact-entry">
                  <div className="contact-entry-header">
                    <span className="contact-entry-title">Contact {index + 1}</span>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => remove(index)}
                        aria-label={`Supprimer le contact ${index + 1}`}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor={`contacts.${index}.name`}>
                        Nom complet <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id={`contacts.${index}.name`}
                        type="text"
                        {...form.register(`contacts.${index}.name`)}
                      />
                      {form.formState.errors.contacts?.[index]?.name && (
                        <p className="field-error" role="alert">
                          {form.formState.errors.contacts[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor={`contacts.${index}.role`}>Fonction</label>
                      <input
                        id={`contacts.${index}.role`}
                        type="text"
                        placeholder="Directeur général, DSI…"
                        {...form.register(`contacts.${index}.role`)}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor={`contacts.${index}.email`}>
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id={`contacts.${index}.email`}
                        type="email"
                        autoComplete="email"
                        {...form.register(`contacts.${index}.email`)}
                      />
                      {form.formState.errors.contacts?.[index]?.email && (
                        <p className="field-error" role="alert">
                          {form.formState.errors.contacts[index]?.email?.message}
                        </p>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor={`contacts.${index}.phone`}>Téléphone</label>
                      <input
                        id={`contacts.${index}.phone`}
                        type="tel"
                        autoComplete="tel"
                        placeholder="+689 87 00 00 00"
                        {...form.register(`contacts.${index}.phone`)}
                      />
                    </div>

                    <div className="form-field form-field--full">
                      <label className="checkbox-label">
                        <input type="checkbox" {...form.register(`contacts.${index}.isPrimary`)} />
                        <span>Contact principal de l&apos;entreprise</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => append({ name: '', role: '', email: '', phone: '', isPrimary: false })}
            >
              + Ajouter un contact
            </button>

            <div className="form-field form-field--full" style={{ marginTop: '32px' }}>
              <label className="checkbox-label checkbox-label--required">
                <input
                  type="checkbox"
                  aria-describedby={form.formState.errors.rgpdConsent ? 'rgpd-error' : undefined}
                  {...form.register('rgpdConsent')}
                />
                <span>
                  J&apos;accepte que les informations saisies soient utilisées par OPEN PF dans le
                  cadre de la gestion des adhésions, conformément à notre{' '}
                  <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer">
                    politique de confidentialité
                  </a>
                  . <span aria-hidden="true">*</span>
                </span>
              </label>
              {form.formState.errors.rgpdConsent && (
                <p id="rgpd-error" className="field-error" role="alert">
                  {form.formState.errors.rgpdConsent.message}
                </p>
              )}
            </div>
          </fieldset>
        )}

        {serverError && (
          <p className="form-server-error" role="alert">
            {serverError}
          </p>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep((s) => s - 1)}
            >
              Précédent
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="btn" onClick={handleNext}>
              Suivant <ArrowIcon />
            </button>
          ) : (
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
              {!isSubmitting && <ArrowIcon />}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
