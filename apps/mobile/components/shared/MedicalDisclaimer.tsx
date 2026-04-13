import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { useColors } from '@/hooks/use-colors'

interface MedicalDisclaimerProps {
  style?: ViewStyle
}

export function MedicalDisclaimer({ style }: MedicalDisclaimerProps) {
  const colors = useColors()

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, { color: colors.textMuted }]}>
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
  text: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
})
