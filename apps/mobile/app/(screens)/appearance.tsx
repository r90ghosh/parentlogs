import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useColors } from '@/hooks/use-colors'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/components/providers/ThemeProvider'

type ThemePreference = 'system' | 'dark' | 'light'

interface ThemeOption {
  id: ThemePreference
  label: string
  description: string
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
    description: 'Dark background with floating stars',
  },
  {
    id: 'light',
    label: 'Light',
    description: 'Pastel gradient with glass cards',
  },
]

export default function AppearanceScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { theme: selected, setTheme } = useTheme()
  const colors = useColors()

  const handleSelect = (option: ThemePreference) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setTheme(option)
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
          <ChevronLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Appearance</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <CardEntrance delay={0}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Theme</Text>
          <GlassCard style={styles.optionsCard}>
            {THEME_OPTIONS.map((option, index) => {
              const isSelected = selected === option.id
              const isLast = index === THEME_OPTIONS.length - 1
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleSelect(option.id)}
                  style={({ pressed }) => [
                    styles.optionRow,
                    isSelected && { backgroundColor: colors.copperDim },
                    !isLast && [styles.optionRowBorder, { borderBottomColor: colors.border }],
                    pressed && { backgroundColor: colors.pressed },
                  ]}
                >
                  {isSelected && <View style={[styles.selectedAccent, { backgroundColor: colors.copper }]} />}

                  <View style={styles.optionContent}>
                    <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.optionDescription, { color: colors.textMuted }]}>
                      {option.description}
                    </Text>
                  </View>

                  <View style={[styles.radio, { borderColor: colors.textDim }, isSelected && { borderColor: colors.copper }]}>
                    {isSelected && <View style={[styles.radioDot, { backgroundColor: colors.copper }]} />}
                  </View>
                </Pressable>
              )
            })}
          </GlassCard>
        </CardEntrance>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
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
  optionRowBorder: {
    borderBottomWidth: 1,
  },
  selectedAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  optionContent: {
    flex: 1,
    paddingLeft: 8,
  },
  optionLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  optionDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
