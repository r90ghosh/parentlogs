import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FloatingParticles } from '@/components/animations/FloatingParticles'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useColors } from '@/hooks/use-colors'

export function AppBackground() {
  const { isDark } = useTheme()
  const colors = useColors()

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {isDark ? (
        <>
          <LinearGradient
            colors={[...colors.bgGradient]}
            style={StyleSheet.absoluteFill}
          />
          {/* Copper radial warmth — top-right corner glow */}
          <LinearGradient
            colors={[colors.copperDim, 'transparent']}
            start={{ x: 0.8, y: 0 }}
            end={{ x: 0.2, y: 0.6 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Subtle noise-like tint overlay */}
          <View style={[styles.noiseOverlay, { backgroundColor: colors.copperDim }]} />
        </>
      ) : (
        <LinearGradient
          colors={['#d4e9f7', '#e1f0fa', '#f5f7fa', '#fce4ec']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <FloatingParticles count={18} />
    </View>
  )
}

const styles = StyleSheet.create({
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
})
