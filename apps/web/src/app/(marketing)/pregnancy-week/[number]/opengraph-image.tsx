import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export const alt = 'Pregnancy Week — The Dad Center'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({
  params,
}: {
  params: Promise<{ number: string }>
}) {
  const { number } = await params
  const week = /^\d+$/.test(number) ? Number(number) : 0
  const briefingId = `PREG-W${String(week).padStart(2, '0')}`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: briefing } = await supabase
    .from('briefing_templates')
    .select('title')
    .eq('briefing_id', briefingId)
    .maybeSingle()

  const title = (briefing?.title as string | undefined) || `Pregnancy Week ${week}`
  const displayTitle = title.length > 80 ? title.slice(0, 77) + '...' : title

  return new ImageResponse(
    (
      <div
        style={{
          background: '#12100e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
        }}
      >
        {/* Week badge */}
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            fontWeight: 600,
            color: '#c4703f',
            border: '2px solid #c4703f',
            borderRadius: 8,
            padding: '6px 20px',
            marginBottom: 32,
          }}
        >
          Pregnancy Week {week}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: displayTitle.length > 50 ? 52 : 64,
            fontWeight: 700,
            color: '#faf6f0',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 32,
            maxWidth: 1000,
          }}
        >
          {displayTitle}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#7a6f62',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          A free guide for dads
        </div>

        {/* Copper divider */}
        <div
          style={{
            width: 80,
            height: 3,
            background: 'linear-gradient(90deg, #c4703f, #d4a853)',
            borderRadius: 2,
            marginBottom: 24,
          }}
        />

        {/* Branding */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: '#7a6f62',
          }}
        >
          The Dad Center
        </div>
      </div>
    ),
    { ...size }
  )
}
