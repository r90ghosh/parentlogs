import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native'
import { shadows } from '@/lib/shadows'

const ACCENT_COLORS = {
  copper: '#c4703f',
  gold: '#d4a853',
  sage: '#6b8f71',
  coral: '#d4836b',
  sky: '#5b9bd5',
  rose: '#c47a8f',
} as const

type AccentColor = keyof typeof ACCENT_COLORS

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
  return (
    <View
      style={[
        styles.card,
        shadows.card,
        accent && { borderTopWidth: 3, borderTopColor: ACCENT_COLORS[accent] },
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
  return <Text style={[styles.title, style]}>{children}</Text>
}

export function CardDescription({ style, children }: CardTextProps) {
  return <Text style={[styles.description, style]}>{children}</Text>
}

export function CardContent({ style, children }: CardSectionProps) {
  return <View style={[styles.content, style]}>{children}</View>
}

export function CardFooter({ style, children }: CardSectionProps) {
  return <View style={[styles.footer, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#201c18',
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
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
    color: '#faf6f0',
  },
  description: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
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
    borderTopColor: 'rgba(237,230,220,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
  },
})
