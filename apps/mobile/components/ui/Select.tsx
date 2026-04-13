import { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  type ViewStyle,
} from 'react-native'
import { ChevronDown, Check } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColors } from '@/hooks/use-colors'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  style?: ViewStyle
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  style,
}: SelectProps) {
  const colors = useColors()
  const [isOpen, setIsOpen] = useState(false)
  const insets = useSafeAreaInsets()

  const selectedOption = options.find((o) => o.value === value)

  const handleSelect = (optionValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <View style={style}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          setIsOpen(true)
        }}
        style={({ pressed }) => [
          styles.trigger,
          { backgroundColor: colors.card, borderColor: colors.border },
          pressed && { backgroundColor: colors.cardHover },
        ]}
      >
        <Text style={[styles.triggerText, { color: colors.textSecondary }, !selectedOption && { color: colors.textDim }]}>
          {selectedOption?.label ?? placeholder}
        </Text>
        <ChevronDown size={18} color={colors.textMuted} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={() => setIsOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.handle, { backgroundColor: colors.borderHover }]} />
            {label && <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>{label}</Text>}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value
                return (
                  <Pressable
                    onPress={() => handleSelect(item.value)}
                    style={[styles.option, { borderBottomColor: colors.subtleBg }, isSelected && { backgroundColor: colors.copperDim }]}
                  >
                    <Text style={[styles.optionText, { color: colors.textSecondary }, isSelected && { color: colors.copper, fontFamily: 'Jost-Medium' }]}>
                      {item.label}
                    </Text>
                    {isSelected && <Check size={18} color={colors.copper} />}
                  </Pressable>
                )
              }}
              style={styles.optionList}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  triggerText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    flex: 1,
  },

  // Modal
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '60%',
    borderTopWidth: 1,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  optionList: {
    flexGrow: 0,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  optionText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
  },
})
