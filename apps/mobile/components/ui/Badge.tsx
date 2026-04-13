import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native'
import { useColors, type ColorTokens } from '@/hooks/use-colors'

type BadgeVariant = 'copper' | 'gold' | 'sage' | 'coral' | 'outline' | 'muted'

function getVariantStyles(colors: ColorTokens): Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> {
  return {
    copper: {
      container: { backgroundColor: colors.copperDim },
      text: { color: colors.copper },
    },
    gold: {
      container: { backgroundColor: colors.goldDim },
      text: { color: colors.gold },
    },
    sage: {
      container: { backgroundColor: colors.sageDim },
      text: { color: colors.sage },
    },
    coral: {
      container: { backgroundColor: colors.coralDim },
      text: { color: colors.coral },
    },
    outline: {
      container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.borderHover },
      text: { color: colors.textSecondary },
    },
    muted: {
      container: { backgroundColor: colors.subtleBg },
      text: { color: colors.textMuted },
    },
  }
}

interface BadgeProps {
  variant?: BadgeVariant
  style?: ViewStyle
  children: React.ReactNode
}

export function Badge({ variant = 'copper', style, children }: BadgeProps) {
  const colors = useColors()
  const variantMap = getVariantStyles(colors)
  const v = variantMap[variant]

  return (
    <View style={[styles.container, v.container, style]}>
      <Text style={[styles.text, v.text]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  text: {
    fontFamily: 'Karla-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})
