import { View, Text, Pressable, Platform, StyleSheet, type ViewStyle } from 'react-native'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ChevronLeft, X } from 'lucide-react-native'
import { useColors } from '@/hooks/use-colors'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  leftAction?: 'back' | 'close' | React.ReactNode
  rightAction?: React.ReactNode
  onLeftPress?: () => void
  transparent?: boolean
  style?: ViewStyle
}

export function ScreenHeader({
  title,
  subtitle,
  leftAction = 'back',
  rightAction,
  onLeftPress,
  transparent = false,
  style,
}: ScreenHeaderProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const colors = useColors()

  const handleLeftPress = onLeftPress ?? (() => router.back())

  function renderLeftAction() {
    if (leftAction === 'back') {
      return (
        <Pressable
          onPress={handleLeftPress}
          style={[styles.actionCircle, { backgroundColor: colors.border }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeft size={20} color={colors.textSecondary} />
        </Pressable>
      )
    }
    if (leftAction === 'close') {
      return (
        <Pressable
          onPress={handleLeftPress}
          style={[styles.actionCircle, { backgroundColor: colors.border }]}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <X size={20} color={colors.textSecondary} />
        </Pressable>
      )
    }
    return <View style={styles.actionSlot}>{leftAction}</View>
  }

  const content = (
    <>
      <View style={styles.leftSlot}>{renderLeftAction()}</View>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.rightSlot}>
        {rightAction ?? <View style={styles.spacer} />}
      </View>
    </>
  )

  const containerStyle = [
    styles.container,
    { paddingTop: insets.top + 12, borderBottomColor: colors.subtleBg },
    style,
  ]

  if (Platform.OS === 'ios' && !transparent) {
    return (
      <BlurView
        tint={colors.blurTint}
        intensity={colors.headerBlurIntensity}
        style={containerStyle}
      >
        {content}
      </BlurView>
    )
  }

  return (
    <View
      style={[
        containerStyle,
        !transparent && { backgroundColor: colors.surface },
      ]}
    >
      {content}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  leftSlot: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightSlot: {
    width: 40,
    alignItems: 'flex-end',
  },
  actionSlot: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  spacer: {
    width: 40,
    height: 40,
  },
})
