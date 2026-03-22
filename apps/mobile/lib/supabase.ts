import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const CHUNK_SIZE = 2048

const SecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return localStorage.getItem(key)

    const chunksRaw = await SecureStore.getItemAsync(`${key}_chunks`)
    if (chunksRaw) {
      const count = parseInt(chunksRaw, 10)
      const parts: string[] = []
      for (let i = 0; i < count; i++) {
        const chunk = await SecureStore.getItemAsync(`${key}_chunk_${i}`)
        if (chunk === null) return null
        parts.push(chunk)
      }
      return parts.join('')
    }

    return SecureStore.getItemAsync(key)
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value)
      return
    }

    // Clear any existing chunks first
    await SecureStoreAdapter.removeItem(key)

    if (value.length > CHUNK_SIZE) {
      const count = Math.ceil(value.length / CHUNK_SIZE)
      await SecureStore.setItemAsync(`${key}_chunks`, count.toString())
      for (let i = 0; i < count; i++) {
        const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
        await SecureStore.setItemAsync(`${key}_chunk_${i}`, chunk)
      }
    } else {
      await SecureStore.setItemAsync(key, value)
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key)
      return
    }

    const chunksRaw = await SecureStore.getItemAsync(`${key}_chunks`)
    if (chunksRaw) {
      const count = parseInt(chunksRaw, 10)
      for (let i = 0; i < count; i++) {
        await SecureStore.deleteItemAsync(`${key}_chunk_${i}`)
      }
      await SecureStore.deleteItemAsync(`${key}_chunks`)
    }

    await SecureStore.deleteItemAsync(key)
  },
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Add them to your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
