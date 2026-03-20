import { View, Text, StyleSheet } from 'react-native'

interface FieldNotesCalloutProps {
  notes: string
}

export function FieldNotesCallout({ notes }: FieldNotesCalloutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.icon}>📝</Text>
        <View style={styles.textContainer}>
          <Text style={styles.label}>FROM THE TRENCHES</Text>
          <Text style={styles.notes}>{notes}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#c4703f',
    backgroundColor: 'rgba(196,112,63,0.04)',
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
    color: '#c4703f',
    marginBottom: 8,
  },
  notes: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#ede6dc',
    lineHeight: 22,
    fontStyle: 'italic',
  },
})
