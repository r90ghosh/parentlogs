import { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useCreateLog } from '@/hooks/use-tracker'
import { useColors } from '@/hooks/use-colors'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import type { LogType } from '@tdc/shared/types'

const LOG_TITLES: Record<LogType, string> = {
  feeding: 'Log Feeding',
  diaper: 'Log Diaper',
  sleep: 'Log Sleep',
  temperature: 'Log Temperature',
  medicine: 'Log Medicine',
  vitamin_d: 'Log Vitamin D',
  mood: 'Log Mood',
  weight: 'Log Weight',
  height: 'Log Height',
  milestone: 'Log Milestone',
  custom: 'Custom Log',
}

function OptionPill({
  label,
  selected,
  onPress,
  colors,
}: {
  label: string
  selected: boolean
  onPress: () => void
  colors: ReturnType<typeof useColors>
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPress()
      }}
      style={[
        styles.optionPill,
        { backgroundColor: colors.subtleBg, borderColor: colors.border },
        selected && { backgroundColor: colors.copper, borderColor: colors.copper },
      ]}
    >
      <Text
        style={[
          styles.optionPillText,
          { color: colors.textMuted },
          selected && { color: colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export default function LogScreen() {
  const colors = useColors()
  const { type: typeParam } = useLocalSearchParams<{ type: string }>()
  const logType = (typeParam || 'feeding') as LogType
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const createLog = useCreateLog()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notes, setNotes] = useState('')

  // Feeding fields
  const [feedingType, setFeedingType] = useState<'breast' | 'bottle' | 'solid'>('breast')
  const [feedingSide, setFeedingSide] = useState<'left' | 'right' | 'both'>('left')
  const [feedingAmount, setFeedingAmount] = useState('')
  const [feedingDuration, setFeedingDuration] = useState('')

  // Diaper
  const [diaperType, setDiaperType] = useState<'wet' | 'dirty' | 'both'>('wet')

  // Sleep
  const [sleepDuration, setSleepDuration] = useState('')
  const [sleepQuality, setSleepQuality] = useState<'good' | 'fair' | 'poor'>('good')

  // Temperature
  const [temperature, setTemperature] = useState('')
  const [temperatureUnit, setTemperatureUnit] = useState<'F' | 'C'>('F')

  // Medicine
  const [medicineName, setMedicineName] = useState('')
  const [medicineDosage, setMedicineDosage] = useState('')

  // Mood
  const [moodLevel, setMoodLevel] = useState(3)

  // Weight
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs')

  // Height
  const [height, setHeight] = useState('')
  const [heightUnit, setHeightUnit] = useState<'in' | 'cm'>('in')

  // Milestone
  const [milestoneName, setMilestoneName] = useState('')

  // Custom
  const [customType, setCustomType] = useState('')

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const logData: Record<string, any> = {}

    switch (logType) {
      case 'feeding':
        logData.type = feedingType
        if (feedingType === 'breast') {
          logData.side = feedingSide
          logData.duration_minutes = parseInt(feedingDuration) || 0
        } else {
          logData.amount_oz = parseFloat(feedingAmount) || 0
        }
        break
      case 'diaper':
        logData.type = diaperType
        break
      case 'sleep':
        logData.duration_minutes = parseInt(sleepDuration) || 0
        logData.quality = sleepQuality
        break
      case 'temperature':
        logData.value = parseFloat(temperature) || 0
        logData.unit = temperatureUnit
        break
      case 'medicine':
        logData.name = medicineName
        logData.dosage = medicineDosage
        break
      case 'vitamin_d':
        logData.given = true
        break
      case 'mood':
        logData.level = moodLevel
        break
      case 'weight':
        logData.value = parseFloat(weight) || 0
        logData.unit = weightUnit
        break
      case 'height':
        logData.value = parseFloat(height) || 0
        logData.unit = heightUnit
        break
      case 'milestone':
        logData.name = milestoneName
        break
      case 'custom':
        logData.type = customType
        break
    }

    try {
      const result = await createLog.mutateAsync({
        log_type: logType,
        log_data: logData,
        notes: notes || undefined,
      })

      if (result.error) {
        Alert.alert('Error', result.error.message)
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        router.back()
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save log')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: 8, backgroundColor: colors.overlay, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
          <ChevronLeft size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {LOG_TITLES[logType] || 'Log Entry'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: 60,
              paddingBottom: insets.bottom + 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CardEntrance delay={0}>
            <GlassCard style={styles.formCard}>
              {/* Feeding */}
              {logType === 'feeding' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Type</Text>
                  <View style={styles.optionRow}>
                    <OptionPill
                      label="Breast"
                      selected={feedingType === 'breast'}
                      onPress={() => setFeedingType('breast')}
                      colors={colors}
                    />
                    <OptionPill
                      label="Bottle"
                      selected={feedingType === 'bottle'}
                      onPress={() => setFeedingType('bottle')}
                      colors={colors}
                    />
                    <OptionPill
                      label="Solid"
                      selected={feedingType === 'solid'}
                      onPress={() => setFeedingType('solid')}
                      colors={colors}
                    />
                  </View>

                  {feedingType === 'breast' && (
                    <>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Side</Text>
                      <View style={styles.optionRow}>
                        <OptionPill
                          label="Left"
                          selected={feedingSide === 'left'}
                          onPress={() => setFeedingSide('left')}
                          colors={colors}
                        />
                        <OptionPill
                          label="Right"
                          selected={feedingSide === 'right'}
                          onPress={() => setFeedingSide('right')}
                          colors={colors}
                        />
                        <OptionPill
                          label="Both"
                          selected={feedingSide === 'both'}
                          onPress={() => setFeedingSide('both')}
                          colors={colors}
                        />
                      </View>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Duration (minutes)</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                        value={feedingDuration}
                        onChangeText={setFeedingDuration}
                        placeholder="15"
                        placeholderTextColor={colors.textDim}
                        keyboardType="number-pad"
                      />
                    </>
                  )}

                  {(feedingType === 'bottle' || feedingType === 'solid') && (
                    <>
                      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Amount (oz)</Text>
                      <TextInput
                        style={[styles.input, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                        value={feedingAmount}
                        onChangeText={setFeedingAmount}
                        placeholder="4"
                        placeholderTextColor={colors.textDim}
                        keyboardType="decimal-pad"
                      />
                    </>
                  )}
                </>
              )}

              {/* Diaper */}
              {logType === 'diaper' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Type</Text>
                  <View style={styles.optionRow}>
                    <OptionPill
                      label="Wet"
                      selected={diaperType === 'wet'}
                      onPress={() => setDiaperType('wet')}
                      colors={colors}
                    />
                    <OptionPill
                      label="Dirty"
                      selected={diaperType === 'dirty'}
                      onPress={() => setDiaperType('dirty')}
                      colors={colors}
                    />
                    <OptionPill
                      label="Both"
                      selected={diaperType === 'both'}
                      onPress={() => setDiaperType('both')}
                      colors={colors}
                    />
                  </View>
                </>
              )}

              {/* Sleep */}
              {logType === 'sleep' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Duration (minutes)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                    value={sleepDuration}
                    onChangeText={setSleepDuration}
                    placeholder="60"
                    placeholderTextColor={colors.textDim}
                    keyboardType="number-pad"
                  />
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Quality</Text>
                  <View style={styles.optionRow}>
                    <OptionPill
                      label="Good"
                      selected={sleepQuality === 'good'}
                      onPress={() => setSleepQuality('good')}
                      colors={colors}
                    />
                    <OptionPill
                      label="Fair"
                      selected={sleepQuality === 'fair'}
                      onPress={() => setSleepQuality('fair')}
                      colors={colors}
                    />
                    <OptionPill
                      label="Poor"
                      selected={sleepQuality === 'poor'}
                      onPress={() => setSleepQuality('poor')}
                      colors={colors}
                    />
                  </View>
                </>
              )}

              {/* Temperature */}
              {logType === 'temperature' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Temperature</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.inputFlex, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                      value={temperature}
                      onChangeText={setTemperature}
                      placeholder="98.6"
                      placeholderTextColor={colors.textDim}
                      keyboardType="decimal-pad"
                    />
                    <View style={styles.unitToggle}>
                      <OptionPill
                        label="°F"
                        selected={temperatureUnit === 'F'}
                        onPress={() => setTemperatureUnit('F')}
                        colors={colors}
                      />
                      <OptionPill
                        label="°C"
                        selected={temperatureUnit === 'C'}
                        onPress={() => setTemperatureUnit('C')}
                        colors={colors}
                      />
                    </View>
                  </View>
                  <Text style={[styles.fieldDisclaimer, { color: colors.textDim }]}>
                    For concerns about your baby's temperature, contact your pediatrician.
                  </Text>
                </>
              )}

              {/* Medicine */}
              {logType === 'medicine' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Medicine Name</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                    value={medicineName}
                    onChangeText={setMedicineName}
                    placeholder="Tylenol"
                    placeholderTextColor={colors.textDim}
                  />
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Dosage</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                    value={medicineDosage}
                    onChangeText={setMedicineDosage}
                    placeholder="2.5ml"
                    placeholderTextColor={colors.textDim}
                  />
                  <Text style={[styles.fieldDisclaimer, { color: colors.textDim }]}>
                    Always verify medication dosages with your pediatrician.
                  </Text>
                </>
              )}

              {/* Vitamin D */}
              {logType === 'vitamin_d' && (
                <View style={styles.vitaminDContainer}>
                  <Text style={[styles.vitaminDText, { color: colors.textSecondary }]}>
                    Tap Save to log Vitamin D as given.
                  </Text>
                </View>
              )}

              {/* Mood */}
              {logType === 'mood' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Mood Level</Text>
                  <View style={styles.moodRow}>
                    {[
                      { level: 1, emoji: '😢' },
                      { level: 2, emoji: '😕' },
                      { level: 3, emoji: '😐' },
                      { level: 4, emoji: '😊' },
                      { level: 5, emoji: '😄' },
                    ].map(({ level, emoji }) => (
                      <Pressable
                        key={level}
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Medium
                          )
                          setMoodLevel(level)
                        }}
                        style={[
                          styles.moodButton,
                          { backgroundColor: colors.subtleBg },
                          moodLevel === level && { backgroundColor: colors.copper, transform: [{ scale: 1.1 }] },
                        ]}
                      >
                        <Text style={styles.moodEmoji}>{emoji}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}

              {/* Weight */}
              {logType === 'weight' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Weight</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.inputFlex, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="12.5"
                      placeholderTextColor={colors.textDim}
                      keyboardType="decimal-pad"
                    />
                    <View style={styles.unitToggle}>
                      <OptionPill
                        label="lbs"
                        selected={weightUnit === 'lbs'}
                        onPress={() => setWeightUnit('lbs')}
                        colors={colors}
                      />
                      <OptionPill
                        label="kg"
                        selected={weightUnit === 'kg'}
                        onPress={() => setWeightUnit('kg')}
                        colors={colors}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Height */}
              {logType === 'height' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Height</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.inputFlex, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                      value={height}
                      onChangeText={setHeight}
                      placeholder="24"
                      placeholderTextColor={colors.textDim}
                      keyboardType="decimal-pad"
                    />
                    <View style={styles.unitToggle}>
                      <OptionPill
                        label="in"
                        selected={heightUnit === 'in'}
                        onPress={() => setHeightUnit('in')}
                        colors={colors}
                      />
                      <OptionPill
                        label="cm"
                        selected={heightUnit === 'cm'}
                        onPress={() => setHeightUnit('cm')}
                        colors={colors}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Milestone */}
              {logType === 'milestone' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Milestone</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                    value={milestoneName}
                    onChangeText={setMilestoneName}
                    placeholder="First smile"
                    placeholderTextColor={colors.textDim}
                  />
                </>
              )}

              {/* Custom */}
              {logType === 'custom' && (
                <>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Log Type</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                    value={customType}
                    onChangeText={setCustomType}
                    placeholder="Bath time"
                    placeholderTextColor={colors.textDim}
                  />
                </>
              )}

              {/* Notes */}
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Notes (optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any notes..."
                placeholderTextColor={colors.textDim}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {/* Submit */}
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
                  <ActivityIndicator size="small" color={colors.textPrimary} />
                ) : (
                  <Text style={[styles.submitButtonText, { color: colors.textPrimary }]}>Save Log</Text>
                )}
              </Pressable>
            </GlassCard>
          </CardEntrance>
          <MedicalDisclaimer style={{ marginTop: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
  },
  headerSpacer: {
    width: 36,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  formCard: {
    padding: 20,
  },
  fieldLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Jost-Regular',
    fontSize: 15,
  },
  inputFlex: {
    flex: 1,
  },
  notesInput: {
    minHeight: 80,
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  unitToggle: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 2,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  optionPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  moodButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 24,
  },
  vitaminDContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  vitaminDText: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    textAlign: 'center',
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  fieldDisclaimer: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    marginTop: 8,
    lineHeight: 16,
  },
})
