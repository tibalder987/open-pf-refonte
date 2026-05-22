'use client'

import type { UseFormReturn } from 'react-hook-form'
import type { AdhesionData } from '@/lib/validations/adhesion'
import { LEGAL_STATUSES, ACTIVITY_DOMAINS, CERTIFICATIONS } from '@/lib/data/referentials'

interface Props {
  form: UseFormReturn<AdhesionData>
}

export function StepRecap({ form }: Props) {
  const {
    register,
    getValues,
    formState: { errors },
  } = form
  const v = getValues()

  const legalLabel = LEGAL_STATUSES.find((s) => s.id === v.legalStatus)?.label ?? v.legalStatus
  const domainLabels = v.activityDomains.map(
    (id) => ACTIVITY_DOMAINS.find((d) => d.id === id)?.label ?? id,
  )
  const certLabels = v.certifications.map(
    (id) => CERTIFICATIONS.find((c) => c.id === id)?.label ?? id,
  )
  const primaryContact = v.contacts.find((c) => c.isPrimary) ?? v.contacts[0]

  return (
    <div className="form-step">
      <h3 className="form-step-legend">Récapitulatif &amp; consentement</h3>

      <div className="recap-section">
        <p className="recap-title">Entreprise</p>
        <dl className="recap-dl">
          <div className="recap-row">
            <dt>Raison sociale</dt>
            <dd>{v.name || '—'}</dd>
          </div>
          <div className="recap-row">
            <dt>Statut juridique</dt>
            <dd>{legalLabel || '—'}</dd>
          </div>
          {v.tahitiNumber && (
            <div className="recap-row">
              <dt>N° TAHITI</dt>
              <dd>{v.tahitiNumber}</dd>
            </div>
          )}
          {v.websiteUrl && (
            <div className="recap-row">
              <dt>Site web</dt>
              <dd>{v.websiteUrl}</dd>
            </div>
          )}
          {v.yearFounded !== undefined && (
            <div className="recap-row">
              <dt>Année de création</dt>
              <dd>{v.yearFounded}</dd>
            </div>
          )}
          {v.employeeCount !== undefined && (
            <div className="recap-row">
              <dt>Salariés</dt>
              <dd>{v.employeeCount}</dd>
            </div>
          )}
          {v.isMedefMember && (
            <div className="recap-row">
              <dt>MEDEF PF</dt>
              <dd>Membre</dd>
            </div>
          )}
          {v.description && (
            <div className="recap-row recap-row--full">
              <dt>Description</dt>
              <dd>{v.description}</dd>
            </div>
          )}
        </dl>
      </div>

      {primaryContact && (
        <div className="recap-section">
          <p className="recap-title">Contact principal</p>
          <dl className="recap-dl">
            <div className="recap-row">
              <dt>Nom</dt>
              <dd>{primaryContact.name}</dd>
            </div>
            {primaryContact.role && (
              <div className="recap-row">
                <dt>Fonction</dt>
                <dd>{primaryContact.role}</dd>
              </div>
            )}
            <div className="recap-row">
              <dt>Email</dt>
              <dd>{primaryContact.email}</dd>
            </div>
            {primaryContact.phone && (
              <div className="recap-row">
                <dt>Téléphone</dt>
                <dd>{primaryContact.phone}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {domainLabels.length > 0 && (
        <div className="recap-section">
          <p className="recap-title">Domaines d&apos;activité</p>
          <div className="recap-tags">
            {domainLabels.map((label) => (
              <span key={label} className="recap-tag">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {certLabels.length > 0 && (
        <div className="recap-section">
          <p className="recap-title">Certifications</p>
          <div className="recap-tags">
            {certLabels.map((label) => (
              <span key={label} className="recap-tag">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="recap-rgpd">
        <label className="checkbox-label">
          <input
            type="checkbox"
            aria-required="true"
            aria-describedby={errors.rgpdConsent ? 'rgpd-error' : undefined}
            {...register('rgpdConsent')}
          />
          <span>
            J&apos;accepte que les informations saisies soient utilisées par OPEN PF dans le cadre
            de la gestion des adhésions, conformément à notre{' '}
            <a href="/confidentialite" target="_blank" rel="noopener noreferrer">
              politique de confidentialité
            </a>
            . <span aria-hidden="true">*</span>
          </span>
        </label>
        {errors.rgpdConsent && (
          <p id="rgpd-error" className="field-error" role="alert">
            {errors.rgpdConsent.message}
          </p>
        )}
      </div>
    </div>
  )
}
