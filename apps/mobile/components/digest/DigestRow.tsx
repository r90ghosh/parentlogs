import { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { ChevronDown, Check } from 'lucide-react-native'
import { useColors } from '@/hooks/use-colors'

export interface DigestCategory {
  label: string
  color: string
}

interface DigestRowProps {
  category: DigestCategory
  headline: string
  detail?: string | null
  /** Show the left check-circle (only DO items in Briefing). */
  checkable?: boolean
  checked?: boolean
  onToggleCheck?: () => void
  defaultOpen?: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * Core digest list row: category dot + uppercase label, one-liner headline,
 * tap-to-expand detail, optional left check-circle. (§1.3 — the Take A row.)
 */
export function DigestRow({
  category,
  headline,
  detail,
  checkable,
  checked,
  onToggleCheck,
  defaultOpen,
  style,
}: DigestRowProps) {
  const colors = useColors()
  const hasDetail = !!detail && detail.trim().length > 0

  const [open, setOpen] = useState(!!defaultOpen)
  const [contentH, setContentH] = useState(0)
  const progress = useSharedValue(defaultOpen ? 1 : 0)

  const toggle = () => {
    if (!hasDetail) {
      if (checkable) onToggleCheck?.()
      return
    }
    const next = !open
    setOpen(next)
    progress.value = withTiming(next ? 1 : 0, { duration: 240 })
  }

  const detailStyle = useAnimatedStyle(() => ({
    height: progress.value * contentH,
    opacity: progress.value,
  }))
  const chevStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }))

  return (
    <Pressable
      onPress={toggle}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.line2, backgroundColor: pressed ? colors.cardHover : 'transparent' },
        style,
      ]}
    >
      {checkable && (
        <Pressable
          onPress={onToggleCheck}
          hitSlop={10}
          style={[
            styles.check,
            { borderColor: checked ? colors.accent : colors.line, backgroundColor: checked ? colors.accent : 'transparent' },
          ]}
        >
          {checked && <Check size={12} color="#fff" strokeWidth={3} />}
        </Pressable>
      )}

      <View style={styles.bodywrap}>
        <View style={styles.catRow}>
          <View style={[styles.dot, { backgroundColor: category.color }]} />
          <Text style={[styles.cat, { color: category.color }]}>{category.label}</Text>
        </View>
        <Text
          style={[
            styles.line,
            {
              color: checked ? colors.muted : colors.ink,
              textDecorationLine: checked ? 'line-through' : 'none',
              textDecorationColor: colors.faint,
            },
          ]}
        >
          {headline}
        </Text>
        {hasDetail && (
          <Animated.View style={[styles.detailClip, detailStyle]}>
            <View
              style={styles.detailMeasure}
              onLayout={(e: LayoutChangeEvent) => setContentH(e.nativeEvent.layout.height)}
            >
              <Text style={[styles.detailText, { color: colors.ink2 }]}>{detail}</Text>
            </View>
          </Animated.View>
        )}
      </View>

      {hasDetail && (
        <Animated.View style={[styles.chev, chevStyle]}>
          <ChevronDown size={18} color={colors.faint} strokeWidth={2} />
        </Animated.View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    flexShrink: 0,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodywrap: { flex: 1 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  cat: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  line: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 16,
    lineHeight: 23,
    letterSpacing: -0.1,
    marginTop: 7,
  },
  detailClip: { overflow: 'hidden' },
  detailMeasure: {},
  detailText: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14.5,
    lineHeight: 22,
    paddingTop: 8,
  },
  chev: { marginTop: 8, flexShrink: 0 },
})
