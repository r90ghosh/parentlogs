import { BlurView } from 'expo-blur'
import { Platform, View, type ViewProps } from 'react-native'

interface GlassCardProps extends ViewProps {
  intensity?: number
  children: React.ReactNode
}

export function GlassCard({
  children,
  intensity = 40,
  style,
  ...props
}: GlassCardProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        tint="dark"
        intensity={intensity}
        style={[
          {
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(237,230,220,0.08)',
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
          backgroundColor: 'rgba(32,28,24,0.92)',
          borderWidth: 1,
          borderColor: 'rgba(237,230,220,0.08)',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}
