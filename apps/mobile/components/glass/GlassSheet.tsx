import { BlurView } from 'expo-blur'
import { Platform, View, Pressable, StyleSheet, Dimensions } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface GlassSheetProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
}

export function GlassSheet({ visible, onClose, children }: GlassSheetProps) {
  if (!visible) return null

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      {Platform.OS === 'ios' ? (
        <BlurView tint="dark" intensity={40} style={styles.sheet}>
          <View style={styles.handle} />
          {children}
        </BlurView>
      ) : (
        <View style={[styles.sheet, styles.androidBg]}>
          <View style={styles.handle} />
          {children}
        </View>
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(237,230,220,0.08)',
    maxHeight: SCREEN_HEIGHT * 0.85,
    paddingBottom: 34,
  },
  androidBg: {
    backgroundColor: 'rgba(32,28,24,0.97)',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(237,230,220,0.15)',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
})
