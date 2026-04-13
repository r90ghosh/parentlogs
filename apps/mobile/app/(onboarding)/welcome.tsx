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
        <View style={[styles.iconCircle, { backgroundColor: `${item.color}26` }]}>
          <Icon size={36} color={item.color} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.textMuted }]}>{item.description}</Text>
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
                  ? [styles.activeDot, { backgroundColor: colors.copper }]
                  : [styles.inactiveDot, { backgroundColor: colors.textDim }],
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={isLastSlide ? goToRole : goToNext}
          style={({ pressed }) => [styles.button, { backgroundColor: colors.copper }, pressed && { opacity: 0.85 }]}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
        </Pressable>

        {!isLastSlide && (
          <Pressable onPress={goToRole}>
            <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
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
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 32,
  },
  description: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
    marginTop: 16,
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
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 20,
  },
  inactiveDot: {
    width: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  skipText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
})
