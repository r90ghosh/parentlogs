import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FloatingParticles } from '@/components/animations/FloatingParticles'
import { useTheme } from '@/components/providers/ThemeProvider'

export function AppBackground() {
  const { isDark } = useTheme()

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {isDark ? (
        <LinearGradient
          colors={['#12100e', '#1a1714', '#12100e']}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <LinearGradient
          colors={['#fce4ec', '#f5f7fa', '#e1f0fa', '#d4e9f7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <FloatingParticles count={30} />
    </View>
  )
}
