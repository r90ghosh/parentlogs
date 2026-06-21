import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { useColors } from '@/hooks/use-colors'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/components/providers/ThemeProvider'
import { SectionLabel } from '@/components/digest'

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
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.line }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.accentSoft }]}>
          <ChevronLeft size={20} color={colors.ink2} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Appearance</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <SectionLabel>Theme</SectionLabel>
        <View style={[styles.optionsCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
          {THEME_OPTIONS.map((option, index) => {
            const isSelected = selected === option.id
            const isLast = index === THEME_OPTIONS.length - 1
            return (
              <Pressable
                key={option.id}
                onPress={() => handleSelect(option.id)}
                style={({ pressed }) => [
                  styles.optionRow,
                  isSelected && { backgroundColor: colors.accentSoft },
                  !isLast && { borderBottomWidth: 1, borderBottomColor: colors.line2 },
                  pressed && !isSelected && { backgroundColor: colors.cardHover },
                ]}
              >
                {isSelected && <View style={[styles.selectedAccent, { backgroundColor: colors.accent }]} />}

                <View style={styles.optionContent}>
                  <Text style={[styles.optionLabel, { color: colors.ink }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.optionDescription, { color: colors.muted }]}>
                    {option.description}
                  </Text>
                </View>

                <View style={[styles.radio, { borderColor: colors.faint }, isSelected && { borderColor: colors.accent }]}>
                  {isSelected && <View style={[styles.radioDot, { backgroundColor: colors.accent }]} />}
                </View>
              </Pressable>
            )
          })}
        </View>
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
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    paddingHorizontal: 20,
  },
  optionsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    position: 'relative',
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
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15.5,
    marginBottom: 2,
  },
  optionDescription: {
    fontFamily: 'Jakarta-Regular',
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
