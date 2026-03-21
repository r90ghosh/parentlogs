import { View, Text, StyleSheet } from 'react-native'

interface TaskSectionHeaderProps {
  title: string
  count: number
  accentColor?: string
  dimmed?: boolean
}

export function TaskSectionHeader({
  title,
  count,
  accentColor = '#faf6f0',
  dimmed = false,
}: TaskSectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {accentColor !== '#faf6f0' && accentColor !== '#7a6f62' && (
          <View style={[styles.dot, { backgroundColor: accentColor }]} />
        )}
        <Text
          style={[
            styles.title,
            { color: accentColor },
            dimmed && styles.titleDimmed,
          ]}
        >
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.countBadge,
          accentColor !== '#faf6f0' && accentColor !== '#7a6f62'
            ? { backgroundColor: accentColor + '18' }
            : { backgroundColor: 'rgba(237,230,220,0.06)' },
        ]}
      >
        <Text
          style={[
            styles.countText,
            accentColor !== '#faf6f0' && accentColor !== '#7a6f62'
              ? { color: accentColor }
              : { color: '#4a4239' },
          ]}
        >
          {count}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  title: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  titleDimmed: {
    opacity: 0.6,
  },
  countBadge: {
    borderRadius: 10,
    minWidth: 24,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontFamily: 'Karla-Bold',
    fontSize: 11,
  },
})
