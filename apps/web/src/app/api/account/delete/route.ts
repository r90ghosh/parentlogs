import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getStripe } from '@/lib/stripe/server'

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

    // Check family ownership BEFORE any deletions
    if (profile?.family_id) {
      const { data: family } = await supabaseAdmin
        .from('families')
        .select('owner_id')
        .eq('id', profile.family_id)
        .single()

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
    }

    // Delete user-scoped data (child tables first)
    const { error: notifError } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('user_id', user.id)
    if (notifError) console.error('Failed to delete notifications:', notifError)

    const { error: moodError } = await supabaseAdmin
      .from('mood_checkins')
      .delete()
      .eq('user_id', user.id)
    if (moodError) console.error('Failed to delete mood_checkins:', moodError)

    const { error: dadProfileError } = await supabaseAdmin
      .from('dad_profiles')
      .delete()
      .eq('user_id', user.id)
    if (dadProfileError) console.error('Failed to delete dad_profiles:', dadProfileError)

    const { error: notifPrefError } = await supabaseAdmin
      .from('notification_preferences')
      .delete()
      .eq('user_id', user.id)
    if (notifPrefError) console.error('Failed to delete notification_preferences:', notifPrefError)

    const { error: pushSubError } = await supabaseAdmin
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
    if (pushSubError) console.error('Failed to delete push_subscriptions:', pushSubError)

    const { error: deviceTokenError } = await supabaseAdmin
      .from('device_tokens')
      .delete()
      .eq('user_id', user.id)
    if (deviceTokenError) console.error('Failed to delete device_tokens:', deviceTokenError)

    const { error: contactError } = await supabaseAdmin
      .from('contact_messages')
      .delete()
      .eq('user_id', user.id)
    if (contactError) console.error('Failed to delete contact_messages:', contactError)

    // Cancel active Stripe subscription before deleting the record
    const { data: subRecord } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .single()

    if (subRecord?.stripe_subscription_id) {
      try {
        const stripe = getStripe()
        await stripe.subscriptions.cancel(subRecord.stripe_subscription_id)
      } catch (stripeError) {
        // Log but don't block account deletion — subscription may already be canceled
        console.error('Failed to cancel Stripe subscription:', stripeError)
      }
    }

    // Revoke RevenueCat subscriber access (for mobile purchases)
    try {
      const rcApiKey = process.env.REVENUECAT_API_KEY
      if (rcApiKey) {
        const res = await fetch(
          `https://api.revenuecat.com/v1/subscribers/${user.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${rcApiKey}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (!res.ok && res.status !== 404) {
          console.error(`RevenueCat delete failed (${res.status}): ${await res.text()}`)
        }
      }
    } catch (rcErr) {
      console.error('Failed to delete RevenueCat subscriber:', rcErr)
    }

    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id)
    if (subError) console.error('Failed to delete subscriptions:', subError)

    if (profile?.family_id) {
      // Re-check ownership for family cleanup (already validated above)
      const { data: family } = await supabaseAdmin
        .from('families')
        .select('owner_id')
        .eq('id', profile.family_id)
        .single()

      const { count } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', profile.family_id)

      const isOwner = family?.owner_id === user.id
      const hasOtherMembers = (count || 0) > 1

      // If owner and sole member, delete the family
      if (isOwner && !hasOtherMembers) {
        // Delete family-scoped data (child tables first)
        const { error: checklistError } = await supabaseAdmin
          .from('checklist_progress')
          .delete()
          .eq('family_id', profile.family_id)
        if (checklistError) console.error('Failed to delete checklist_progress:', checklistError)

        const { error: budgetError } = await supabaseAdmin
          .from('family_budget')
          .delete()
          .eq('family_id', profile.family_id)
        if (budgetError) console.error('Failed to delete family_budget:', budgetError)

        const { error: babyLogsError } = await supabaseAdmin
          .from('baby_logs')
          .delete()
          .eq('family_id', profile.family_id)
        if (babyLogsError) console.error('Failed to delete baby_logs:', babyLogsError)

        const { error: tasksError } = await supabaseAdmin
          .from('family_tasks')
          .delete()
          .eq('family_id', profile.family_id)
        if (tasksError) console.error('Failed to delete family_tasks:', tasksError)

        const { error: babiesError } = await supabaseAdmin
          .from('babies')
          .delete()
          .eq('family_id', profile.family_id)
        if (babiesError) console.error('Failed to delete babies:', babiesError)

        // Delete the family
        const { error: familyError } = await supabaseAdmin
          .from('families')
          .delete()
          .eq('id', profile.family_id)
        if (familyError) console.error('Failed to delete family:', familyError)
      }
    }

    // Delete user's profile (must be after family handling)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user.id)
    if (profileError) console.error('Failed to delete profile:', profileError)

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
