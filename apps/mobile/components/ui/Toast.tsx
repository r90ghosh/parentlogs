import { useEffect, useRef, useState } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColors } from '@/hooks/use-colors'

type ToastState = { message: string; type: 'info' | 'success' | 'error' }
let showToastFn: ((toast: ToastState) => void) | null = null

export function showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
  showToastFn?.({ message, type })
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const colors = useColors()
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
      ? `${colors.sage}E6`
      : toast.type === 'error'
        ? `${colors.coral}E6`
        : colors.glassBg

  return (
    <>
      {children}
      <Animated.View
        style={[
          styles.toast,
          {
            top: insets.top + 8,
            backgroundColor: bgColor,
            borderColor: colors.borderHover,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={[styles.toastText, { color: colors.textPrimary }]}>{toast.message}</Text>
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
    textAlign: 'center',
  },
})
