import { View, Text, Pressable, StyleSheet, Platform, type StyleProp, type ViewStyle } from 'react-native'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { useColors } from '@/hooks/use-colors'

interface WeekStepperProps {
  /** Center/right value, e.g. "Week 24" or "Today". */
  label: string
  /** Optional left-aligned uppercase context label, e.g. "Briefing". */
  title?: string
  onPrev?: () => void
  onNext?: () => void
  prevDisabled?: boolean
  nextDisabled?: boolean
  /** Tap the label to open a "jump to" sheet. */
  onPressLabel?: () => void
  style?: StyleProp<ViewStyle>
}

/** Quiet `‹ Week N ›` control that replaces the long pill bar. (§1.3) */
export function WeekStepper({
  label,
  title,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  onPressLabel,
  style,
}: WeekStepperProps) {
  const colors = useColors()

  const NavButton = ({ dir, onPress, disabled }: { dir: 'left' | 'right'; onPress?: () => void; disabled?: boolean }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.nav,
        { backgroundColor: colors.card, borderColor: colors.line, opacity: disabled ? 0.35 : pressed ? 0.6 : 1 },
      ]}
    >
      {dir === 'left' ? (
        <ChevronLeft size={15} color={colors.ink2} strokeWidth={2.2} />
      ) : (
        <ChevronRight size={15} color={colors.ink2} strokeWidth={2.2} />
      )}
    </Pressable>
  )

  return (
    <View style={[styles.topbar, style]}>
      {title ? <Text style={[styles.ttl, { color: colors.muted }]}>{title}</Text> : <View />}
      <View style={styles.wkstep}>
        <NavButton dir="left" onPress={onPrev} disabled={prevDisabled} />
        <Pressable onPress={onPressLabel} disabled={!onPressLabel} hitSlop={6}>
          <Text style={[styles.label, { color: colors.ink }]}>{label}</Text>
        </Pressable>
        <NavButton dir="right" onPress={onNext} disabled={nextDisabled} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 22,
    paddingBottom: 2,
  },
  ttl: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 13,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  wkstep: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontFamily: 'Jakarta-Bold', fontSize: 14 },
  nav: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#28231c', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 },
      android: { elevation: 1 },
    }),
  },
})
