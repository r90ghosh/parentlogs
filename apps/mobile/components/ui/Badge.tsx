import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native'

type BadgeVariant = 'copper' | 'gold' | 'sage' | 'coral' | 'outline' | 'muted'

const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  copper: {
    container: { backgroundColor: 'rgba(196,112,63,0.15)' },
    text: { color: '#c4703f' },
  },
  gold: {
    container: { backgroundColor: 'rgba(212,168,83,0.15)' },
    text: { color: '#d4a853' },
  },
  sage: {
    container: { backgroundColor: 'rgba(107,143,113,0.15)' },
    text: { color: '#6b8f71' },
  },
  coral: {
    container: { backgroundColor: 'rgba(212,131,107,0.15)' },
    text: { color: '#d4836b' },
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(237,230,220,0.15)' },
    text: { color: '#ede6dc' },
  },
  muted: {
    container: { backgroundColor: 'rgba(74,66,57,0.3)' },
    text: { color: '#7a6f62' },
  },
}

interface BadgeProps {
  variant?: BadgeVariant
  style?: ViewStyle
  children: React.ReactNode
}

export function Badge({ variant = 'copper', style, children }: BadgeProps) {
  const v = variantStyles[variant]

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
