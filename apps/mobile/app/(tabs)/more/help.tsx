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
  ChevronDown,
  ChevronUp,
  Send,
  ExternalLink,
  Mail,
  CheckCircle,
  ChevronRight,
} from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { contactService } from '@/lib/services'
import * as WebBrowser from 'expo-web-browser'
import { useColors } from '@/hooks/use-colors'
import { SectionLabel } from '@/components/digest'

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
          <Text style={[styles.headerTitle, { color: colors.ink }]}>Help & Support</Text>
          <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.accentSoft }]}>
            <X size={20} color={colors.muted} />
          </Pressable>
        </View>

        {/* FAQ Section */}
        <SectionLabel>Frequently Asked Questions</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
          {FAQ_ITEMS.map((item, index) => {
            const isLast = index === FAQ_ITEMS.length - 1
            return (
              <Pressable
                key={index}
                onPress={() => toggleFaq(index)}
                style={({ pressed }) => [
                  styles.faqRow,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: colors.line2 },
                  pressed && { backgroundColor: colors.cardHover },
                ]}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.ink }]}>{item.q}</Text>
                  {expandedIdx === index ? (
                    <ChevronUp size={16} color={colors.muted} />
                  ) : (
                    <ChevronDown size={16} color={colors.muted} />
                  )}
                </View>
                {expandedIdx === index && (
                  <Text style={[styles.faqAnswer, { color: colors.muted }]}>{item.a}</Text>
                )}
              </Pressable>
            )
          })}
        </View>

        {/* Contact Form Section */}
        <SectionLabel>Contact Us</SectionLabel>
        {submitted ? (
          <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <CheckCircle size={40} color={colors.sage} />
            <Text style={[styles.successTitle, { color: colors.ink }]}>Message Sent!</Text>
            <Text style={[styles.successDescription, { color: colors.muted }]}>
              Thanks for reaching out. We typically respond within 24 hours.
            </Text>
          </View>
        ) : (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.faint}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={colors.faint}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Category</Text>
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
                      { borderColor: colors.line },
                      category === cat && { backgroundColor: colors.accent, borderColor: colors.accent },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        { color: colors.muted },
                        category === cat && { color: '#fff' },
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Subject</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={subject}
                onChangeText={setSubject}
                placeholder="What's this about?"
                placeholderTextColor={colors.faint}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.muted }]}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={message}
                onChangeText={setMessage}
                placeholder="Tell us how we can help..."
                placeholderTextColor={colors.faint}
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
                { backgroundColor: colors.accent },
                isSubmitting && styles.submitButtonDisabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Send size={16} color="#fff" />
                  <Text style={styles.submitButtonText}>Send Message</Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {/* Quick Links Section */}
        <SectionLabel>Quick Links</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/privacy')}
            style={({ pressed }) => [
              styles.linkRow,
              { borderBottomWidth: 1, borderBottomColor: colors.line2 },
              pressed && { backgroundColor: colors.cardHover },
            ]}
          >
            <View style={styles.linkRowLeft}>
              <ExternalLink size={18} color={colors.muted} />
              <Text style={[styles.linkRowLabel, { color: colors.ink }]}>Privacy Policy</Text>
            </View>
            <ChevronRight size={16} color={colors.faint} />
          </Pressable>
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/terms')}
            style={({ pressed }) => [
              styles.linkRow,
              { borderBottomWidth: 1, borderBottomColor: colors.line2 },
              pressed && { backgroundColor: colors.cardHover },
            ]}
          >
            <View style={styles.linkRowLeft}>
              <ExternalLink size={18} color={colors.muted} />
              <Text style={[styles.linkRowLabel, { color: colors.ink }]}>Terms of Service</Text>
            </View>
            <ChevronRight size={16} color={colors.faint} />
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL('mailto:info@thedadcenter.com')}
            style={({ pressed }) => [
              styles.linkRow,
              pressed && { backgroundColor: colors.cardHover },
            ]}
          >
            <View style={styles.linkRowLeft}>
              <Mail size={18} color={colors.muted} />
              <Text style={[styles.linkRowLabel, { color: colors.ink }]}>Email Support</Text>
            </View>
            <ChevronRight size={16} color={colors.faint} />
          </Pressable>
        </View>
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
    fontFamily: 'Jakarta-SemiBold',
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

  // Card
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 4,
  },

  // FAQ
  faqRow: {
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },

  // Contact Form
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16,
    marginBottom: 4,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Jakarta-Medium',
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 14,
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
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
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
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
  },

  // Success
  successCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    marginBottom: 4,
    alignItems: 'center',
    gap: 12,
  },
  successTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 20,
  },
  successDescription: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Quick Links
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  linkRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  linkRowLabel: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15.5,
  },
})
