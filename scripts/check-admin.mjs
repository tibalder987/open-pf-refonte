import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

const users = await sql`SELECT id, email, name, is_active FROM admin_users`
console.log('Utilisateurs admin en base :', users)
