import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { useTheme } from '@/components/providers/ThemeProvider'

interface MedicalDisclaimerProps {
  style?: ViewStyle
}

export function MedicalDisclaimer({ style }: MedicalDisclaimerProps) {
  const { isDark } = useTheme()

  return (
    <View style={[styles.container, !isDark && styles.containerLight, style]}>
      <Text style={[styles.text, !isDark && styles.textLight]}>
        Content is for informational purposes only and does not replace professional medical advice. Always consult your healthcare provider.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  containerLight: {},
  text: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 16,
  },
  textLight: {
    color: '#9ca3af',
  },
})
