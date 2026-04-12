import { forwardRef } from 'react'
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
  View,
} from 'react-native'
import * as Haptics from 'expo-haptics'

type ButtonVariant = 'copper' | 'gold' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'default' | 'lg'

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  style?: ViewStyle
}

const variantStyles: Record<ButtonVariant, { base: ViewStyle; pressed: ViewStyle; text: TextStyle; loaderColor: string }> = {
  copper: {
    base: { backgroundColor: '#c4703f' },
    pressed: { backgroundColor: '#a85e34' },
    text: { color: '#faf6f0' },
    loaderColor: '#faf6f0',
  },
  gold: {
    base: { backgroundColor: '#d4a853' },
    pressed: { backgroundColor: '#c09540' },
    text: { color: '#12100e' },
    loaderColor: '#12100e',
  },
  destructive: {
    base: { backgroundColor: '#d4836b' },
    pressed: { backgroundColor: '#c0715a' },
    text: { color: '#faf6f0' },
    loaderColor: '#faf6f0',
  },
  outline: {
    base: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(237,230,220,0.15)' },
    pressed: { backgroundColor: 'rgba(255,255,255,0.03)' },
    text: { color: '#ede6dc' },
    loaderColor: '#ede6dc',
  },
  secondary: {
    base: { backgroundColor: '#1a1714' },
    pressed: { backgroundColor: '#201c18' },
    text: { color: '#ede6dc' },
    loaderColor: '#ede6dc',
  },
  ghost: {
    base: { backgroundColor: 'transparent' },
    pressed: { backgroundColor: 'rgba(255,255,255,0.05)' },
    text: { color: '#ede6dc' },
    loaderColor: '#ede6dc',
  },
  link: {
    base: { backgroundColor: 'transparent' },
    pressed: { opacity: 0.7 },
    text: { color: '#c4703f', textDecorationLine: 'underline' },
    loaderColor: '#c4703f',
  },
}

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { height: 36, paddingHorizontal: 16 },
    text: { fontSize: 13 },
  },
  default: {
    container: { height: 44, paddingHorizontal: 20 },
    text: { fontSize: 15 },
  },
  lg: {
    container: { height: 52, paddingHorizontal: 28 },
    text: { fontSize: 17 },
  },
}

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    variant = 'copper',
    size = 'default',
    loading = false,
    disabled = false,
    icon,
    children,
    onPress,
    style,
    ...rest
  },
  ref,
) {
  const v = variantStyles[variant]
  const s = sizeStyles[size]
  const isDisabled = disabled || loading

  const handlePress = (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress?.(e)
  }

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        s.container,
        v.base,
        pressed && !isDisabled && v.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={v.loaderColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, s.text, v.text]}>
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  )
})

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    marginRight: 0,
  },
  text: {
    fontFamily: 'Karla-SemiBold',
  },
  disabled: {
    opacity: 0.5,
  },
})
