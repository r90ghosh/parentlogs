import { useEffect, useRef, useState } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type ToastState = { message: string; type: 'info' | 'success' | 'error' }
let showToastFn: ((toast: ToastState) => void) | null = null

export function showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
  showToastFn?.({ message, type })
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets()
  const [toast, setToast] = useState<ToastState | null>(null)
  const translateY = useRef(new Animated.Value(-100)).current

  useEffect(() => {
    showToastFn = (t) => {
      setToast(t)
      Animated.sequence([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }),
        Animated.delay(2500),
        Animated.timing(translateY, { toValue: -100, duration: 200, useNativeDriver: true }),
      ]).start(() => setToast(null))
    }
    return () => {
      showToastFn = null
    }
  }, [translateY])

  if (!toast) return <>{children}</>

  const bgColor =
    toast.type === 'success'
      ? 'rgba(107,143,113,0.9)'
      : toast.type === 'error'
        ? 'rgba(212,131,107,0.9)'
        : 'rgba(32,28,24,0.95)'

  return (
    <>
      {children}
      <Animated.View
        style={[
          styles.toast,
          { top: insets.top + 8, backgroundColor: bgColor, transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.toastText}>{toast.message}</Text>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.15)',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#faf6f0',
    textAlign: 'center',
  },
})
