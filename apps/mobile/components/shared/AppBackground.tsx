import { StyleSheet, View } from 'react-native'
import { useColors } from '@/hooks/use-colors'

/**
 * v2 Digest background: a flat, token-driven canvas — true-black in dark,
 * warm-paper in light. No gradients, copper glow, or particles (the digest
 * principle: almost no color, no gratuitous motion). The `particles` prop is
 * kept for call-site compatibility but is intentionally a no-op now.
 */
export function AppBackground(_props: { particles?: boolean }) {
  const colors = useColors()
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]} pointerEvents="none" />
}
