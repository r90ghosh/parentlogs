import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Crown, Check, Sparkles } from 'lucide-react-native'
import { PAYWALL_COPY } from '@tdc/shared/constants'

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
  const copy = featureKey ? PAYWALL_COPY[featureKey] : undefined
  const headline = message || copy?.headline || 'Premium Feature'
  const body =
    description ||
    (copy ? interpolateCopy(copy.body, interpolations) : 'Upgrade to Premium to access this feature.')

  return (
    <View style={styles.container}>
      {children}
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Crown icon */}
          <View style={styles.iconBadge}>
            <Crown size={24} color="#d4a853" />
          </View>

          <Text style={styles.headline}>{headline}</Text>
          <Text style={styles.body}>{body}</Text>

          {/* Feature list */}
          <View style={styles.featureList}>
            {PREMIUM_FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Check size={14} color="#c4703f" />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Primary CTA: Annual */}
          <Pressable
            onPress={() => router.push('/(screens)/upgrade')}
            style={styles.primaryCta}
          >
            <Sparkles size={16} color="#12100e" />
            <Text style={styles.primaryCtaText}>Upgrade — $39.99/yr ($3.33/mo)</Text>
          </Pressable>

          {/* Secondary CTA: Monthly */}
          <Pressable
            onPress={() => router.push('/(screens)/upgrade')}
            style={styles.secondaryCta}
          >
            <Text style={styles.secondaryCtaText}>Or $4.99/month</Text>
          </Pressable>

          <Text style={styles.guarantee}>Free for 30 days — no credit card needed</Text>
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
    backgroundColor: 'rgba(18,16,14,0.85)',
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
    backgroundColor: 'rgba(212,168,83,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headline: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#faf6f0',
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  featureList: {
    alignSelf: 'stretch',
    backgroundColor: '#201c18',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
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
    color: '#faf6f0',
    flex: 1,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#c4703f',
    borderRadius: 10,
    paddingVertical: 14,
    alignSelf: 'stretch',
    marginBottom: 8,
  },
  primaryCtaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#12100e',
  },
  secondaryCta: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.15)',
    marginBottom: 12,
  },
  secondaryCtaText: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
  },
  guarantee: {
    fontFamily: 'Jost-Regular',
    fontSize: 11,
    color: '#4a4239',
  },
})
