import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

await sql`
  INSERT INTO admin_users (id, email, password_hash, name, is_active)
  VALUES (
    gen_random_uuid(),
    'open2026@open.pf',
    '$2b$10$IBwCV2FyhMaczM6P/tB7luj0LqHW18z0OMtKxrh4tVgjh0al7ph5y',
    'Admin OPEN PF',
    true
  )
  ON CONFLICT (email) DO NOTHING
`

console.log('✅ Compte admin créé : email open2026@open.pf / mot de passe Open2026')
