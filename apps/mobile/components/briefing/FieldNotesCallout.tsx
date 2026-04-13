import { View, Text, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/use-colors'

interface FieldNotesCalloutProps {
  notes: string
}

export function FieldNotesCallout({ notes }: FieldNotesCalloutProps) {
  const colors = useColors()

  return (
    <View style={[styles.container, { borderLeftColor: colors.copper, backgroundColor: colors.pressed }]}>
      <View style={styles.inner}>
        <Text style={styles.icon}>📝</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.copper }]}>FROM THE TRENCHES</Text>
          <Text style={[styles.notes, { color: colors.textSecondary }]}>{notes}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 12,
  },
  inner: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    fontSize: 18,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  notes: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
})
