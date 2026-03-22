import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, G, Circle, Path } from 'react-native-svg'

interface BrandLogoProps {
  size?: number
  showText?: boolean
  textSize?: number
}

export function BrandLogoIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
      <Defs>
        <LinearGradient id="parent" x1="0" y1="0" x2="0.5" y2="1">
          <Stop offset="0%" stopColor="#d4a853" />
          <Stop offset="50%" stopColor="#c4703f" />
          <Stop offset="100%" stopColor="#a85a2a" />
        </LinearGradient>
        <LinearGradient id="child" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#d4a853" />
          <Stop offset="100%" stopColor="#c4703f" />
        </LinearGradient>
      </Defs>
      <G transform="translate(256, 230)">
        <Circle cx={-28} cy={-100} r={52} fill="none" stroke="url(#parent)" strokeWidth={16} />
        <Path
          d="M-76 -38 Q-100 80 -52 164 Q-4 240 88 228"
          fill="none"
          stroke="url(#parent)"
          strokeWidth={16}
          strokeLinecap="round"
        />
        <Circle cx={52} cy={48} r={34} fill="none" stroke="url(#child)" strokeWidth={13} opacity={0.85} />
        <Path
          d="M24 -52 Q76 -12 64 52"
          fill="none"
          stroke="url(#parent)"
          strokeWidth={10}
          strokeLinecap="round"
          opacity={0.45}
        />
        <Circle cx={12} cy={-4} r={8} fill="#d4a853" opacity={0.55} />
      </G>
    </Svg>
  )
}

export function BrandLogo({ size = 40, showText = true, textSize = 32 }: BrandLogoProps) {
  return (
    <View style={styles.container}>
      <BrandLogoIcon size={size} />
      {showText && (
        <Text style={[styles.brand, { fontSize: textSize }]}>The Dad Center</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brand: {
    fontFamily: 'PlayfairDisplay-Bold',
    color: '#faf6f0',
  },
})
