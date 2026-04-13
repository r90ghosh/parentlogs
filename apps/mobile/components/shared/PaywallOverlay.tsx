import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Crown, Check, Sparkles } from 'lucide-react-native'
import { PAYWALL_COPY } from '@tdc/shared/constants'
import { useColors } from '@/hooks/use-colors'

const PREMIUM_FEATURES = [
  'Full task timeline (pregnancy to 24 months)',
  'All weekly briefings',
  'Push notifications & reminders',
  'Partner sync & coordination',
  'Advanced tracker & mood trends',
  'Complete budget planner',
]

function interpolateCopy(text: string, values?: Record<string, string | number>): string {
  if (!values) return text
  return text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`))
}

interface PaywallOverlayProps {
  featureKey?: string
  message?: string
  description?: string
  interpolations?: Record<string, string | number>
  children?: React.ReactNode
}

export function PaywallOverlay({
  featureKey,
  message,
  description,
  interpolations,
  children,
}: PaywallOverlayProps) {
  const router = useRouter()
  const colors = useColors()
  const copy = featureKey ? PAYWALL_COPY[featureKey] : undefined
  const headline = message || copy?.headline || 'Premium Feature'
  const body =
    description ||
    (copy ? interpolateCopy(copy.body, interpolations) : 'Upgrade to Premium to access this feature.')

  return (
    <View style={styles.container}>
      {children}
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={styles.content}>
          {/* Crown icon */}
          <View style={[styles.iconBadge, { backgroundColor: colors.goldDim }]}>
            <Crown size={24} color={colors.gold} />
          </View>

          <Text style={[styles.headline, { color: colors.textPrimary }]}>{headline}</Text>
          <Text style={[styles.body, { color: colors.textMuted }]}>{body}</Text>

          {/* Feature list */}
          <View style={[styles.featureList, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {PREMIUM_FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Check size={14} color={colors.copper} />
                <Text style={[styles.featureText, { color: colors.textPrimary }]}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Primary CTA: Annual */}
          <Pressable
            onPress={() => router.push('/(screens)/upgrade')}
            style={[styles.primaryCta, { backgroundColor: colors.copper }]}
          >
            <Sparkles size={16} color={colors.bg} />
            <Text style={[styles.primaryCtaText, { color: colors.bg }]}>Upgrade — $39.99/yr ($3.33/mo)</Text>
          </Pressable>

          {/* Secondary CTA: Monthly */}
          <Pressable
            onPress={() => router.push('/(screens)/upgrade')}
            style={[styles.secondaryCta, { borderColor: colors.borderHover }]}
          >
            <Text style={[styles.secondaryCtaText, { color: colors.textMuted }]}>Or $4.99/month</Text>
          </Pressable>

          <Text style={[styles.guarantee, { color: colors.textDim }]}>Free for 30 days — no credit card needed</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxWidth: 340,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  featureList: {
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    flex: 1,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    paddingVertical: 14,
    alignSelf: 'stretch',
    marginBottom: 8,
  },
  primaryCtaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
  },
  secondaryCta: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    alignSelf: 'stretch',
    borderWidth: 1,
    marginBottom: 12,
  },
  secondaryCtaText: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
  },
  guarantee: {
    fontFamily: 'Jost-Regular',
    fontSize: 11,
  },
})
