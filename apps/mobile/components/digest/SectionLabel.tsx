import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native'
import { useColors } from '@/hooks/use-colors'

interface SectionLabelProps {
  children: string
  style?: StyleProp<TextStyle>
}

/** Small uppercase section label, e.g. "This week". (§1.3) */
export function SectionLabel({ children, style }: SectionLabelProps) {
  const colors = useColors()
  return <Text style={[styles.label, { color: colors.faint }, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    paddingTop: 22,
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
})
