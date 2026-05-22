'use client'

import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import type { AdhesionData } from '@/lib/validations/adhesion'

interface Props {
  form: UseFormReturn<AdhesionData>
}

export function StepContacts({ form }: Props) {
  const {
    register,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts',
  })

  return (
    <fieldset className="form-step">
      <legend className="form-step-legend">Contacts</legend>
      <p className="form-step-hint">
        Ajoutez les contacts de votre entreprise. Désignez un contact principal.
      </p>

      <div className="contacts-list">
        {fields.map((field, index) => {
          const nameErr = errors.contacts?.[index]?.name?.message
          const emailErr = errors.contacts?.[index]?.email?.message
          return (
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
                    aria-required="true"
                    aria-describedby={nameErr ? `contact-${index}-name-error` : undefined}
                    {...register(`contacts.${index}.name`)}
                  />
                  {nameErr && (
                    <p id={`contact-${index}-name-error`} className="field-error" role="alert">
                      {nameErr}
                    </p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor={`contacts.${index}.role`}>Fonction</label>
                  <input
                    id={`contacts.${index}.role`}
                    type="text"
                    placeholder="Directeur général, DSI…"
                    {...register(`contacts.${index}.role`)}
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
                    aria-required="true"
                    aria-describedby={emailErr ? `contact-${index}-email-error` : undefined}
                    {...register(`contacts.${index}.email`)}
                  />
                  {emailErr && (
                    <p id={`contact-${index}-email-error`} className="field-error" role="alert">
                      {emailErr}
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
                    {...register(`contacts.${index}.phone`)}
                  />
                </div>

                <div className="form-field form-field--full">
                  <label className="checkbox-label">
                    <input type="checkbox" {...register(`contacts.${index}.isPrimary`)} />
                    <span>Contact principal de l&apos;entreprise</span>
                  </label>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="btn btn-secondary btn-small"
        onClick={() => append({ name: '', role: '', email: '', phone: '', isPrimary: false })}
      >
        + Ajouter un contact
      </button>
    </fieldset>
  )
}
