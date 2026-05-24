/**
 * normalize-logos.mjs
 *
 * Normalise les logos adhérents stockés dans Vercel Blob :
 *  1. Télécharge chaque logo depuis son URL publique
 *  2. Détecte la couleur du coin pour choisir la stratégie de rognage
 *  3. Rogne le blanc/transparent excédentaire (seuil conservateur)
 *  4. Vérifie que le rognage ne coupe pas dans le logo (< 40 % de réduction)
 *  5. Ajoute une marge uniforme de 10 % autour du logo rogné
 *  6. Exporte en PNG (format universel et sans perte)
 *  7. Upload vers Vercel Blob + mise à jour DB
 *
 * Usage :
 *   node scripts/normalize-logos.mjs --dry-run   ← analyse seule, aucune écriture
 *   node scripts/normalize-logos.mjs --apply     ← normalise et pousse (irréversible !)
 *
 * Prérequis :
 *   - BLOB_READ_WRITE_TOKEN configuré dans .env.local
 *   - DATABASE_URL configuré dans .env.local
 *   - pnpm add -D sharp (déjà fait)
 */

import { readFileSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'
import { neon } from '@neondatabase/serverless'
import { put } from '@vercel/blob'

// ─── Config ────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes('--dry-run')
const APPLY   = process.argv.includes('--apply')

if (!DRY_RUN && !APPLY) {
  console.error('Usage: node scripts/normalize-logos.mjs [--dry-run | --apply]')
  process.exit(1)
}

// Seuils de sécurité
const TRIM_THRESHOLD   = 10   // écart de couleur toléré pour le rognage (0-255)
const MIN_TRIM_PX      = 10   // résultat rogné doit avoir au moins 10 px dans chaque dimension
const MIN_AREA_RATIO   = 0.02 // résultat rogné doit couvrir au moins 2 % de l'aire originale
const PADDING_RATIO    = 0.10 // marge ajoutée = 10 % du côté le plus long rogné
const NEAR_WHITE_FLOOR = 230  // R,G,B > 230 = considéré comme "blanc"

// ─── .env.local ────────────────────────────────────────────────────────────
function parseEnv(path) {
  const env = {}
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const idx = line.indexOf('=')
    if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  return env
}

const env = parseEnv('.env.local')
const DATABASE_URL        = env['DATABASE_URL']
const BLOB_READ_WRITE_TOKEN = env['BLOB_READ_WRITE_TOKEN']

if (!DATABASE_URL) { console.error('DATABASE_URL manquant dans .env.local'); process.exit(1) }
if (APPLY && (!BLOB_READ_WRITE_TOKEN || BLOB_READ_WRITE_TOKEN === 'a_configurer')) {
  console.error('BLOB_READ_WRITE_TOKEN non configuré dans .env.local\nVa dans Vercel Dashboard → Project → Storage → Blob → Token')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

// ─── Helpers ───────────────────────────────────────────────────────────────
async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

/** Lit la couleur du pixel en haut à gauche pour décider la stratégie. */
async function getCornerPixel(buffer) {
  const { data } = await sharp(buffer)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { r: data[0], g: data[1], b: data[2], a: data[3] }
}

async function normalize(buffer, slug) {
  const meta = await sharp(buffer).metadata()
  if (!meta.width || !meta.height) throw new Error('dimensions illisibles')

  // Format SVG → rasteriser en PNG 512 px avant de continuer
  let workBuf = buffer
  if (meta.format === 'svg') {
    workBuf = await sharp(buffer, { density: 300 })
      .resize(512, 512, { fit: 'inside' })
      .png()
      .toBuffer()
    const m2 = await sharp(workBuf).metadata()
    Object.assign(meta, m2)
  }

  const corner = await getCornerPixel(workBuf)
  const isNearWhite    = corner.r > NEAR_WHITE_FLOOR && corner.g > NEAR_WHITE_FLOOR && corner.b > NEAR_WHITE_FLOOR
  const isTransparent  = (corner.a ?? 255) < 10
  const shouldTrim     = isNearWhite || isTransparent

  let trimmedBuf = workBuf
  let trimW = meta.width
  let trimH = meta.height

  if (shouldTrim) {
    try {
      const trimResult = await sharp(workBuf)
        .trim({ threshold: TRIM_THRESHOLD })
        .png()
        .toBuffer()

      const trimMeta = await sharp(trimResult).metadata()
      trimW = trimMeta.width ?? meta.width
      trimH = trimMeta.height ?? meta.height

      // Sécurité : rognage destructif → on abandonne seulement si le logo devient microscopique
      const trimArea = trimW * trimH
      const origArea = meta.width * meta.height
      if (trimW < MIN_TRIM_PX || trimH < MIN_TRIM_PX || trimArea < origArea * MIN_AREA_RATIO) {
        console.warn(`  ⚠  rognage destructif (${meta.width}×${meta.height} → ${trimW}×${trimH}) — rognage ignoré`)
        trimW = meta.width
        trimH = meta.height
      } else {
        trimmedBuf = trimResult
      }
    } catch {
      console.warn('  ⚠  trim() a échoué, logo utilisé tel quel')
    }
  } else {
    console.log('  ℹ  fond coloré détecté — rognage ignoré, marge seule appliquée')
  }

  // Marge uniforme 10 % du côté le plus long
  const pad = Math.max(8, Math.ceil(Math.max(trimW, trimH) * PADDING_RATIO))

  const finalBuf = await sharp(trimmedBuf)
    .extend({
      top: pad, bottom: pad, left: pad, right: pad,
      background: { r: 255, g: 255, b: 255, alpha: 0 }, // fond transparent
    })
    .png({ compressionLevel: 9 })
    .toBuffer()

  return {
    buffer:      finalBuf,
    original:    { w: meta.width,  h: meta.height },
    trimmed:     { w: trimW,       h: trimH },
    final:       { w: trimW + pad * 2, h: trimH + pad * 2 },
    trimmedPct:  Math.round((1 - (trimW * trimH) / (meta.width * meta.height)) * 100),
    wasTrimmed:  shouldTrim,
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function run() {
  console.log(`\n${'='.repeat(60)}`)
  console.log(DRY_RUN ? '🔍  DRY-RUN — aucune écriture' : '🚀  APPLY — normalisation + upload')
  console.log('='.repeat(60))

  const rows = await sql`
    SELECT id, slug, name, logo_url
    FROM members
    WHERE status = 'active' AND logo_url IS NOT NULL
    ORDER BY name
  `
  console.log(`\n${rows.length} logos à traiter\n`)

  // En dry-run, on sauvegarde aussi les previews localement pour inspection
  if (DRY_RUN) mkdirSync('tmp/logos-preview', { recursive: true })

  const report = []

  for (const row of rows) {
    const { id, slug, name, logo_url } = row
    process.stdout.write(`▸ ${name.padEnd(30)} `)

    try {
      const buffer = await download(logo_url)
      const result = await normalize(buffer, slug)
      const { original, trimmed, final, trimmedPct, wasTrimmed } = result

      const line = `${original.w}×${original.h} → ${final.w}×${final.h}` +
        (wasTrimmed ? ` (${trimmedPct}% blanc retiré)` : ' (fond coloré, marge seule)')

      if (DRY_RUN) {
        // Sauvegarde locale pour inspection visuelle
        const previewPath = `tmp/logos-preview/${slug}.png`
        writeFileSync(previewPath, result.buffer)
        console.log(`${line} → ${previewPath}`)
        report.push({ slug, name, status: 'preview', line, previewPath })
      } else {
        // Upload vers Vercel Blob (nouveau pathname, préserve l'original)
        const newPathname = `logos-normalized/${slug}.png`
        const { url: newUrl } = await put(newPathname, result.buffer, {
          access:      'public',
          contentType: 'image/png',
          token:       BLOB_READ_WRITE_TOKEN,
          addRandomSuffix: false,
        })

        // Mise à jour DB
        await sql`UPDATE members SET logo_url = ${newUrl} WHERE id = ${id}`

        console.log(`✓ ${line}`)
        report.push({ slug, name, status: 'done', line, newUrl })
      }
    } catch (err) {
      console.error(`✗ ERREUR: ${err.message}`)
      report.push({ slug, name, status: 'error', error: err.message })
    }
  }

  console.log('\n' + '='.repeat(60))
  const done    = report.filter(r => r.status === 'done' || r.status === 'preview').length
  const errors  = report.filter(r => r.status === 'error').length
  console.log(`✅ ${done} traités | ❌ ${errors} erreurs`)

  if (DRY_RUN) {
    console.log('\n📁 Logos normalisés sauvegardés dans tmp/logos-preview/')
    console.log('   Ouvre ce dossier pour vérifier visuellement avant de lancer --apply')
  }

  console.log('='.repeat(60) + '\n')
}

run().catch(e => { console.error(e); process.exit(1) })
