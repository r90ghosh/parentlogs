import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function DELETE(request: NextRequest) {
  try {
    // Create server client to get current user
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use admin client for deletion operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get user's profile to check family ownership
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (profile?.family_id) {
      // Check if user is family owner
      const { data: family } = await supabaseAdmin
        .from('families')
        .select('owner_id')
        .eq('id', profile.family_id)
        .single()

      // Count family members
      const { count } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', profile.family_id)

      const isOwner = family?.owner_id === user.id
      const hasOtherMembers = (count || 0) > 1

      if (isOwner && hasOtherMembers) {
        return NextResponse.json(
          { error: 'Cannot delete account while other family members exist. Transfer ownership first.' },
          { status: 400 }
        )
      }

      // If owner and sole member, delete the family
      if (isOwner && !hasOtherMembers) {
        // Delete family-related data
        await supabaseAdmin
          .from('family_tasks')
          .delete()
          .eq('family_id', profile.family_id)

        await supabaseAdmin
          .from('baby_logs')
          .delete()
          .eq('family_id', profile.family_id)

        await supabaseAdmin
          .from('family_budget_items')
          .delete()
          .eq('family_id', profile.family_id)

        await supabaseAdmin
          .from('checklist_progress')
          .delete()
          .eq('family_id', profile.family_id)

        // Delete the family
        await supabaseAdmin
          .from('families')
          .delete()
          .eq('id', profile.family_id)
      }
    }

    // Delete user's notification preferences
    await supabaseAdmin
      .from('notification_preferences')
      .delete()
      .eq('user_id', user.id)

    // Delete user's subscription
    await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id)

    // Delete user's push subscriptions
    await supabaseAdmin
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)

    // Delete user's profile
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user.id)

    // Delete the auth user (this is the final step)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete account. Please contact support.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting your account' },
      { status: 500 }
    )
  }
}
