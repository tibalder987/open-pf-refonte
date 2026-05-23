/**
 * Pure utility functions for the OPEN PF member import pipeline.
 * All functions are exported and testable in isolation.
 */

// ─── URL helpers ──────────────────────────────────────────────────────────────

/**
 * Extract slug from an open.pf member URL.
 * e.g. "https://open.pf/adherents/proxi/" → "proxi"
 * Returns empty string if the URL does not match the expected pattern.
 */
export function extractSlugFromUrl(url: string): string {
  try {
    const u = new URL(url)
    // Expect pathname like /adherents/<slug>/ or /adherents/<slug>
    const match = /^\/adherents\/([^/]+)\/?$/.exec(u.pathname)
    if (!match || !match[1]) return ''
    return match[1]
  } catch {
    return ''
  }
}

// ─── Text normalization ───────────────────────────────────────────────────────

/**
 * Normalize a text string: trim leading/trailing whitespace,
 * collapse multiple consecutive whitespace chars (including newlines) to a
 * single space.
 */
export function normalizeText(text: string): string {
  return text
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// ─── Field extractors ─────────────────────────────────────────────────────────

/**
 * Extract the first email address found in a string.
 * Returns null if none found.
 */
export function extractEmail(text: string): string | null {
  const match = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.exec(text)
  return match?.[0] ?? null
}

/**
 * Extract the first phone number found in a string (French/Polynesian formats).
 * Accepts: 40 XX XX XX, +689 XX XX XX, 00689 XX XX XX, 8 digit, etc.
 * Returns null if none found.
 */
export function extractPhone(text: string): string | null {
  // tel: href strips the scheme, so we may receive "40 54 11 45" or "40541145"
  // Priority 1: international format
  const intl = /(?:\+689|00689)[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}[\s.\-]?\d{2}/.exec(text)
  if (intl?.[0]) return intl[0].trim()

  // Priority 2: local 8-digit format (xx xx xx xx)
  const local = /\b\d{2}[\s.\-]\d{2}[\s.\-]\d{2}[\s.\-]\d{2}\b/.exec(text)
  if (local?.[0]) return local[0].trim()

  // Priority 3: plain 8+ digit number
  const plain = /\b\d{8,}\b/.exec(text)
  if (plain?.[0]) return plain[0].trim()

  return null
}

// ─── Deduplication ───────────────────────────────────────────────────────────

/**
 * Deduplicate a list of URLs with case-insensitive comparison.
 * The first occurrence (case-preserved) is kept.
 * Result is sorted alphabetically.
 */
export function deduplicateUrls(urls: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const url of urls) {
    const key = url.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(url)
    }
  }
  return result.sort()
}

// ─── Domain mapping ───────────────────────────────────────────────────────────

/**
 * Normalize a domain label for comparison:
 * - Trim whitespace
 * - Collapse " /" and "/ " to " / "
 * - Decode HTML entities (&amp; → &)
 * - Normalize "IA&DATA" / "IA &amp; DATA" → "IA & DATA"
 */
export function normalizeDomainLabel(label: string): string {
  return label
    .trim()
    .replace(/&amp;/g, '&')
    // Normalize slash spacing: "foo /bar" | "foo/ bar" | "foo/bar" → "foo / bar"
    .replace(/\s*\/\s*/g, ' / ')
    // Normalize "IA&DATA" → "IA & DATA" (missing spaces around &)
    .replace(/(\w)&(\w)/g, '$1 & $2')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * Semantic mapping from legacy open.pf source labels to new DB labels.
 * Keys are lowercase normalized source labels; values are DB label fragments to match against.
 *
 * This table bridges the semantic gap between the old WordPress taxonomy
 * and the new DB taxonomy in the refactored platform.
 */
const LEGACY_DOMAIN_MAP: Record<string, string> = {
  // Old → New (approximate semantic mappings)
  'amo / ami': 'transformation digitale',
  'amo /ami': 'transformation digitale',
  'application': 'web & mobile',
  'sites & applis web': 'web & mobile',
  'commerce et services en ligne': 'web & mobile',
  'communication digitale': 'marketing digital',
  'conseil / expertise': 'audit & conseil',
  'developpement logiciels': 'développement logiciel',
  'développement logiciels': 'développement logiciel',
  'distribution et intégration': 'distribution & intégration',
  'hébergement / stockage / cloud': 'cloud & hébergement',
  'hébergement / stockage /cloud': 'cloud & hébergement',
  'ia & data': 'intelligence artificielle',
  'ia&data': 'intelligence artificielle',
  'normes / cybersécurité': 'cybersécurité',
  'normes /cybersécurité': 'cybersécurité',
  'admin / réseaux / système': 'infrastructure & réseaux',
  'admin / réseaux / systéme': 'infrastructure & réseaux',
  'télécom et voix sur ip': 'télécommunications',
  'fai': 'télécommunications',
  'formation': 'formation & enseignement',
  'organisme de formation / formateur': 'formation & enseignement',
  'droit spécialisé': 'rgpd & conformité',
  'banque - finance': 'services financiers numériques',
  'services financiers numériques': 'services financiers numériques',
  'crm / epm / dms / pim': 'développement logiciel',
  'edition de logiciels': 'développement logiciel',
  'sav': 'distribution & intégration',
  'vente de matériels informatique et audiovisuel': 'distribution & intégration',
  'écrans multimédias': 'médias numériques',
  'association': 'autre',
  'plateforme de financement participatif': 'services financiers numériques',
}

/**
 * Map a source domain label to a known domain in the DB.
 *
 * Matching strategy (in order):
 * 1. Exact match (case-insensitive, after normalization)
 * 2. Legacy semantic mapping table lookup
 * 3. Contains match (source normalized label is a substring of known, or vice versa)
 *
 * Returns { mapped: domainLabel | null, exact: boolean }
 */
export function mapDomain(
  sourceLabel: string,
  knownDomains: string[],
): { mapped: string | null; exact: boolean } {
  const normalized = normalizeDomainLabel(sourceLabel).toLowerCase()

  // 1. Exact match
  for (const known of knownDomains) {
    if (normalizeDomainLabel(known).toLowerCase() === normalized) {
      return { mapped: known, exact: true }
    }
  }

  // 2. Legacy semantic mapping
  const legacyTarget = LEGACY_DOMAIN_MAP[normalized]
  if (legacyTarget) {
    for (const known of knownDomains) {
      if (normalizeDomainLabel(known).toLowerCase().includes(legacyTarget.toLowerCase())) {
        return { mapped: known, exact: false }
      }
    }
  }

  // 3. Fuzzy: normalized source is contained in known or vice versa
  for (const known of knownDomains) {
    const knownNorm = normalizeDomainLabel(known).toLowerCase()
    if (knownNorm.includes(normalized) || normalized.includes(knownNorm)) {
      return { mapped: known, exact: false }
    }
  }

  return { mapped: null, exact: false }
}

// ─── HTML helpers (no external parser) ───────────────────────────────────────

/**
 * Extract the text content between two string markers in an HTML string.
 * Returns null if either marker is not found.
 */
export function between(html: string, start: string, end: string): string | null {
  const si = html.indexOf(start)
  if (si === -1) return null
  const ei = html.indexOf(end, si + start.length)
  if (ei === -1) return null
  return html.slice(si + start.length, ei)
}

/**
 * Strip all HTML tags from a string and collapse whitespace.
 */
export function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Decode common HTML entities.
 */
export function decodeEntities(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
}
