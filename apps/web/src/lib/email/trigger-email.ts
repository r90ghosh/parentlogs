/**
 * Server-side helper to trigger transactional/notification emails
 * via the send-email edge function. Only use in API routes and server actions.
 */
export async function triggerEmail(
  type: string,
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
