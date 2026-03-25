type EmailType =
  | 'welcome'
  | 'partner_invited'
  | 'partner_joined'
  | 'subscription_confirmed'
  | 'subscription_expiring'
  | 'payment_failed'
  | 'weekly_briefing'
  | 'overdue_digest'
  | 're_engagement'
  | 'onboarding_drip'

export async function triggerEmail(
  type: EmailType,
  userId: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('triggerEmail: Missing SUPABASE_URL or SERVICE_ROLE_KEY')
    return
  }

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, user_id: userId, ...data }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error(`triggerEmail(${type}) failed:`, err)
    }
  } catch (err) {
    console.error(`triggerEmail(${type}) failed:`, err)
  }
}
