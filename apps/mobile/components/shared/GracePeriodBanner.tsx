import { useMemo } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { AlertTriangle, Sparkles } from 'lucide-react-native'
import { useGracePeriodStatus } from '@/hooks/use-subscription'
import { useColors } from '@/hooks/use-colors'

export function GracePeriodBanner() {
  const router = useRouter()
  const colors = useColors()
  const { isInGracePeriod, daysRemaining, expiresAt } = useGracePeriodStatus()

  const daysSinceExpiry = useMemo(() => {
    if (!expiresAt) return 0
    const expiry = new Date(expiresAt)
    return Math.floor((Date.now() - expiry.getTime()) / (1000 * 60 * 60 * 24))
  }, [expiresAt])

  if (!isInGracePeriod || !expiresAt) return null

  const expiredLabel =
    daysSinceExpiry === 0
      ? 'today'
      : `${daysSinceExpiry} day${daysSinceExpiry === 1 ? '' : 's'} ago`

  return (
    <View style={[styles.banner, { backgroundColor: colors.card, borderColor: colors.coralDim }]}>
      <View style={[styles.accentBar, { backgroundColor: colors.coral }]} />
      <View style={styles.inner}>
        <View style={styles.row}>
          <View style={[styles.iconBadge, { backgroundColor: colors.coralDim }]}>
            <AlertTriangle size={18} color={colors.coral} />
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Your subscription expired {expiredLabel}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {daysRemaining} day{daysRemaining === 1 ? '' : 's'} remaining before access is restricted
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/(screens)/upgrade')}
          style={[styles.cta, { backgroundColor: colors.copper }]}
        >
          <Sparkles size={14} color={colors.bg} />
          <Text style={[styles.ctaText, { color: colors.bg }]}>Renew</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  inner: {
    flex: 1,
    padding: 14,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    paddingVertical: 10,
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
})
