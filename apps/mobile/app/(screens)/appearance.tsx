import { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronLeft } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ThemePreference = 'system' | 'dark' | 'light'

const THEME_STORAGE_KEY = '@tdc_theme_preference'

interface ThemeOption {
  id: ThemePreference
  label: string
  description: string
  disabled?: boolean
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'system',
    label: 'System',
    description: 'Match your device settings',
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Always use dark theme',
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Coming soon',
    disabled: true,
  },
]

export default function AppearanceScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [selected, setSelected] = useState<ThemePreference>('system')

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((value) => {
        if (value === 'system' || value === 'dark' || value === 'light') {
          setSelected(value)
        }
      })
      .catch(() => {
        // Ignore storage errors, default to 'system'
      })
  }, [])

  const handleSelect = async (option: ThemePreference) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelected(option)
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, option)
    } catch {
      // Ignore storage errors
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={20} color="#ede6dc" />
        </Pressable>
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <CardEntrance delay={0}>
          <Text style={styles.sectionLabel}>Theme</Text>
          <GlassCard style={styles.optionsCard}>
            {THEME_OPTIONS.map((option, index) => {
              const isSelected = selected === option.id
              const isLast = index === THEME_OPTIONS.length - 1
              const isDisabled = option.disabled
              return (
                <Pressable
                  key={option.id}
                  onPress={() => !isDisabled && handleSelect(option.id)}
                  disabled={isDisabled}
                  style={({ pressed }) => [
                    styles.optionRow,
                    isSelected && styles.optionRowSelected,
                    !isLast && styles.optionRowBorder,
                    pressed && !isDisabled && styles.optionRowPressed,
                    isDisabled && styles.optionRowDisabled,
                  ]}
                >
                  {/* Left accent border for selected */}
                  {isSelected && <View style={styles.selectedAccent} />}

                  <View style={styles.optionContent}>
                    <Text style={[styles.optionLabel, isDisabled && styles.optionLabelDisabled]}>
                      {option.label}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>

                  {/* Radio indicator */}
                  <View
                    style={[
                      styles.radio,
                      isSelected && styles.radioSelected,
                      isDisabled && styles.radioDisabled,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </Pressable>
              )
            })}
          </GlassCard>
        </CardEntrance>

        <CardEntrance delay={120}>
          <Text style={styles.noteText}>
            The app currently uses a dark theme. Additional theme options coming soon.
          </Text>
        </CardEntrance>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  sectionLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  optionsCard: {
    overflow: 'hidden',
    padding: 0,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  optionRowSelected: {
    backgroundColor: 'rgba(196,112,63,0.06)',
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  optionRowPressed: {
    backgroundColor: 'rgba(237,230,220,0.04)',
  },
  optionRowDisabled: {
    opacity: 0.4,
  },
  optionLabelDisabled: {
    color: '#4a4239',
  },
  radioDisabled: {
    borderColor: '#2a2520',
  },
  selectedAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#c4703f',
  },
  optionContent: {
    flex: 1,
    paddingLeft: 8,
  },
  optionLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
    marginBottom: 2,
  },
  optionDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4a4239',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#c4703f',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c4703f',
  },
  noteText: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#4a4239',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
})
