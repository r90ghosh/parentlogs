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
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          setIsOpen(true)
        }}
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
      >
        <Text style={[styles.triggerText, !selectedOption && styles.triggerPlaceholder]}>
          {selectedOption?.label ?? placeholder}
        </Text>
        <ChevronDown size={18} color="#7a6f62" />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.handle} />
            {label && <Text style={styles.sheetTitle}>{label}</Text>}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value
                return (
                  <Pressable
                    onPress={() => handleSelect(item.value)}
                    style={[styles.option, isSelected && styles.optionSelected]}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {item.label}
                    </Text>
                    {isSelected && <Check size={18} color="#c4703f" />}
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
    color: '#ede6dc',
    marginBottom: 8,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#201c18',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  triggerPressed: {
    backgroundColor: '#282420',
  },
  triggerText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#ede6dc',
    flex: 1,
  },
  triggerPlaceholder: {
    color: '#4a4239',
  },

  // Modal
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#201c18',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '60%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.08)',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(237,230,220,0.15)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 18,
    color: '#faf6f0',
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
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  optionSelected: {
    backgroundColor: 'rgba(196,112,63,0.06)',
  },
  optionText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#ede6dc',
  },
  optionTextSelected: {
    color: '#c4703f',
    fontFamily: 'Jost-Medium',
  },
})
