import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { triggerEmail } from '@/lib/email/trigger-email'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {}
          },
        },
      }
    )

    // Authenticate the caller
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get caller's profile (family_id + name)
    const supabaseAdmin = getSupabaseAdmin()
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('family_id, full_name')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) {
      return NextResponse.json({ error: 'Not in a family' }, { status: 400 })
    }

    // Find the family owner (notify them, not the caller)
    const { data: family } = await supabaseAdmin
      .from('families')
      .select('owner_id')
      .eq('id', profile.family_id)
      .single()

    if (family?.owner_id && family.owner_id !== user.id) {
      await triggerEmail('partner_joined', family.owner_id, {
        partner_name: profile.full_name || user.email,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Partner joined notification error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
