import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Alert, Modal, Platform } from 'react-native'
import { BlurView } from 'expo-blur'
import { Baby, ChevronDown, Check, Plus } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import type { Baby as BabyType } from '@tdc/shared/types'
import { isPregnancyStage } from '@tdc/shared/utils/pregnancy-utils'
import { useAuth } from '@/components/providers/AuthProvider'
import { useBabies, useSwitchBaby } from '@/hooks/use-babies'
import { useColors } from '@/hooks/use-colors'

function getWeekLabel(baby: BabyType): string {
  if (isPregnancyStage(baby.stage)) {
    return `Week ${baby.current_week}`
  }
  if (baby.current_week <= 12) {
    return `Week ${baby.current_week}`
  }
  const months = Math.floor(baby.current_week / 4)
  return `${months} mo`
}

function getStageBadge(baby: BabyType): string {
  if (isPregnancyStage(baby.stage)) return 'Expecting'
  return 'Born'
}

export function BabySwitcher() {
  const { profile } = useAuth()
  const { data: babies } = useBabies()
  const switchBaby = useSwitchBaby()
  const router = useRouter()
  const colors = useColors()
  const [sheetOpen, setSheetOpen] = useState(false)

  const activeBabyId = profile?.active_baby_id
  const activeBaby = babies?.find((b) => b.id === activeBabyId) ?? babies?.[0]

  if (!activeBaby || !babies?.length) return null

  const isMultiBaby = babies.length > 1

  function handleSwitch(babyId: string) {
    if (babyId !== activeBabyId) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      switchBaby.mutate(babyId, {
        onError: () => {
          Alert.alert('Error', 'Failed to switch baby. Please try again.')
        },
      })
    }
    setSheetOpen(false)
  }

  function handleAddBaby() {
    setSheetOpen(false)
    router.push('/(screens)/family')
  }

  function renderBabyList() {
    if (!babies) return null
    return (
      <>
        {babies.map((baby) => {
          const isActive = baby.id === activeBabyId
          return (
            <Pressable
              key={baby.id}
              onPress={() => handleSwitch(baby.id)}
              style={({ pressed }) => [
                styles.babyRow,
                isActive && { backgroundColor: colors.copperDim },
                pressed && { backgroundColor: colors.pressed },
              ]}
            >
              <View style={[styles.rowIconCircle, { backgroundColor: colors.subtleBg }, isActive && { backgroundColor: colors.copperDim }]}>
                <Baby size={16} color={isActive ? colors.copper : colors.textMuted} />
              </View>
              <View style={styles.rowTextContainer}>
                <Text style={[styles.rowName, { color: colors.textSecondary }, isActive && { color: colors.copper, fontFamily: 'Karla-SemiBold' }]}>
                  {baby.baby_name || `Baby ${baby.sort_order + 1}`}
                </Text>
                <Text style={[styles.rowMeta, { color: colors.textMuted }]}>
                  {getStageBadge(baby)} · {getWeekLabel(baby)}
                </Text>
              </View>
              {isActive && <Check size={16} color={colors.copper} />}
            </Pressable>
          )
        })}

        <Pressable
          onPress={handleAddBaby}
          style={({ pressed }) => [
            styles.addBabyRow,
            { borderTopColor: colors.subtleBg },
            pressed && { backgroundColor: colors.pressed },
          ]}
        >
          <View style={[styles.addIconCircle, { backgroundColor: colors.subtleBg }]}>
            <Plus size={16} color={colors.textMuted} />
          </View>
          <Text style={[styles.addBabyText, { color: colors.textSecondary }]}>Add baby</Text>
        </Pressable>
      </>
    )
  }

  const containerStyle = {
    backgroundColor: colors.copperDim,
    borderColor: colors.copperGlow,
  }

  // Single baby — compact display
  if (!isMultiBaby) {
    return (
      <View style={[styles.singleContainer, containerStyle]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.copperDim }]}>
          <Baby size={14} color={colors.copper} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.babyName, { color: colors.textPrimary }]} numberOfLines={1}>
            {activeBaby.baby_name || 'Baby'}
          </Text>
          <Text style={[styles.babyMeta, { color: colors.textMuted }]}>
            {getStageBadge(activeBaby)} · {getWeekLabel(activeBaby)}
          </Text>
        </View>
      </View>
    )
  }

  // Multi baby — tappable with sheet
  return (
    <>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          setSheetOpen(true)
        }}
        style={({ pressed }) => [
          styles.multiContainer,
          containerStyle,
          pressed && { backgroundColor: colors.copperGlow },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.copperDim }]}>
          <Baby size={14} color={colors.copper} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.babyName, { color: colors.textPrimary }]} numberOfLines={1}>
            {activeBaby.baby_name || 'Baby'}
          </Text>
          <Text style={[styles.babyMeta, { color: colors.textMuted }]}>
            {getStageBadge(activeBaby)} · {getWeekLabel(activeBaby)}
          </Text>
        </View>
        <ChevronDown size={14} color={colors.textMuted} />
      </Pressable>

      <Modal
        visible={sheetOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSheetOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={[styles.modalBackdrop, { backgroundColor: colors.overlay }]} onPress={() => setSheetOpen(false)} />
          {Platform.OS === 'ios' ? (
            <BlurView tint={colors.blurTint} intensity={40} style={[styles.sheet, { borderColor: colors.border }]}>
              <View style={[styles.sheetHandle, { backgroundColor: colors.borderHover }]} />
              <View style={styles.sheetContent}>
                <Text style={[styles.sheetTitle, { color: colors.textMuted }]}>Switch Baby</Text>
                {renderBabyList()}
              </View>
            </BlurView>
          ) : (
            <View style={[styles.sheet, { borderColor: colors.border, backgroundColor: colors.glassBg }]}>
              <View style={[styles.sheetHandle, { backgroundColor: colors.borderHover }]} />
              <View style={styles.sheetContent}>
                <Text style={[styles.sheetTitle, { color: colors.textMuted }]}>Switch Baby</Text>
                {renderBabyList()}
              </View>
            </View>
          )}
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  singleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  multiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },

  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  babyName: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
  },
  babyMeta: {
    fontFamily: 'Karla-Regular',
    fontSize: 10,
    marginTop: 1,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 34,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },

  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sheetTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },

  babyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
  rowMeta: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 2,
  },

  addBabyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
    borderTopWidth: 1,
  },
  addIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBabyText: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
})
