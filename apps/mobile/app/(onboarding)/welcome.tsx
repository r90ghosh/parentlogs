import { useState, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions, FlatList } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { BookOpen, CheckSquare, BarChart3 } from 'lucide-react-native'

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
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    )
  }

  const isLastSlide = currentIndex === SLIDES.length - 1

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

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
              style={[styles.dot, i === currentIndex ? styles.activeDot : styles.inactiveDot]}
            />
          ))}
        </View>

        <Pressable
          onPress={isLastSlide ? goToRole : goToNext}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.buttonText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
        </Pressable>

        {!isLastSlide && (
          <Pressable onPress={goToRole}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
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
    color: '#faf6f0',
    textAlign: 'center',
    marginTop: 32,
  },
  description: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#7a6f62',
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
    backgroundColor: '#c4703f',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#4a4239',
  },
  button: {
    backgroundColor: '#c4703f',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
  skipText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
    marginTop: 12,
  },
})
