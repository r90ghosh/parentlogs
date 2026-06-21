import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { useColors } from '@/hooks/use-colors'

interface DigestHeroProps {
  /** Big headline, e.g. "Week 24". */
  title: string
  /** Sub line, e.g. "Second trimester · 16 weeks to go". */
  sub?: string
  /** 0..1 (or 0..100) progress fraction; omit to hide the bar. */
  progressPct?: number | null
  /** TL;DR sentence rendered below the progress bar. */
  tldr?: string | null
  style?: StyleProp<ViewStyle>
}

/** Big "Week N" hero with sub line, thin progress bar, and TL;DR. (§1.3) */
export function DigestHero({ title, sub, progressPct, tldr, style }: DigestHeroProps) {
  const colors = useColors()
  const raw = progressPct ?? null
  const pct = raw == null ? null : Math.max(0, Math.min(1, raw > 1 ? raw / 100 : raw))

  return (
    <View style={style}>
      <View style={styles.hero}>
        <Text style={[styles.wkbig, { color: colors.ink }]}>{title}</Text>
        {!!sub && <Text style={[styles.sub, { color: colors.muted }]}>{sub}</Text>}
        {pct != null && (
          <View style={[styles.prog, { backgroundColor: colors.line }]}>
            <View style={[styles.progFill, { width: `${pct * 100}%`, backgroundColor: colors.accent }]} />
          </View>
        )}
      </View>
      {!!tldr && <Text style={[styles.tldr, { color: colors.ink }]}>{tldr}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  hero: { paddingTop: 14, paddingHorizontal: 22, paddingBottom: 6 },
  wkbig: { fontFamily: 'Jakarta-ExtraBold', fontSize: 34, letterSpacing: -1, lineHeight: 36 },
  sub: { fontFamily: 'Jakarta-Medium', fontSize: 14, marginTop: 7 },
  prog: { height: 5, borderRadius: 5, marginTop: 14, overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 5 },
  tldr: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 17,
    lineHeight: 25,
    letterSpacing: -0.2,
    marginTop: 16,
    marginHorizontal: 22,
    marginBottom: 4,
  },
})
