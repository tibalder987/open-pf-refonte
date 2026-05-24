/**
 * convert-to-webp.mjs
 *
 * Convertit toutes les images existantes (actualités + logos adhérents) en WebP
 * et met à jour les URLs en base de données.
 *
 * Usage :
 *   node scripts/convert-to-webp.mjs --dry-run          ← aperçu sans écriture
 *   node scripts/convert-to-webp.mjs --apply            ← conversion complète
 *   node scripts/convert-to-webp.mjs --apply --news     ← actualités seulement
 *   node scripts/convert-to-webp.mjs --apply --logos    ← logos seulement
 */

import { readFileSync } from 'fs'
import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'
import sharp from 'sharp'

const DRY_RUN = process.argv.includes('--dry-run')
const APPLY   = process.argv.includes('--apply')
const NEWS_ONLY  = process.argv.includes('--news')
const LOGOS_ONLY = process.argv.includes('--logos')

if (!DRY_RUN && !APPLY) {
  console.error('Usage: node scripts/convert-to-webp.mjs [--dry-run | --apply] [--news | --logos]')
  process.exit(1)
}

function parseEnv(path) {
  const env = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const idx = line.indexOf('=')
    if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  return env
}

const env          = parseEnv('.env.local')
const DATABASE_URL = env['DATABASE_URL']
const BLOB_TOKEN   = env['BLOB_READ_WRITE_TOKEN']

if (!DATABASE_URL) { console.error('DATABASE_URL manquant'); process.exit(1) }
if (APPLY && (!BLOB_TOKEN || BLOB_TOKEN === 'a_configurer')) {
  console.error('BLOB_READ_WRITE_TOKEN manquant'); process.exit(1)
}

const sql = neon(DATABASE_URL)

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function fmtKB(bytes) { return `${(bytes / 1024).toFixed(0)} kB` }
function fmtSaving(orig, final) {
  const pct = ((1 - final / orig) * 100).toFixed(0)
  return `-${pct}%`
}

async function downloadBuffer(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'OPEN-PF-WebP/1.0' } })
    if (!res.ok) return null
    return Buffer.from(await res.arrayBuffer())
  } catch {
    return null
  }
}

async function processImage(currentUrl, destPath, maxW, maxH) {
  const ext = currentUrl.split('.').pop()?.split('?')[0]?.toLowerCase() ?? ''

  if (ext === 'svg') return { skipped: 'SVG conservé' }

  const buf = await downloadBuffer(currentUrl)
  if (!buf) return { error: 'téléchargement échoué' }

  const webpBuf = await sharp(buf)
    .resize(maxW, maxH, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer()

  if (DRY_RUN) {
    return { dryRun: true, origSize: buf.length, webpSize: webpBuf.length }
  }

  const { url } = await put(destPath, webpBuf, {
    access: 'public',
    contentType: 'image/webp',
    token: BLOB_TOKEN,
    addRandomSuffix: false,
    allowOverwrite: true,
  })

  return { url, origSize: buf.length, webpSize: webpBuf.length }
}

async function migrateNews() {
  const rows = await sql`
    SELECT id, slug, image_url
    FROM news
    WHERE image_url IS NOT NULL AND status = 'published'
    ORDER BY published_at DESC
  `
  console.log(`\n📰  ${rows.length} articles avec image\n`)

  let done = 0, skipped = 0, errors = 0, totalSaved = 0

  for (const row of rows) {
    const label = (row.slug ?? '').slice(0, 52).padEnd(52)
    process.stdout.write(`  ▸ ${label} `)

    try {
      const result = await processImage(
        row.image_url,
        `news-images/${row.slug}.webp`,
        1600, 900,
      )

      if (result.skipped) { console.log(`— ${result.skipped}`); skipped++; continue }
      if (result.error)   { console.log(`⚠  ${result.error}`); errors++; continue }
      if (result.dryRun) {
        console.log(`[DRY] ${fmtKB(result.origSize)} → ${fmtKB(result.webpSize)} (${fmtSaving(result.origSize, result.webpSize)})`)
        done++; continue
      }

      await sql`UPDATE news SET image_url = ${result.url} WHERE id = ${row.id}`
      totalSaved += result.origSize - result.webpSize
      console.log(`✓  ${fmtKB(result.origSize)} → ${fmtKB(result.webpSize)} (${fmtSaving(result.origSize, result.webpSize)})`)
      done++
    } catch (e) {
      console.log(`✗  ${e instanceof Error ? e.message : String(e)}`)
      errors++
    }
    await sleep(200)
  }

  console.log(`\n  Actualités : ✅ ${done} convertis | ↩ ${skipped} ignorés | ❌ ${errors} erreurs`)
  if (!DRY_RUN && totalSaved > 0) console.log(`  💾 Économie : ${fmtKB(totalSaved)}`)
  return totalSaved
}

async function migrateLogos() {
  const rows = await sql`
    SELECT id, slug, logo_url
    FROM members
    WHERE logo_url IS NOT NULL
    ORDER BY name
  `
  console.log(`\n🏢  ${rows.length} membres avec logo\n`)

  let done = 0, skipped = 0, errors = 0, totalSaved = 0

  for (const row of rows) {
    const label = (row.slug ?? row.id).slice(0, 52).padEnd(52)
    process.stdout.write(`  ▸ ${label} `)

    try {
      const result = await processImage(
        row.logo_url,
        `logos/${row.slug ?? row.id}.webp`,
        1200, 1200,
      )

      if (result.skipped) { console.log(`— ${result.skipped}`); skipped++; continue }
      if (result.error)   { console.log(`⚠  ${result.error}`); errors++; continue }
      if (result.dryRun) {
        console.log(`[DRY] ${fmtKB(result.origSize)} → ${fmtKB(result.webpSize)} (${fmtSaving(result.origSize, result.webpSize)})`)
        done++; continue
      }

      await sql`UPDATE members SET logo_url = ${result.url} WHERE id = ${row.id}`
      totalSaved += result.origSize - result.webpSize
      console.log(`✓  ${fmtKB(result.origSize)} → ${fmtKB(result.webpSize)} (${fmtSaving(result.origSize, result.webpSize)})`)
      done++
    } catch (e) {
      console.log(`✗  ${e instanceof Error ? e.message : String(e)}`)
      errors++
    }
    await sleep(150)
  }

  console.log(`\n  Logos : ✅ ${done} convertis | ↩ ${skipped} ignorés | ❌ ${errors} erreurs`)
  if (!DRY_RUN && totalSaved > 0) console.log(`  💾 Économie : ${fmtKB(totalSaved)}`)
  return totalSaved
}

async function run() {
  console.log(`\n${'='.repeat(65)}`)
  console.log(`🖼  CONVERT-TO-WEBP${DRY_RUN ? ' — DRY RUN (aucune écriture)' : ' — APPLY'}`)
  console.log('='.repeat(65))

  let grandTotal = 0

  if (!LOGOS_ONLY) grandTotal += await migrateNews()
  if (!NEWS_ONLY)  grandTotal += await migrateLogos()

  console.log('\n' + '='.repeat(65))
  if (!DRY_RUN && grandTotal > 0) {
    console.log(`💾  Économie totale : ${fmtKB(grandTotal)} (${(grandTotal / 1024 / 1024).toFixed(2)} MB)`)
  }
  if (DRY_RUN) {
    console.log('   Pour appliquer : node scripts/convert-to-webp.mjs --apply')
  }
  console.log('='.repeat(65) + '\n')
}

run().catch(e => { console.error(e); process.exit(1) })
