import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'About The Dad Center'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
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
        {/* Title */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: '#faf6f0',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 40,
            maxWidth: 1000,
          }}
        >
          About The Dad Center
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

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: '#ede6dc',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          The Operating System for Modern Fatherhood
        </div>

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
