import { useState, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions, FlatList } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BookOpen, CheckSquare, BarChart3 } from 'lucide-react-native'
import { useColors } from '@/hooks/use-colors'

const { width: screenWidth } = Dimensions.get('window')

const SLIDES = [
  {
    icon: BookOpen,
    color: '#5b9bd5',
    title: 'Week-by-Week Briefings',
    description:
      "Stay informed with personalized weekly updates about your baby's development, what to expect, and what to focus on.",
  },
  {
    icon: CheckSquare,
    color: '#6b8f71',
    title: 'Smart Task Management',
    description:
      'Never miss a thing. Get timely reminders for appointments, preparations, and important milestones.',
  },
  {
    icon: BarChart3,
    color: '#c4703f',
    title: 'Track Everything',
    description:
      "From feedings and diapers to sleep patterns — keep your baby's data organized and shareable with your partner.",
  },
]

export default function WelcomeScreen() {
  const colors = useColors()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const goToRole = () => {
    router.replace('/(onboarding)/role')
  }

  const goToNext = () => {
    const nextIndex = currentIndex + 1
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
    setCurrentIndex(nextIndex)
  }

  const renderSlide = ({ item }: { item: (typeof SLIDES)[number] }) => {
    const Icon = item.icon
    return (
      <View style={styles.slide}>
        <View style={[styles.iconCircle, { backgroundColor: `${item.color}20` }]}>
          <Icon size={36} color={item.color} />
        </View>
        <Text style={[styles.title, { color: colors.ink }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.muted }]}>{item.description}</Text>
      </View>
    )
  }

  const isLastSlide = currentIndex === SLIDES.length - 1

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth)
          setCurrentIndex(idx)
        }}
        renderItem={renderSlide}
        keyExtractor={(_, i) => String(i)}
      />

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.dotRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex
                  ? [styles.activeDot, { backgroundColor: colors.accent }]
                  : [styles.inactiveDot, { backgroundColor: colors.line }],
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={isLastSlide ? goToRole : goToNext}
          style={({ pressed }) => [styles.button, { backgroundColor: colors.accent }, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.buttonText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
        </Pressable>

        {!isLastSlide && (
          <Pressable onPress={goToRole}>
            <Text style={[styles.skipText, { color: colors.muted }]}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 26,
    textAlign: 'center',
    marginTop: 28,
    letterSpacing: -0.3,
  },
  description: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 14,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
  },
  inactiveDot: {
    width: 6,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },
  skipText: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 14,
  },
})
