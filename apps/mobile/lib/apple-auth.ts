import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from '@/lib/supabase'

export async function signInWithApple(): Promise<void> {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  })

  if (!credential.identityToken) {
    throw new Error('No identity token returned from Apple')
  }

  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  })

  if (error) throw error

  // Store the authorization code for future token revocation (required by Apple
  // when users delete their account). Apple only returns this code once during
  // sign-in, so we persist it in user metadata.
  if (credential.authorizationCode) {
    await supabase.auth.updateUser({
      data: { apple_authorization_code: credential.authorizationCode },
    })
  }
}
