import { NextResponse } from 'next/server'

export async function POST() {
  // TODO P4: handle Brevo delivery webhooks
  return NextResponse.json({ ok: true })
}
