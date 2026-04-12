import { Modal, View, Text, Pressable, StyleSheet, type ViewStyle } from 'react-native'
import { X } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'

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
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={[styles.dialog, style]} onPress={(e) => e.stopPropagation()}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <X size={18} color="#7a6f62" />
          </Pressable>

          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
          {children && <View style={styles.content}>{children}</View>}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    backgroundColor: '#201c18',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  title: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 18,
    color: '#faf6f0',
    paddingRight: 36,
  },
  description: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    marginTop: 8,
    lineHeight: 20,
  },
  content: {
    marginTop: 20,
  },
})
