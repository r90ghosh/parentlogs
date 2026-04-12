import { ImageResponse } from 'next/og'
import { dadTips } from '@/data/dadTips'

export const runtime = 'edge'

export const alt = 'Dad Tips | The Dad Center'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const tip = dadTips.find((t) => t.id === slug)
  const title = tip?.name || 'Dad Tip'

  // Truncate long titles
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
        {/* Badge */}
        <div
          style={{
            display: 'flex',
            fontSize: 18,
            fontWeight: 600,
            color: '#c4703f',
            border: '2px solid #c4703f',
            borderRadius: 8,
            padding: '6px 20px',
            marginBottom: 32,
          }}
        >
          Dad Tips
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: displayTitle.length > 50 ? 48 : 60,
            fontWeight: 700,
            color: '#faf6f0',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 40,
            maxWidth: 1000,
          }}
        >
          {displayTitle}
        </div>

        {/* Copper divider */}
        <div
          style={{
            width: 80,
            height: 3,
            background: 'linear-gradient(90deg, #c4703f, #d4a853)',
            borderRadius: 2,
            marginBottom: 32,
          }}
        />

        {/* Branding */}
        <div
          style={{
            fontSize: 24,
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
