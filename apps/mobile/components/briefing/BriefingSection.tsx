import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { ChevronDown } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'

interface BriefingSectionProps {
  title: string
  icon: string
  children: React.ReactNode
  defaultExpanded?: boolean
  accentColor?: string
}

export function BriefingSection({
  title,
  icon,
  children,
  defaultExpanded = true,
  accentColor = '#c4703f',
}: BriefingSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const rotation = useSharedValue(defaultExpanded ? 180 : 0)

  const toggleExpanded = () => {
    const next = !expanded
    setExpanded(next)
    rotation.value = withTiming(next ? 180 : 0, { duration: 250 })
  }

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  return (
    <GlassCard style={[styles.card, { borderTopColor: accentColor }]}>
      <Pressable onPress={toggleExpanded} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={18} color="#7a6f62" />
        </Animated.View>
      </Pressable>
      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    borderTopWidth: 2,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 16,
    color: '#faf6f0',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
})
