import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
  Linking,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  X,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  ExternalLink,
  Mail,
  CheckCircle,
} from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { contactService } from '@/lib/services'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import * as WebBrowser from 'expo-web-browser'
import { useColors } from '@/hooks/use-colors'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const FAQ_ITEMS = [
  {
    q: 'What is The Dad Center?',
    a: 'The Dad Center is a pregnancy and parenting companion app designed to keep dads informed, prepared, and connected throughout the journey.',
  },
  {
    q: 'How does the family subscription work?',
    a: 'One subscription covers your whole family. Both you and your partner share full access with a single Premium plan.',
  },
  {
    q: 'What do I get with Premium?',
    a: 'Premium unlocks the full task timeline, all briefing weeks, partner sync, push notifications, advanced tracker analytics, and the complete content library.',
  },
  {
    q: 'How do I invite my partner?',
    a: "Go to the Family screen from the More menu. You'll find your family invite code there — share it with your partner so they can join.",
  },
  {
    q: "Can I use the app if I'm the mom?",
    a: 'Absolutely! While we lead with a dad-first voice, the app is fully role-aware. Moms see tailored content and the same powerful tools.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your data stays safe. If you cancel Premium, you keep free-tier access. You can re-subscribe anytime to unlock everything again.',
  },
  {
    q: 'Is the medical information reviewed?',
    a: 'Our briefings cite sources like ACOG and AAP guidelines. However, this app is for informational purposes only — always consult your healthcare provider.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to Settings > scroll to the bottom > Delete Account. This permanently removes all your data and cannot be undone.',
  },
]

const CONTACT_CATEGORIES = [
  'General',
  'Bug Report',
  'Feature Request',
  'Billing',
  'Account',
  'Other',
]

export default function HelpScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { user, profile } = useAuth()
  const colors = useColors()

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [name, setName] = useState(profile?.full_name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [category, setCategory] = useState('General')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function toggleFaq(index: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedIdx(expandedIdx === index ? null : index)
  }

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Missing Fields', 'Please fill in your name, email, and message.')
      return
    }

    setIsSubmitting(true)
    try {
      const fullSubject = subject.trim()
        ? `[${category}] ${subject.trim()}`
        : `[${category}]`
      await contactService.submitMessage({
        user_id: user!.id,
        name: name.trim(),
        email: email.trim(),
        subject: fullSubject,
        message: message.trim(),
      })
      setSubmitted(true)
    } catch {
      Alert.alert('Error', 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help & Support</Text>
          <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.subtleBg }]}>
            <X size={20} color={colors.textMuted} />
          </Pressable>
        </View>
        {/* FAQ Section */}
        <CardEntrance delay={0}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Frequently Asked Questions</Text>
          <GlassCard style={styles.section}>
            {FAQ_ITEMS.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => toggleFaq(index)}
                style={[
                  styles.faqRow,
                  index < FAQ_ITEMS.length - 1 && [styles.faqRowBorder, { borderBottomColor: colors.subtleBg }],
                ]}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.textSecondary }]}>{item.q}</Text>
                  {expandedIdx === index ? (
                    <ChevronUp size={16} color={colors.textMuted} />
                  ) : (
                    <ChevronDown size={16} color={colors.textMuted} />
                  )}
                </View>
                {expandedIdx === index && (
                  <Text style={[styles.faqAnswer, { color: colors.textMuted }]}>{item.a}</Text>
                )}
              </Pressable>
            ))}
          </GlassCard>
        </CardEntrance>

        {/* Contact Form Section */}
        <CardEntrance delay={120}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Contact Us</Text>
          {submitted ? (
            <GlassCard style={styles.successCard}>
              <CheckCircle size={40} color={colors.sage} />
              <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Message Sent!</Text>
              <Text style={[styles.successDescription, { color: colors.textMuted }]}>
                Thanks for reaching out. We typically respond within 24 hours.
              </Text>
            </GlassCard>
          ) : (
            <GlassCard style={styles.formCard}>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={colors.textDim}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Email</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.textDim}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Category</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryPills}
                >
                  {CONTACT_CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.categoryPill,
                        { backgroundColor: colors.subtleBg, borderColor: colors.border },
                        category === cat && { backgroundColor: colors.copperDim, borderColor: colors.copper },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryPillText,
                          { color: colors.textMuted },
                          category === cat && { color: colors.copper },
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Subject</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="What's this about?"
                  placeholderTextColor={colors.textDim}
                />
              </View>
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>Message</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Tell us how we can help..."
                  placeholderTextColor={colors.textDim}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={[
                  styles.submitButton,
                  { backgroundColor: colors.copper },
                  isSubmitting && styles.submitButtonDisabled,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.textPrimary} />
                ) : (
                  <>
                    <Send size={16} color={colors.textPrimary} />
                    <Text style={[styles.submitButtonText, { color: colors.textPrimary }]}>Send Message</Text>
                  </>
                )}
              </Pressable>
            </GlassCard>
          )}
        </CardEntrance>

        {/* Quick Links Section */}
        <CardEntrance delay={240}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Quick Links</Text>
          <GlassCard style={styles.section}>
            <Pressable
              onPress={() =>
                WebBrowser.openBrowserAsync('https://thedadcenter.com/privacy')
              }
              style={({ pressed }) => [
                styles.linkRow,
                styles.linkRowBorder,
                { borderBottomColor: colors.subtleBg },
                pressed && { backgroundColor: colors.pressed },
              ]}
            >
              <View style={styles.linkRowLeft}>
                <ExternalLink size={18} color={colors.textMuted} />
                <Text style={[styles.linkRowLabel, { color: colors.textSecondary }]}>Privacy Policy</Text>
              </View>
              <ChevronDown
                size={16}
                color={colors.textDim}
                style={{ transform: [{ rotate: '-90deg' }] }}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                WebBrowser.openBrowserAsync('https://thedadcenter.com/terms')
              }
              style={({ pressed }) => [
                styles.linkRow,
                styles.linkRowBorder,
                { borderBottomColor: colors.subtleBg },
                pressed && { backgroundColor: colors.pressed },
              ]}
            >
              <View style={styles.linkRowLeft}>
                <ExternalLink size={18} color={colors.textMuted} />
                <Text style={[styles.linkRowLabel, { color: colors.textSecondary }]}>Terms of Service</Text>
              </View>
              <ChevronDown
                size={16}
                color={colors.textDim}
                style={{ transform: [{ rotate: '-90deg' }] }}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                Linking.openURL('mailto:info@thedadcenter.com')
              }
              style={({ pressed }) => [
                styles.linkRow,
                pressed && { backgroundColor: colors.pressed },
              ]}
            >
              <View style={styles.linkRowLeft}>
                <Mail size={18} color={colors.textMuted} />
                <Text style={[styles.linkRowLabel, { color: colors.textSecondary }]}>Email Support</Text>
              </View>
              <ChevronDown
                size={16}
                color={colors.textDim}
                style={{ transform: [{ rotate: '-90deg' }] }}
              />
            </Pressable>
          </GlassCard>
        </CardEntrance>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },

  // Contact Form
  formCard: {
    padding: 16,
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },

  // Category pills
  categoryPills: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
  },

  // Success
  successCard: {
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  successTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
  },
  successDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Quick Links
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  linkRowBorder: {
    borderBottomWidth: 1,
  },
  linkRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  linkRowLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
})
