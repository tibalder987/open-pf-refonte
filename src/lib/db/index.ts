import { neon } from '@neondatabase/serverless'
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

type Schema = typeof schema

let _db: NeonHttpDatabase<Schema> | undefined

export function getDb(): NeonHttpDatabase<Schema> {
  if (_db) return _db
  const url = process.env['DATABASE_URL']
  if (!url) throw new Error('DATABASE_URL is not set')
  _db = drizzle(neon(url), { schema })
  return _db
}
