import { useState, useEffect } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ArrowLeft, Sliders } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useDadProfile, useUpsertDadProfile } from '@/hooks/use-journey'
import { useColors } from '@/hooks/use-colors'

// Work situation options
const WORK_SITUATIONS = [
  { value: 'full-time', label: 'Working full-time' },
  { value: 'part-time', label: 'Working part-time' },
  { value: 'stay-at-home', label: 'Stay-at-home' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'other', label: 'Other' },
]

// Primary concerns (multi-select)
const CONCERN_OPTIONS = [
  { value: 'finances', label: 'Finances' },
  { value: 'work-life-balance', label: 'Work-life balance' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'baby-health', label: "Baby's health" },
  { value: 'mental-health', label: 'Mental health' },
  { value: 'sleep-deprivation', label: 'Sleep deprivation' },
  { value: 'being-a-good-dad', label: 'Being a good dad' },
]

// Partner relationship options
const PARTNER_RELATIONSHIP_OPTIONS = [
  { value: 'strong', label: 'Strong' },
  { value: 'good-but-stressed', label: 'Good but stressed' },
  { value: 'needs-work', label: 'Needs work' },
  { value: 'complicated', label: 'Complicated' },
]

// Support system options — maps to family_nearby boolean
const SUPPORT_OPTIONS = [
  { value: 'strong', label: 'Strong' },
  { value: 'some', label: 'Some support' },
  { value: 'limited', label: 'Limited' },
  { value: 'alone', label: 'Mostly alone' },
]

function deriveSupportValue(familyNearby: boolean | null): string | null {
  if (familyNearby === null) return null
  return familyNearby ? 'strong' : 'limited'
}

function supportValueToFamilyNearby(value: string): boolean {
  return value === 'strong' || value === 'some'
}

interface SectionCardProps {
  title: string
  children: React.ReactNode
  colors: ReturnType<typeof useColors>
}

function SectionCard({ title, children, colors }: SectionCardProps) {
  return (
    <GlassCard style={sectionStyles.card}>
      <Text style={[sectionStyles.title, { color: colors.textMuted }]}>{title}</Text>
      {children}
    </GlassCard>
  )
}

const sectionStyles = StyleSheet.create({
  card: {
    padding: 16,
  },
  title: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
})

interface PillGroupProps {
  options: { value: string; label: string }[]
  selected: string | null
  onSelect: (value: string) => void
  wrap?: boolean
  colors: ReturnType<typeof useColors>
}

function PillGroup({ options, selected, onSelect, wrap = true, colors }: PillGroupProps) {
  return (
    <View style={[pillStyles.row, wrap && pillStyles.wrap]}>
      {options.map((opt) => {
        const isSelected = selected === opt.value
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              pillStyles.pill,
              isSelected
                ? { backgroundColor: colors.copperDim, borderWidth: 1, borderColor: colors.copper }
                : { backgroundColor: colors.subtleBg, borderWidth: 1, borderColor: colors.textDim },
            ]}
          >
            <Text
              style={[
                pillStyles.text,
                { color: isSelected ? colors.copper : colors.textMuted },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

interface MultiPillGroupProps {
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
  colors: ReturnType<typeof useColors>
}

function MultiPillGroup({ options, selected, onToggle, colors }: MultiPillGroupProps) {
  return (
    <View style={[pillStyles.row, pillStyles.wrap]}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value)
        return (
          <Pressable
            key={opt.value}
            onPress={() => onToggle(opt.value)}
            style={[
              pillStyles.pill,
              isSelected
                ? { backgroundColor: colors.copperDim, borderWidth: 1, borderColor: colors.copper }
                : { backgroundColor: colors.subtleBg, borderWidth: 1, borderColor: colors.textDim },
            ]}
          >
            <Text
              style={[
                pillStyles.text,
                { color: isSelected ? colors.copper : colors.textMuted },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const pillStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  text: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
})

export default function PersonalizeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const colors = useColors()
  const { data: profile, isLoading: profileLoading } = useDadProfile()
  const upsertProfile = useUpsertDadProfile()

  const [workSituation, setWorkSituation] = useState<string | null>(null)
  const [isFirstTimeDad, setIsFirstTimeDad] = useState<boolean | null>(null)
  const [concerns, setConcerns] = useState<string[]>([])
  const [partnerRelationship, setPartnerRelationship] = useState<string | null>(null)
  const [supportSystem, setSupportSystem] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Populate form from loaded profile
  useEffect(() => {
    if (profile && !initialized) {
      setWorkSituation(profile.work_situation ?? null)
      setIsFirstTimeDad(profile.is_first_time_dad ?? null)
      setConcerns(profile.concerns ?? [])
      setPartnerRelationship(profile.partner_relationship ?? null)
      setSupportSystem(deriveSupportValue(profile.family_nearby ?? null))
      setInitialized(true)
    }
  }, [profile, initialized])

  const toggleConcern = (value: string) => {
    setConcerns((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    )
  }

  const handleSave = () => {
    upsertProfile.mutate(
      {
        work_situation: workSituation,
        is_first_time_dad: isFirstTimeDad,
        concerns,
        partner_relationship: partnerRelationship,
        family_nearby: supportSystem !== null ? supportValueToFamilyNearby(supportSystem) : null,
      },
      {
        onSuccess: () => router.back(),
      }
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Personalize</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.copperDim }]}>
            <Sliders size={28} color={colors.copper} />
          </View>
          <Text style={[styles.iconDescription, { color: colors.textMuted }]}>
            Tell us a bit about yourself so we can tailor your experience.
          </Text>
        </View>

        {profileLoading ? (
          <ActivityIndicator color={colors.copper} style={styles.loader} />
        ) : (
          <View style={styles.form}>
            {/* Work Situation */}
            <SectionCard title="Work Situation" colors={colors}>
              <PillGroup
                options={WORK_SITUATIONS}
                selected={workSituation}
                onSelect={setWorkSituation}
                colors={colors}
              />
            </SectionCard>

            {/* First Time Dad */}
            <SectionCard title="First Time Dad" colors={colors}>
              <PillGroup
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]}
                selected={
                  isFirstTimeDad === null ? null : isFirstTimeDad ? 'yes' : 'no'
                }
                onSelect={(v) => setIsFirstTimeDad(v === 'yes')}
                wrap={false}
                colors={colors}
              />
            </SectionCard>

            {/* Primary Concerns */}
            <SectionCard title="Primary Concerns" colors={colors}>
              <MultiPillGroup
                options={CONCERN_OPTIONS}
                selected={concerns}
                onToggle={toggleConcern}
                colors={colors}
              />
            </SectionCard>

            {/* Partner Relationship */}
            <SectionCard title="Partner Relationship" colors={colors}>
              <PillGroup
                options={PARTNER_RELATIONSHIP_OPTIONS}
                selected={partnerRelationship}
                onSelect={setPartnerRelationship}
                colors={colors}
              />
            </SectionCard>

            {/* Support System */}
            <SectionCard title="Support System" colors={colors}>
              <PillGroup
                options={SUPPORT_OPTIONS}
                selected={supportSystem}
                onSelect={setSupportSystem}
                colors={colors}
              />
            </SectionCard>

            {/* Error */}
            {upsertProfile.isError && (
              <View style={[styles.errorContainer, { backgroundColor: colors.coralDim, borderColor: 'rgba(212,131,107,0.2)' }]}>
                <Text style={[styles.errorText, { color: colors.coral }]}>
                  Something went wrong. Please try again.
                </Text>
              </View>
            )}

            {/* Save button */}
            <Pressable
              onPress={handleSave}
              disabled={upsertProfile.isPending}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.copper },
                pressed && styles.buttonPressed,
                upsertProfile.isPending && styles.buttonDisabled,
              ]}
            >
              {upsertProfile.isPending ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Save</Text>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  loader: {
    marginTop: 40,
  },
  form: {
    gap: 16,
  },
  errorContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  errorText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
})
