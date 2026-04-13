import { useState, forwardRef } from 'react'
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  type TextInputProps as RNTextInputProps,
  type ViewStyle,
} from 'react-native'
import { useColors } from '@/hooks/use-colors'

interface TextInputProps extends RNTextInputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  containerStyle?: ViewStyle
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput(
  { label, error, leftIcon, containerStyle, style, onFocus, onBlur, ...rest },
  ref,
) {
  const colors = useColors()
  const [focused, setFocused] = useState(false)

  const handleFocus: RNTextInputProps['onFocus'] = (e) => {
    setFocused(true)
    onFocus?.(e)
  }

  const handleBlur: RNTextInputProps['onBlur'] = (e) => {
    setFocused(false)
    onBlur?.(e)
  }

  const borderColor = error
    ? colors.coral
    : focused
      ? colors.copper
      : colors.border

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>}
      <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor }]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <RNTextInput
          ref={ref}
          style={[styles.input, { color: colors.textPrimary }, leftIcon ? styles.inputWithIcon : undefined, style]}
          placeholderTextColor={colors.textDim}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </View>
      {error && <Text style={[styles.error, { color: colors.coral }]}>{error}</Text>}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
  },
  leftIcon: {
    paddingLeft: 14,
  },
  input: {
    flex: 1,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    paddingHorizontal: 16,
    height: '100%',
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
  error: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
  },
})
