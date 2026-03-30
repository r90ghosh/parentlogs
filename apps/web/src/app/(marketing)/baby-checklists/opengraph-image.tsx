import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Baby Checklists — 15+ Curated Preparation Lists | The Dad Center'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
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
        {/* Copper accent line */}
        <div
          style={{
            width: 120,
            height: 4,
            background: 'linear-gradient(90deg, #c4703f, #d4a853)',
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#faf6f0',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Baby Checklists
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#c4703f',
            textAlign: 'center',
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          15+ Curated Preparation Lists
        </div>

        {/* Bottom copper line */}
        <div
          style={{
            width: 80,
            height: 3,
            background: 'linear-gradient(90deg, #d4a853, #c4703f)',
            borderRadius: 2,
          }}
        />

        {/* Domain */}
        <div
          style={{
            fontSize: 20,
            color: '#7a6f62',
            marginTop: 32,
          }}
        >
          thedadcenter.com
        </div>
      </div>
    ),
    { ...size }
  )
}
