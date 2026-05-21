import { z } from 'zod'

// P4: full adhesion form schema (3 steps)
export const adhesionSchema = z.object({})

export type AdhesionData = z.infer<typeof adhesionSchema>
