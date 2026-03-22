import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from '@/lib/supabase'

export async function signInWithGoogle(): Promise<void> {
  const redirectUrl = Linking.createURL('auth/callback')
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  })

  if (error) throw error

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl)
    if (result.type === 'success' && result.url) {
      const parsedUrl = Linking.parse(result.url)
      const accessToken = (parsedUrl.queryParams as Record<string, string>)?.access_token
      const refreshToken = (parsedUrl.queryParams as Record<string, string>)?.refresh_token
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      }
    }
  }
}
