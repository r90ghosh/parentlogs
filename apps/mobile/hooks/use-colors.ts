'use client'
import { useTheme } from '@/components/providers/ThemeProvider'
import { themes, type ColorTokens } from '@/lib/colors'

export type { ColorTokens }

export function useColors(): ColorTokens {
  const { isDark } = useTheme()
  return isDark ? themes.dark : themes.light
}
