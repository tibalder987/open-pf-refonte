import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { getDb } from '@/lib/db'
import { memberTokens } from '@/lib/db/schema'
import { hashMagicToken, verifyMagicToken } from '@/lib/auth/magic-link'
import { eq, and, gt, isNull } from 'drizzle-orm'
import { env } from '@/lib/env'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2 MB

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = req.headers.get('x-magic-token')
  if (!token || !verifyMagicToken(token)) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
  }

  const tokenHash = hashMagicToken(token)
  const db = getDb()
  const [record] = await db
    .select({ memberId: memberTokens.memberId })
    .from(memberTokens)
    .where(
      and(
        eq(memberTokens.tokenHash, tokenHash),
        gt(memberTokens.expiresAt, new Date()),
        isNull(memberTokens.usedAt),
      ),
    )
    .limit(1)

  if (!record) {
    return NextResponse.json({ error: 'Token expiré ou invalide' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Format non supporté (JPEG, PNG, WebP, SVG)' },
      { status: 400 },
    )
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 2 Mo)' }, { status: 400 })
  }

  const bytes = Buffer.from(await file.arrayBuffer())

  let uploadBuffer: Buffer
  let contentType: string
  let finalExt: string

  if (file.type === 'image/svg+xml') {
    uploadBuffer = bytes
    contentType = 'image/svg+xml'
    finalExt = 'svg'
  } else {
    uploadBuffer = await sharp(bytes)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer()
    contentType = 'image/webp'
    finalExt = 'webp'
  }

  const filename = `logos/${record.memberId}-${Date.now()}.${finalExt}`
  const blob = await put(filename, uploadBuffer, {
    access: 'public',
    contentType,
    token: env.BLOB_READ_WRITE_TOKEN,
  })

  return NextResponse.json({ url: blob.url })
}
