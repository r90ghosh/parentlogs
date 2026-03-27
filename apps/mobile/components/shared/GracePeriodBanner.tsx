import { useMemo } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { AlertTriangle, Sparkles } from 'lucide-react-native'
import { useGracePeriodStatus } from '@/hooks/use-subscription'

export function GracePeriodBanner() {
  const router = useRouter()
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
    <View style={styles.banner}>
      <View style={styles.accentBar} />
      <View style={styles.inner}>
        <View style={styles.row}>
          <View style={styles.iconBadge}>
            <AlertTriangle size={18} color="#d4836b" />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>
              Your subscription expired {expiredLabel}
            </Text>
            <Text style={styles.subtitle}>
              {daysRemaining} day{daysRemaining === 1 ? '' : 's'} remaining before access is restricted
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/(screens)/upgrade')}
          style={styles.cta}
        >
          <Sparkles size={14} color="#12100e" />
          <Text style={styles.ctaText}>Renew</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#201c18',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,131,107,0.25)',
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
  },
  accentBar: {
    width: 4,
    backgroundColor: '#d4836b',
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
    backgroundColor: 'rgba(212,131,107,0.15)',
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
    color: '#faf6f0',
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    color: '#7a6f62',
    lineHeight: 16,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#c4703f',
    borderRadius: 8,
    paddingVertical: 10,
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#12100e',
  },
})
