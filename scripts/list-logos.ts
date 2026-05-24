import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'

const envRaw = readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
for (const line of envRaw.split('\n')) {
  const idx = line.indexOf('=')
  if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
}
const sql = neon(env['DATABASE_URL']!)
const rows = await sql`SELECT slug, name, logo_url FROM members WHERE status = 'active' AND logo_url IS NOT NULL ORDER BY name`
for (const r of rows) console.log(`${r.slug} | ${r.name} | ${r.logo_url}`)
