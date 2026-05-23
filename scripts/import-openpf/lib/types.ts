/**
 * Type definitions for the OPEN PF member import pipeline.
 * All data flows: fetch → RawMemberProfile → CleanMemberProfile → MergePlanEntry
 */

// ─── Raw extraction (one-to-one mapping with source HTML) ────────────────────

export interface RawSocialLinks {
  linkedin: string | null
  facebook: string | null
}

export interface RawMemberProfile {
  /** Source URL e.g. https://open.pf/adherents/proxi/ */
  sourceUrl: string
  /** Slug extracted from source URL e.g. "proxi" */
  slug: string
  /** Company name from h3 inside .pordetboxwhitebg */
  name: string | null
  /** Logo src from .logoimage img */
  logoUrl: string | null
  /** Contact person name from .g-list-leader-name span */
  contactName: string | null
  /** Address from .g-list-itm with fa-map-marker */
  address: string | null
  /** Email from mailto: link */
  email: string | null
  /** Phone from tel: link */
  phone: string | null
  /** Website from .clssitelink href */
  website: string | null
  /** Social links */
  socialLinks: RawSocialLinks
  /** Activity domains from .optionslistitem text */
  domains: string[]
  /** Presentation text from after h5 Présentation */
  presentation: string | null
  /** Whether extraction succeeded */
  extractionSuccess: boolean
  /** Error message if extraction failed */
  extractionError: string | null
  /** Timestamp of extraction */
  extractedAt: string
}

// ─── Clean profile (normalized, ready for comparison) ────────────────────────

export type ImportStatus = 'extracted' | 'partial' | 'failed'

export interface CleanMemberProfile extends RawMemberProfile {
  /** Normalized company name */
  nameNormalized: string | null
  /** Normalized email */
  emailNormalized: string | null
  /** Normalized website URL */
  websiteNormalized: string | null
  /** Import status */
  importStatus: ImportStatus
}

// ─── Merge plan ───────────────────────────────────────────────────────────────

export interface FieldConflict {
  field: string
  sourceValue: string
  dbValue: string
}

export interface FieldToFill {
  field: string
  value: string
}

export type MergeAction = 'update' | 'create' | 'skip' | 'failed'

export interface MatchInfo {
  matchedBy: 'slug' | 'name' | 'email' | 'website' | null
  dbId: string | null
  dbSlug: string | null
  dbName: string | null
}

export interface MergePlanEntry {
  sourceUrl: string
  slug: string
  sourceName: string | null
  action: MergeAction
  matchInfo: MatchInfo
  /** Fields that are null/empty in DB but present in source — safe to fill */
  fieldsToFill: FieldToFill[]
  /** Fields that differ between source and DB — require human review */
  conflicts: FieldConflict[]
  /** Whether this entry needs human review before import */
  needsReview: boolean
  /** Mapped domain IDs (from activityDomains table) */
  mappedDomains: Array<{ sourceLabel: string; domainId: string | null; exact: boolean }>
  /** Human-readable reason for the action */
  reason: string
}

// ─── Output file structures ───────────────────────────────────────────────────

export interface UrlExtractionResult {
  knownUrls: string[]
  discoveredUrls: string[]
  allUrls: string[]
  duplicatesRemoved: number
  failedUrls: string[]
  generatedAt: string
}

export interface MergePlan {
  generatedAt: string
  sourceFile: string
  totalProfiles: number
  updates: MergePlanEntry[]
  creates: MergePlanEntry[]
  skipped: MergePlanEntry[]
  failed: MergePlanEntry[]
  unmappedDomains: string[]
}

// ─── DB row shapes (read-only, no writes) ────────────────────────────────────

export interface DbMemberRow {
  id: string
  slug: string
  name: string
  logoUrl: string | null
  description: string | null
  websiteUrl: string | null
  address: string | null
  linkedinUrl: string | null
  tahitiNumber: string | null
}

export interface DbContactRow {
  memberId: string
  email: string
  phone: string | null
  name: string
}

export interface DbDomainRow {
  id: string
  label: string
}
