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
import { useColors, type ColorTokens } from '@/hooks/use-colors'

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

function getVariantStyles(colors: ColorTokens): Record<ButtonVariant, { base: ViewStyle; pressed: ViewStyle; text: TextStyle; loaderColor: string }> {
  return {
    copper: {
      base: { backgroundColor: colors.copper },
      pressed: { backgroundColor: '#a85e34' },
      text: { color: colors.textPrimary },
      loaderColor: colors.textPrimary,
    },
    gold: {
      base: { backgroundColor: colors.gold },
      pressed: { backgroundColor: '#c09540' },
      text: { color: colors.bg },
      loaderColor: colors.bg,
    },
    destructive: {
      base: { backgroundColor: colors.coral },
      pressed: { backgroundColor: '#c0715a' },
      text: { color: colors.textPrimary },
      loaderColor: colors.textPrimary,
    },
    outline: {
      base: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.borderHover },
      pressed: { backgroundColor: colors.pressed },
      text: { color: colors.textSecondary },
      loaderColor: colors.textSecondary,
    },
    secondary: {
      base: { backgroundColor: colors.surface },
      pressed: { backgroundColor: colors.card },
      text: { color: colors.textSecondary },
      loaderColor: colors.textSecondary,
    },
    ghost: {
      base: { backgroundColor: 'transparent' },
      pressed: { backgroundColor: colors.pressed },
      text: { color: colors.textSecondary },
      loaderColor: colors.textSecondary,
    },
    link: {
      base: { backgroundColor: 'transparent' },
      pressed: { opacity: 0.7 },
      text: { color: colors.copper, textDecorationLine: 'underline' },
      loaderColor: colors.copper,
    },
  }
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
  const colors = useColors()
  const variantMap = getVariantStyles(colors)
  const v = variantMap[variant]
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
