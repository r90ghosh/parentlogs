import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/use-colors'

export interface PhaseChip {
  key: string
  label: string
}

interface PhaseChipsProps {
  chips: PhaseChip[]
  activeKey?: string | null
  onSelect: (key: string) => void
  label?: string
}

/** Horizontal chip row — the calm replacement for the 104-week pill bar. (§2.2) */
export function PhaseChips({ chips, activeKey, onSelect, label }: PhaseChipsProps) {
  const colors = useColors()
  if (!chips.length) return null
  return (
    <View style={styles.wrap}>
      {!!label && <Text style={[styles.label, { color: colors.faint }]}>{label}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {chips.map((c) => {
          const on = c.key === activeKey
          return (
            <Pressable
              key={c.key}
              onPress={() => onSelect(c.key)}
              style={[styles.chip, { backgroundColor: on ? colors.accent : colors.card, borderColor: on ? colors.accent : colors.line }]}
            >
              <Text style={[styles.chipText, { color: on ? '#fff' : colors.ink2 }]}>{c.label}</Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 14, paddingBottom: 2 },
  label: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  row: { gap: 8, paddingHorizontal: 22, paddingBottom: 4 },
  chip: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  chipText: { fontFamily: 'Jakarta-Bold', fontSize: 12.5 },
})
