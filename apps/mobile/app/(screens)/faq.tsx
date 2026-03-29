import { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
  Linking,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  X,
  ChevronDown,
  ChevronUp,
  Mail,
} from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface FaqItem {
  q: string
  a: string
}

interface FaqCategory {
  title: string
  items: FaqItem[]
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: 'General',
    items: [
      {
        q: 'What is The Dad Center?',
        a: 'The Dad Center is a pregnancy and parenting companion app designed to keep dads informed, prepared, and connected. Week-by-week briefings, structured tasks, budget planning, and partner sync all in one place.',
      },
      {
        q: 'Who is this app for?',
        a: "Primarily for expectant and new dads, but it works for the whole family. Moms get tailored content and the same tools. Whether you're 8 weeks in or 8 months postpartum, the app meets you where you are.",
      },
      {
        q: "Can I use the app if I'm the mom?",
        a: 'Absolutely! While we lead with a dad-first voice, the app is fully role-aware. Moms see tailored content and the same powerful tools.',
      },
      {
        q: 'Is the medical information reviewed?',
        a: 'Our briefings cite sources like ACOG and AAP guidelines. However, this app is for informational purposes only — always consult your healthcare provider.',
      },
    ],
  },
  {
    title: 'Subscription & Billing',
    items: [
      {
        q: 'How does the family subscription work?',
        a: 'One subscription covers your whole family. Both you and your partner share full Premium access with a single plan.',
      },
      {
        q: 'How much does it cost?',
        a: 'Monthly: $4.99/mo. Yearly: $39.99/yr ($3.33/mo). Lifetime: $99.99 one-time. All plans include full access for both partners.',
      },
      {
        q: 'What do I get for free?',
        a: "Free accounts get a 30-day task window, 4 weeks of briefings from signup, core tracker features, and access to the dashboard. It's designed to feel complete, not crippled.",
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes. Cancel at any time — no questions asked. You keep access through the end of your billing period, and your data stays safe on the free tier.',
      },
      {
        q: 'Do I need to pay to try it?',
        a: "No. Free accounts get 30 days of tasks, 4 weeks of briefings, and full dashboard access — no credit card required. If you upgrade and want to cancel, you keep access through your billing period.",
      },
    ],
  },
  {
    title: 'Features',
    items: [
      {
        q: 'What are weekly briefings?',
        a: "Each week you get a concise briefing covering baby's development, what your partner may be experiencing, things to do this week, and practical dad-specific guidance.",
      },
      {
        q: 'How does partner sync work?',
        a: 'Invite your partner with a family code. You both see shared tasks, can assign items to each other, and stay in sync. One person completing a task updates it for both.',
      },
      {
        q: 'What is the Budget Planner?',
        a: 'A phase-by-phase breakdown of what things actually cost — from prenatal vitamins to daycare. Each item includes best-value and premium options with real pricing.',
      },
      {
        q: 'What is the Dad Journey?',
        a: 'Seven challenge pillars — Knowledge, Planning, Finances, Anxiety, Baby Bonding, Relationship, and Extended Family — with guided content to turn anxiety into action.',
      },
    ],
  },
  {
    title: 'Privacy & Data',
    items: [
      {
        q: 'How is my data handled?',
        a: 'Your data is stored securely with industry-standard encryption. We never sell your data to third parties.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Go to Settings > scroll to "Delete Account." This permanently removes all your data and cannot be undone.',
      },
      {
        q: 'What happens to my data if I cancel?',
        a: 'Your data stays safe. Cancelling Premium reverts you to the free tier — you keep access within the free window. Re-subscribe anytime to unlock everything.',
      },
    ],
  },
]

export default function FaqScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  function toggleFaq(key: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedKey(expandedKey === key ? null : key)
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>FAQ</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color="#7a6f62" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {FAQ_CATEGORIES.map((category, catIndex) => (
          <CardEntrance key={category.title} delay={catIndex * 100}>
            <Text style={styles.sectionTitle}>{category.title}</Text>
            <GlassCard style={styles.section}>
              {category.items.map((item, itemIndex) => {
                const key = `${catIndex}-${itemIndex}`
                const isExpanded = expandedKey === key
                const isLast = itemIndex === category.items.length - 1
                return (
                  <Pressable
                    key={key}
                    onPress={() => toggleFaq(key)}
                    style={[
                      styles.faqRow,
                      !isLast && styles.faqRowBorder,
                    ]}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={styles.faqQuestion}>{item.q}</Text>
                      {isExpanded ? (
                        <ChevronUp size={16} color="#7a6f62" />
                      ) : (
                        <ChevronDown size={16} color="#7a6f62" />
                      )}
                    </View>
                    {isExpanded && (
                      <Text style={styles.faqAnswer}>{item.a}</Text>
                    )}
                  </Pressable>
                )
              })}
            </GlassCard>
          </CardEntrance>
        ))}

        {/* Contact CTA */}
        <CardEntrance delay={FAQ_CATEGORIES.length * 100}>
          <Pressable
            onPress={() =>
              Linking.openURL('mailto:info@thedadcenter.com')
            }
            style={styles.contactCard}
          >
            <LinearGradient
              colors={['rgba(196,112,63,0.12)', 'rgba(212,168,83,0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.contactGradient}
            >
              <View style={styles.contactIconCircle}>
                <Mail size={20} color="#c4703f" />
              </View>
              <Text style={styles.contactTitle}>Still have questions?</Text>
              <Text style={styles.contactSubtitle}>
                Tap to email us — we typically respond within 24 hours.
              </Text>
            </LinearGradient>
          </Pressable>
        </CardEntrance>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Section
  sectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },
  section: {
    overflow: 'hidden',
    marginBottom: 24,
    padding: 0,
  },

  // FAQ
  faqRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  faqRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
    color: '#ede6dc',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    lineHeight: 22,
    marginTop: 10,
  },

  // Contact CTA
  contactCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(196,112,63,0.15)',
  },
  contactGradient: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  contactIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(196,112,63,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#faf6f0',
    marginBottom: 6,
  },
  contactSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 21,
  },
})
