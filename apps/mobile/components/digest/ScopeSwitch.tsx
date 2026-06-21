import { View, Text, Pressable, StyleSheet, Platform, type StyleProp, type ViewStyle } from 'react-native'
import { useColors } from '@/hooks/use-colors'

export interface ScopeOption {
  key: string
  label: string
  badge?: number
  badgeTone?: 'accent' | 'amber'
}

interface ScopeSwitchProps {
  options: ScopeOption[]
  value: string
  onChange: (key: string) => void
  style?: StyleProp<ViewStyle>
}

/** Sticky segmented control (Now · Upcoming · Done). Generic — reused by other pages. (§2.2) */
export function ScopeSwitch({ options, value, onChange, style }: ScopeSwitchProps) {
  const colors = useColors()
  return (
    <View style={[styles.bar, { backgroundColor: colors.line2 }, style]}>
      {options.map((opt) => {
        const active = opt.key === value
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.seg, active && [styles.segActive, { backgroundColor: colors.card }]]}
          >
            <Text style={[styles.label, { color: active ? colors.ink : colors.muted }]}>{opt.label}</Text>
            {opt.badge != null && opt.badge > 0 && (
              <View style={[styles.badge, { backgroundColor: opt.badgeTone === 'amber' ? colors.gold : colors.accent }]}>
                <Text style={styles.badgeText}>{opt.badge}</Text>
              </View>
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderRadius: 13, padding: 3 },
  seg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  segActive: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
      android: { elevation: 1 },
    }),
  },
  label: { fontFamily: 'Jakarta-Bold', fontSize: 13.5 },
  badge: { borderRadius: 999, paddingHorizontal: 6, paddingVertical: 1, minWidth: 17, alignItems: 'center' },
  badgeText: { fontFamily: 'Jakarta-ExtraBold', fontSize: 10, color: '#fff' },
})
