import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native'
import { shadows } from '@/lib/shadows'
import { useColors, type ColorTokens } from '@/hooks/use-colors'

type AccentColor = 'copper' | 'gold' | 'sage' | 'coral' | 'sky' | 'rose'

function getAccentColor(accent: AccentColor, colors: ColorTokens): string {
  const map: Record<AccentColor, string> = {
    copper: colors.copper,
    gold: colors.gold,
    sage: colors.sage,
    coral: colors.coral,
    sky: colors.sky,
    rose: colors.rose,
  }
  return map[accent]
}

interface CardProps {
  accent?: AccentColor
  style?: ViewStyle
  children: React.ReactNode
}

interface CardSectionProps {
  style?: ViewStyle
  children: React.ReactNode
}

interface CardTextProps {
  style?: TextStyle
  children: React.ReactNode
}

export function Card({ accent, style, children }: CardProps) {
  const colors = useColors()

  return (
    <View
      style={[
        styles.card,
        shadows.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        accent && { borderTopWidth: 3, borderTopColor: getAccentColor(accent, colors) },
        style,
      ]}
    >
      {children}
    </View>
  )
}

export function CardHeader({ style, children }: CardSectionProps) {
  return <View style={[styles.header, style]}>{children}</View>
}

export function CardTitle({ style, children }: CardTextProps) {
  const colors = useColors()
  return <Text style={[styles.title, { color: colors.textPrimary }, style]}>{children}</Text>
}

export function CardDescription({ style, children }: CardTextProps) {
  const colors = useColors()
  return <Text style={[styles.description, { color: colors.textMuted }, style]}>{children}</Text>
}

export function CardContent({ style, children }: CardSectionProps) {
  return <View style={[styles.content, style]}>{children}</View>
}

export function CardFooter({ style, children }: CardSectionProps) {
  const colors = useColors()
  return <View style={[styles.footer, { borderTopColor: colors.border }, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 17,
  },
  description: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  footer: {
    padding: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
