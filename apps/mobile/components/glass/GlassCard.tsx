import { BlurView } from 'expo-blur'
import { Platform, View, type ViewProps } from 'react-native'
import { useTheme } from '@/components/providers/ThemeProvider'

interface GlassCardProps extends ViewProps {
  intensity?: number
  children: React.ReactNode
}

export function GlassCard({
  children,
  intensity,
  style,
  ...props
}: GlassCardProps) {
  const { isDark } = useTheme()

  const blurIntensity = intensity ?? (isDark ? 40 : 50)
  const tint = isDark ? 'dark' : 'light'
  const borderColor = isDark
    ? 'rgba(237,230,220,0.08)'
    : 'rgba(255,255,255,0.55)'
  const fallbackBg = isDark
    ? 'rgba(32,28,24,0.92)'
    : 'rgba(255,255,255,0.42)'

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        tint={tint}
        intensity={blurIntensity}
        style={[
          {
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </BlurView>
    )
  }

  return (
    <View
      style={[
        {
          borderRadius: 12,
          backgroundColor: fallbackBg,
          borderWidth: 1,
          borderColor,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}
