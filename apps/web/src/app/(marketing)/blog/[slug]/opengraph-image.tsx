import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export const alt = 'Blog Post | The Dad Center'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const categoryLabels: Record<string, { label: string; color: string }> = {
  budget: { label: 'Budget & Costs', color: '#d4a853' },
  guides: { label: 'Dad Guides', color: '#c4703f' },
  comparisons: { label: 'Comparisons', color: '#5b9bd5' },
  lifestyle: { label: 'New Dad Life', color: '#6b8f71' },
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, category')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  const title = post?.title || 'Blog Post'
  const category = post?.category as string | undefined
  const categoryConfig = category ? categoryLabels[category] : null

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
        {/* Category badge */}
        {categoryConfig && (
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              fontWeight: 600,
              color: categoryConfig.color,
              border: `2px solid ${categoryConfig.color}`,
              borderRadius: 8,
              padding: '6px 20px',
              marginBottom: 32,
            }}
          >
            {categoryConfig.label}
          </div>
        )}

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
