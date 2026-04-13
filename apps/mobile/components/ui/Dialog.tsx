import { Modal, View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native'
import { X } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: React.ReactNode
  style?: ViewStyle
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  style,
}: DialogProps) {
  const colors = useColors()

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onOpenChange(false)
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={handleClose}>
        <Pressable style={[styles.dialog, { backgroundColor: colors.card, borderColor: colors.border }, style]} onPress={(e) => e.stopPropagation()}>
          <Pressable onPress={handleClose} style={[styles.closeButton, { backgroundColor: colors.subtleBg }]}>
            <X size={18} color={colors.textMuted} />
          </Pressable>

          {title && <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>}
          {description && <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>}
          {children && <View style={styles.content}>{children}</View>}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 18,
    paddingRight: 36,
  },
  description: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  content: {
    marginTop: 20,
  },
})
