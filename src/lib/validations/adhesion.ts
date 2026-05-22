import { z } from 'zod'

export const stepEntrepriseSchema = z.object({
  name: z.string().min(2, 'Raison sociale requise (2 caractères min.)'),
  legalStatus: z.string().min(1, 'Statut juridique requis'),
  tahitiNumber: z
    .string()
    .regex(/^[0-9]{6}[A-Z]?$/, 'Format n° TAHITI invalide (ex : 123456 ou 123456B)')
    .optional()
    .or(z.literal('')),
  websiteUrl: z
    .string()
    .url('URL invalide (ex : www.monsite.pf ou https://monsite.pf)')
    .optional()
    .or(z.literal('')),
  description: z.string().max(500, '500 caractères max.').optional().or(z.literal('')),
  yearFounded: z
    .number()
    .int()
    .min(1900, 'Année invalide')
    .max(new Date().getFullYear(), 'Année invalide')
    .optional(),
  employeeCount: z.number().int().min(0, 'Nombre invalide').optional(),
  isMedefMember: z.boolean(),
})
export type StepEntrepriseData = z.infer<typeof stepEntrepriseSchema>

export const stepActivitesSchema = z.object({
  activityDomains: z.array(z.string()).min(1, "Sélectionnez au moins un domaine d'activité"),
})
export type StepActivitesData = z.infer<typeof stepActivitesSchema>

const contactSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  role: z.string().optional().or(z.literal('')),
  email: z.string().email('Email invalide'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{6,20}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
  isPrimary: z.boolean(),
})
export type ContactData = z.infer<typeof contactSchema>

export const stepContactsSchema = z
  .object({
    contacts: z.array(contactSchema).min(1, 'Au moins un contact est requis'),
  })
  .refine((data) => data.contacts.some((c) => c.isPrimary), {
    message: 'Un contact principal doit être désigné',
    path: ['contacts'],
  })
export type StepContactsData = z.infer<typeof stepContactsSchema>

export const stepCertificationsSchema = z.object({
  certifications: z.array(z.string()),
})
export type StepCertificationsData = z.infer<typeof stepCertificationsSchema>

export const adhesionSchema = stepEntrepriseSchema
  .merge(stepActivitesSchema)
  .merge(stepCertificationsSchema)
  .merge(
    z.object({
      contacts: z.array(contactSchema).min(1, 'Au moins un contact est requis'),
      rgpdConsent: z
        .boolean()
        .refine((v) => v === true, 'Vous devez accepter la politique de confidentialité'),
    }),
  )
export type AdhesionData = z.infer<typeof adhesionSchema>
