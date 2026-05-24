import { z } from 'zod'

export const CONTACT_SUBJECTS = [
  "Information sur l'adhésion",
  'Partenariat',
  'Presse et communication',
  'Autre',
] as const

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Veuillez indiquer votre nom complet')
    .max(120, 'Nom trop long'),
  email: z.string().trim().email('Adresse email invalide').max(255),
  subject: z.enum(CONTACT_SUBJECTS, { message: 'Veuillez choisir un sujet' }),
  message: z
    .string()
    .trim()
    .min(10, 'Votre message doit contenir au moins 10 caractères')
    .max(5000, 'Message trop long (5000 caractères max)'),
  // Honeypot — must stay empty. Bots fill it, humans never see it.
  company: z.string().max(0).optional().or(z.literal('')),
})

export type ContactInput = z.infer<typeof contactSchema>
