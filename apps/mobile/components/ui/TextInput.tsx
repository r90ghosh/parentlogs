import { useState, forwardRef } from 'react'
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  type TextInputProps as RNTextInputProps,
  type ViewStyle,
} from 'react-native'

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
    ? '#d4836b'
    : focused
      ? '#c4703f'
      : 'rgba(237,230,220,0.08)'

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, { borderColor }]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <RNTextInput
          ref={ref}
          style={[styles.input, leftIcon ? styles.inputWithIcon : undefined, style]}
          placeholderTextColor="#4a4239"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
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
    color: '#7a6f62',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1714',
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
    color: '#faf6f0',
    paddingHorizontal: 16,
    height: '100%',
  },
  inputWithIcon: {
    paddingLeft: 10,
  },
  error: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#d4836b',
  },
})
