import { BlurView } from 'expo-blur'
import { Platform, StyleSheet, View, type ViewProps } from 'react-native'
import { useColors } from '@/hooks/use-colors'

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
  const colors = useColors()

  const blurIntensity = intensity ?? colors.blurIntensity

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        tint={colors.blurTint}
        intensity={blurIntensity}
        style={[
          {
            borderRadius: 14,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.glassBorder,
          },
          style,
        ]}
        {...props}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: 13,
              borderWidth: 1,
              borderColor: colors.glassInnerBorder,
            },
          ]}
          pointerEvents="none"
        />
        {children}
      </BlurView>
    )
  }

  return (
    <View
      style={[
        {
          borderRadius: 14,
          backgroundColor: colors.glassBg,
          borderWidth: 1,
          borderColor: colors.glassBorder,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}
