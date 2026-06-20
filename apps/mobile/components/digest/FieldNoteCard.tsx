import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { useColors } from '@/hooks/use-colors'

interface FieldNoteCardProps {
  quote: string
  label?: string
  attribution?: string
  style?: StyleProp<ViewStyle>
}

/** Soft accent-tint block for a "field note" quote. (§1.3) */
export function FieldNoteCard({ quote, label = 'Field note', attribution, style }: FieldNoteCardProps) {
  const colors = useColors()
  return (
    <View style={[styles.note, { backgroundColor: colors.accentSoft }, style]}>
      <View style={styles.catRow}>
        <View style={[styles.dot, { backgroundColor: colors.accent }]} />
        <Text style={[styles.cat, { color: colors.accentInk }]}>{label}</Text>
      </View>
      <Text style={[styles.quote, { color: colors.ink2 }]}>{`“${quote}”`}</Text>
      {!!attribution && <Text style={[styles.attr, { color: colors.muted }]}>{attribution}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  note: {
    marginHorizontal: 24,
    marginVertical: 8,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  cat: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  quote: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 15,
    lineHeight: 23,
    fontStyle: 'italic',
    marginTop: 9,
  },
  attr: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 12.5,
    marginTop: 8,
  },
})
