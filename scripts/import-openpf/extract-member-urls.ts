/**
 * Step 1 — Extract all member profile URLs from open.pf
 *
 * Output: data/import/openpf-member-urls.json
 *
 * Run: pnpm import:openpf:urls
 */

import { writeFileSync } from 'fs'
import { mkdirSync } from 'fs'
import path from 'path'
import { deduplicateUrls, extractSlugFromUrl } from './lib/utils'
import type { UrlExtractionResult } from './lib/types'

const BASE_URL = 'https://open.pf'
const ARCHIVE_PAGES = [
  `${BASE_URL}/adherents/`,
  `${BASE_URL}/adherents/page/2/`,
  `${BASE_URL}/adherents/page/3/`,
  `${BASE_URL}/adherents/page/4/`,
  `${BASE_URL}/adherents/page/5/`,
  `${BASE_URL}/adherents/page/6/`,
]
const RATE_LIMIT_MS = 500
const REQUEST_TIMEOUT_MS = 10_000
const USER_AGENT = 'OPEN-PF-Import/1.0 (migration script)'

const KNOWN_MEMBER_URLS: string[] = [
  'https://open.pf/adherents/proxi/',
  'https://open.pf/adherents/bbs/',
  'https://open.pf/adherents/clusir-tahiti/',
  'https://open.pf/adherents/fenua-online/',
  'https://open.pf/adherents/oraclia-sas/',
]

const OUT_DIR = path.resolve(process.cwd(), 'data/import')
const OUT_FILE = path.join(OUT_DIR, 'openpf-member-urls.json')

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
      console.error(`  ✗ HTTP ${res.status} for ${url}`)
      return null
    }
    return await res.text()
  } catch (err: unknown) {
    clearTimeout(timer)
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ✗ Fetch error for ${url}: ${msg}`)
    return null
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Extract member profile hrefs from an archive page HTML.
 * Accepts URLs matching https://open.pf/adherents/<slug>/ where:
 * - slug is non-empty
 * - not /adherents/ (bare)
 * - not /adherents/page/N/
 * - not /adherents/feed/
 */
function extractMemberUrlsFromHtml(html: string): string[] {
  const found: string[] = []
  // Match all href="https://open.pf/adherents/..." attributes
  const hrefRe = /href="(https:\/\/open\.pf\/adherents\/[^"]*)"/g
  let match: RegExpExecArray | null
  while ((match = hrefRe.exec(html)) !== null) {
    const href = match[1]
    if (!href) continue
    const slug = extractSlugFromUrl(href)
    if (!slug) continue // bare /adherents/ or pagination
    if (/^page\/?\d+\/?$/.test(slug)) continue
    if (slug === 'feed') continue
    found.push(href.endsWith('/') ? href : `${href}/`)
  }
  return found
}

async function main(): Promise<void> {
  console.log('=== OPEN PF — Extract Member URLs ===\n')

  mkdirSync(OUT_DIR, { recursive: true })

  const discoveredUrls: string[] = []
  const failedUrls: string[] = []

  for (const pageUrl of ARCHIVE_PAGES) {
    console.log(`Fetching archive: ${pageUrl}`)
    const html = await fetchPage(pageUrl)
    if (!html) {
      failedUrls.push(pageUrl)
      console.log(`  → FAILED`)
    } else {
      const found = extractMemberUrlsFromHtml(html)
      console.log(`  → found ${found.length} member links`)
      discoveredUrls.push(...found)
    }
    await sleep(RATE_LIMIT_MS)
  }

  const allRaw = [...KNOWN_MEMBER_URLS, ...discoveredUrls]
  const allUrls = deduplicateUrls(allRaw)
  const duplicatesRemoved = allRaw.length - allUrls.length

  const result: UrlExtractionResult = {
    knownUrls: KNOWN_MEMBER_URLS,
    discoveredUrls: deduplicateUrls(discoveredUrls),
    allUrls,
    duplicatesRemoved,
    failedUrls,
    generatedAt: new Date().toISOString(),
  }

  writeFileSync(OUT_FILE, JSON.stringify(result, null, 2), 'utf-8')

  console.log('\n=== Summary ===')
  console.log(`Known URLs:      ${KNOWN_MEMBER_URLS.length}`)
  console.log(`Discovered URLs: ${deduplicateUrls(discoveredUrls).length}`)
  console.log(`Total unique:    ${allUrls.length}`)
  console.log(`Duplicates:      ${duplicatesRemoved}`)
  console.log(`Failed pages:    ${failedUrls.length}`)
  console.log(`\nWritten to: ${OUT_FILE}`)
}

main().catch((err: unknown) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
