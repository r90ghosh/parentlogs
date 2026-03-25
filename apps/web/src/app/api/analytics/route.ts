import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// NOTE: user_id is self-reported and untrusted. Do not use analytics data
// for billing, access control, or any security-sensitive decisions.
// For trusted user attribution, add JWT verification.

const VALID_PLATFORMS = ['web', 'ios', 'android'] as const
const MAX_REQUEST_SIZE = 50_000 // 50KB

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const

function sanitizeString(val: unknown, maxLen = 500): string | null {
  if (typeof val !== 'string') return null
  return val.slice(0, maxLen)
}

function clampInt(val: unknown, min: number, max: number): number {
  const n = typeof val === 'number' ? Math.floor(val) : 0
  return Math.max(min, Math.min(max, n))
}

function sanitizeProperties(props: unknown): Record<string, unknown> {
  if (typeof props !== 'object' || props === null) return {}
  const str = JSON.stringify(props)
  if (str.length > 2000) return {} // Drop oversized properties entirely
  try { return JSON.parse(str) } catch { return {} }
}

function getDurationBucket(seconds: number): string {
  if (seconds < 60) return '<1m'
  if (seconds < 300) return '1-5m'
  if (seconds < 600) return '5-10m'
  return '10+m'
}

function validatePlatform(val: unknown): 'web' | 'ios' | 'android' {
  if (typeof val === 'string' && VALID_PLATFORMS.includes(val as any)) {
    return val as 'web' | 'ios' | 'android'
  }
  return 'web'
}

export async function POST(request: NextRequest) {
  try {
    // sendBeacon sends as text/plain — use request.text() + JSON.parse()
    const text = await request.text()
    if (text.length > MAX_REQUEST_SIZE) {
      return NextResponse.json({ ok: true }, { headers: CORS_HEADERS })
    }

    const body = JSON.parse(text)
    const supabase = getSupabaseAdmin()
    const platform = validatePlatform(body.platform)

    if (body.type === 'events') {
      const events = Array.isArray(body.events) ? body.events.slice(0, 50) : []
      if (events.length === 0) {
        return NextResponse.json({ ok: true }, { headers: CORS_HEADERS })
      }

      const rows = events.map((e: any) => ({
        user_id: sanitizeString(body.user_id, 36) || null,
        session_id: sanitizeString(body.session_id, 36) || null,
        event_name: sanitizeString(e.event_name, 100) || 'unknown',
        properties: sanitizeProperties(e.properties),
        page_path: sanitizeString(e.page_path, 500) || null,
        platform,
      }))

      await supabase.from('analytics_events').insert(rows)
    } else if (body.type === 'engagement') {
      const durationSeconds = clampInt(body.duration_seconds, 0, 86400)

      await supabase.from('page_engagements').insert({
        user_id: sanitizeString(body.user_id, 36) || null,
        session_id: sanitizeString(body.session_id, 36) || null,
        page_path: sanitizeString(body.page_path, 500) || '/',
        page_group: sanitizeString(body.page_group, 50) || 'other',
        duration_seconds: durationSeconds,
        duration_bucket: getDurationBucket(durationSeconds),
        platform,
      })
    }
  } catch (error) {
    // Don't surface to users, but track for operational awareness
    if (process.env.NODE_ENV === 'production') {
      const Sentry = await import('@sentry/nextjs')
      Sentry.captureException(error, {
        level: 'warning',
        tags: { component: 'analytics-api' },
      })
    }
  }

  return NextResponse.json({ ok: true }, { headers: CORS_HEADERS })
}

// CORS preflight for mobile requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      'Access-Control-Max-Age': '86400',
    },
  })
}
