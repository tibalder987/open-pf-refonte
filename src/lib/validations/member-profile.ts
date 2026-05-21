import { z } from 'zod'

// P5: member profile completion schema (magic link)
export const memberProfileSchema = z.object({})

export type MemberProfileData = z.infer<typeof memberProfileSchema>
