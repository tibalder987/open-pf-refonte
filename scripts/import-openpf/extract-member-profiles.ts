/**
 * Step 2 — Fetch and parse each member profile from open.pf
 *
 * Input:  data/import/openpf-member-urls.json
 * Output: data/import/openpf-members-raw.json
 *         data/import/openpf-members-clean.json
 *
 * Run: pnpm import:openpf:extract
 */

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import {
  between,
  decodeEntities,
  extractEmail,
  extractPhone,
  extractSlugFromUrl,
  normalizeText,
  stripTags,
} from './lib/utils'
import type {
  CleanMemberProfile,
  ImportStatus,
  RawMemberProfile,
  UrlExtractionResult,
} from './lib/types'

const DATA_DIR = path.resolve(process.cwd(), 'data/import')
const URLS_FILE = path.join(DATA_DIR, 'openpf-member-urls.json')
const RAW_FILE = path.join(DATA_DIR, 'openpf-members-raw.json')
const CLEAN_FILE = path.join(DATA_DIR, 'openpf-members-clean.json')

const RATE_LIMIT_MS = 600
const REQUEST_TIMEOUT_MS = 10_000
const USER_AGENT = 'OPEN-PF-Import/1.0 (migration script)'

// ─── HTTP ─────────────────────────────────────────────────────────────────────

async function fetchPage(url: string): Promise<string | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) {
      console.error(`  ✗ HTTP ${res.status}`)
      return null
    }
    return await res.text()
  } catch (err: unknown) {
    clearTimeout(timer)
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ✗ Fetch error: ${msg}`)
    return null
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── HTML parsing ─────────────────────────────────────────────────────────────

/**
 * Parse a member profile page.
 *
 * HTML structure (confirmed from https://open.pf/adherents/proxi/):
 *
 *  <section class="gallery geldetpagesec">
 *    <div class="prodetboxsec">
 *      <div class="pordetleftbox">
 *        <div class="pordetboxwhitebg">
 *          <div class="logoimage"><img src="..."></div>
 *          <div class="sitemember g-list-itm g-list-leader-name"><i...></i><span>Name</span></div>
 *          <div class="sitemember g-list-itm g-list-leader-name"><i fa-map-marker></i><span>Address</span></div>
 *          <div class="sitemember g-list-itm g-list-email"><a href="mailto:...">email</a></div>
 *          <div class="sitemember g-list-itm g-list-tel"><a href="tel:...">phone</a></div>
 *          <div class="sitelink ..."><a class="lien url clssitelink" href="https://...">Site internet</a></div>
 *          <ul class="gc-adherents-sin-social">
 *            <li><a class="linkedin" href="..."></a></li>
 *            <li><a class="facebook" href="..."></a></li>
 *          </ul>
 *        </div>
 *      </div>
 *      <div class="prodetcontsec gcprodetcontsec">
 *        <div class="pordetboxwhitebg">
 *          <h3>Company Name</h3>
 *          <div class="optionslist">
 *            <div class='optionslistitem'><div class='optionlistbox'><span ...></span>Domain Label</div></div>
 *            ...
 *          </div>
 *        </div>
 *        <div class="pordetboxwhitebg">
 *          <h5>Présentation</h5>
 *          Presentation text...
 *        </div>
 *      </div>
 *    </div>
 *  </section>
 */
function parseMemberPage(html: string, sourceUrl: string): RawMemberProfile {
  const slug = extractSlugFromUrl(sourceUrl)
  const now = new Date().toISOString()

  try {
    // ── Isolate the main profile section ──────────────────────────────────
    // We work inside prodetboxsec to avoid matching footer/header content
    const profileSection = between(html, 'class="prodetboxsec"', '</section>') ?? html

    // ── Logo URL ──────────────────────────────────────────────────────────
    let logoUrl: string | null = null
    const logoSection = between(profileSection, 'class="logoimage"', '</div>')
    if (logoSection) {
      const imgMatch = /src="([^"]+)"/.exec(logoSection)
      logoUrl = imgMatch?.[1] ?? null
    }

    // ── Left box: contact details ─────────────────────────────────────────
    const leftBox = between(profileSection, 'class="pordetleftbox"', 'class="prodetcontsec') ?? profileSection

    // Contact name: first g-list-leader-name span
    let contactName: string | null = null
    const leaderMatches = leftBox.match(
      /g-list-leader-name[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>/,
    )
    if (leaderMatches?.[1]) {
      const raw = stripTags(leaderMatches[1])
      contactName = normalizeText(decodeEntities(raw)) || null
    }

    // Address: second g-list-leader-name (fa-map-marker) span
    let address: string | null = null
    const allLeaders = leftBox.match(
      /g-list-leader-name[\s\S]*?<span>([\s\S]*?)<\/span>/g,
    )
    if (allLeaders && allLeaders.length >= 2 && allLeaders[1]) {
      const spanMatch = /<span>([\s\S]*?)<\/span>/.exec(allLeaders[1])
      if (spanMatch?.[1]) {
        address = normalizeText(decodeEntities(stripTags(spanMatch[1]))) || null
      }
    }

    // Email: href="mailto:..."
    let email: string | null = null
    const mailtoMatch = /href="mailto:([^"]+)"/.exec(leftBox)
    if (mailtoMatch?.[1]) {
      email = mailtoMatch[1].trim().toLowerCase()
    }

    // Phone: href="tel:..."
    let phone: string | null = null
    const telMatch = /href="tel:([^"]+)"/.exec(leftBox)
    if (telMatch?.[1]) {
      phone = extractPhone(telMatch[1]) ?? normalizeText(telMatch[1])
    }

    // Website: .clssitelink href
    let website: string | null = null
    const sitelinkMatch = /class="[^"]*clssitelink[^"]*"\s+href="([^"]+)"/.exec(leftBox)
    if (sitelinkMatch?.[1]) {
      website = sitelinkMatch[1].trim()
    }

    // Social links: gc-adherents-sin-social ul
    let linkedin: string | null = null
    let facebook: string | null = null
    const socialSection = between(leftBox, 'class="gc-adherents-sin-social"', '</ul>')
    if (socialSection) {
      const liMatch = /class="linkedin"\s+href="([^"]+)"/.exec(socialSection)
      linkedin = liMatch?.[1] ?? null
      const fbMatch = /class="facebook"\s+href="([^"]+)"/.exec(socialSection)
      facebook = fbMatch?.[1] ?? null
    }

    // ── Right box: company name + domains + presentation ──────────────────
    const rightBox =
      between(profileSection, 'class="prodetcontsec gcprodetcontsec"', '</section>') ??
      between(html, 'class="prodetcontsec', '</section>') ??
      ''

    // Company name: h3 inside pordetboxwhitebg
    let name: string | null = null
    const h3Match = /<h3>([\s\S]*?)<\/h3>/.exec(rightBox)
    if (h3Match?.[1]) {
      name = normalizeText(decodeEntities(stripTags(h3Match[1]))) || null
    }

    // Domains: all optionlistbox text content (strip <span style=...></span>)
    const domains: string[] = []
    const optionsSection = between(rightBox, 'class="optionslist"', '</div>\n\t\t\t\t\t</div>') ??
      between(rightBox, 'class="optionslist"', '</div>\n\t\t\t\t</div>') ??
      between(rightBox, 'class="optionslist"', '</div></div></div>')
    if (optionsSection) {
      const itemRe = /class='optionlistbox'><span[^>]*><\/span>([\s\S]*?)<\/div>/g
      let itemMatch: RegExpExecArray | null
      while ((itemMatch = itemRe.exec(optionsSection)) !== null) {
        const raw = decodeEntities(stripTags(itemMatch[1] ?? ''))
        const label = normalizeText(raw)
        if (label) domains.push(label)
      }
    }

    // Presentation: text after <h5>Présentation</h5>
    let presentation: string | null = null
    const presSection = between(rightBox, '<h5>Présentation</h5>', '</div>')
    if (presSection) {
      presentation = normalizeText(decodeEntities(stripTags(presSection))) || null
    }

    return {
      sourceUrl,
      slug,
      name,
      logoUrl,
      contactName,
      address,
      email,
      phone,
      website,
      socialLinks: { linkedin, facebook },
      domains,
      presentation,
      extractionSuccess: true,
      extractionError: null,
      extractedAt: now,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return {
      sourceUrl,
      slug,
      name: null,
      logoUrl: null,
      contactName: null,
      address: null,
      email: null,
      phone: null,
      website: null,
      socialLinks: { linkedin: null, facebook: null },
      domains: [],
      presentation: null,
      extractionSuccess: false,
      extractionError: msg,
      extractedAt: now,
    }
  }
}

// ─── Clean/normalize ──────────────────────────────────────────────────────────

function toClean(raw: RawMemberProfile): CleanMemberProfile {
  const importStatus: ImportStatus = !raw.extractionSuccess
    ? 'failed'
    : raw.name && (raw.email ?? raw.website)
      ? 'extracted'
      : 'partial'

  return {
    ...raw,
    nameNormalized: raw.name?.toLowerCase().trim() ?? null,
    emailNormalized: raw.email?.toLowerCase().trim() ?? null,
    websiteNormalized: raw.website
      ? raw.website
          .toLowerCase()
          .replace(/\/+$/, '')
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
      : null,
    importStatus,
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('=== OPEN PF — Extract Member Profiles ===\n')

  const urlData = JSON.parse(readFileSync(URLS_FILE, 'utf-8')) as UrlExtractionResult
  const urls = urlData.allUrls
  console.log(`Found ${urls.length} URLs to process\n`)

  const rawProfiles: RawMemberProfile[] = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    if (!url) continue
    process.stdout.write(`[${i + 1}/${urls.length}] ${url} ... `)

    const html = await fetchPage(url)
    if (!html) {
      console.log('FAILED')
      rawProfiles.push({
        sourceUrl: url,
        slug: extractSlugFromUrl(url),
        name: null,
        logoUrl: null,
        contactName: null,
        address: null,
        email: null,
        phone: null,
        website: null,
        socialLinks: { linkedin: null, facebook: null },
        domains: [],
        presentation: null,
        extractionSuccess: false,
        extractionError: 'HTTP fetch failed',
        extractedAt: new Date().toISOString(),
      })
    } else {
      const profile = parseMemberPage(html, url)
      console.log(`OK — name="${profile.name ?? '?'}", domains=${profile.domains.length}`)
      rawProfiles.push(profile)
    }

    if (i < urls.length - 1) {
      await sleep(RATE_LIMIT_MS)
    }
  }

  const cleanProfiles: CleanMemberProfile[] = rawProfiles.map(toClean)

  writeFileSync(RAW_FILE, JSON.stringify(rawProfiles, null, 2), 'utf-8')
  writeFileSync(CLEAN_FILE, JSON.stringify(cleanProfiles, null, 2), 'utf-8')

  const succeeded = rawProfiles.filter((p) => p.extractionSuccess).length
  const failed = rawProfiles.filter((p) => !p.extractionSuccess).length

  console.log('\n=== Summary ===')
  console.log(`Total:     ${rawProfiles.length}`)
  console.log(`Succeeded: ${succeeded}`)
  console.log(`Failed:    ${failed}`)
  console.log(`\nWritten to:`)
  console.log(`  ${RAW_FILE}`)
  console.log(`  ${CLEAN_FILE}`)
}

main().catch((err: unknown) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
