import { BlurView } from 'expo-blur'
import { Platform, View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Bell } from 'lucide-react-native'

interface GlassHeaderProps {
  title?: string
  onNotificationPress?: () => void
}

export function GlassHeader({
  title = 'The Dad Center',
  onNotificationPress,
}: GlassHeaderProps) {
  const insets = useSafeAreaInsets()

  const content = (
    <View style={[styles.inner, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onNotificationPress} style={styles.iconButton}>
        <Bell size={20} color="#7a6f62" />
      </Pressable>
    </View>
  )

  if (Platform.OS === 'ios') {
    return (
      <BlurView tint="dark" intensity={60} style={styles.container}>
        {content}
      </BlurView>
    )
  }

  return <View style={[styles.container, styles.androidBg]}>{content}</View>
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.08)',
  },
  androidBg: {
    backgroundColor: 'rgba(26,23,20,0.95)',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
