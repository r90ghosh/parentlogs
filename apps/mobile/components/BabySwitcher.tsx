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
                isActive && styles.babyRowActive,
                pressed && styles.babyRowPressed,
              ]}
            >
              <View style={[styles.rowIconCircle, isActive && styles.rowIconCircleActive]}>
                <Baby size={16} color={isActive ? '#c4703f' : '#7a6f62'} />
              </View>
              <View style={styles.rowTextContainer}>
                <Text style={[styles.rowName, isActive && styles.rowNameActive]}>
                  {baby.baby_name || `Baby ${baby.sort_order + 1}`}
                </Text>
                <Text style={styles.rowMeta}>
                  {getStageBadge(baby)} · {getWeekLabel(baby)}
                </Text>
              </View>
              {isActive && <Check size={16} color="#c4703f" />}
            </Pressable>
          )
        })}

        <Pressable
          onPress={handleAddBaby}
          style={({ pressed }) => [
            styles.addBabyRow,
            pressed && styles.babyRowPressed,
          ]}
        >
          <View style={styles.addIconCircle}>
            <Plus size={16} color="#7a6f62" />
          </View>
          <Text style={styles.addBabyText}>Add baby</Text>
        </Pressable>
      </>
    )
  }

  // Single baby — compact display
  if (!isMultiBaby) {
    return (
      <View style={styles.singleContainer}>
        <View style={styles.iconCircle}>
          <Baby size={14} color="#c4703f" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.babyName} numberOfLines={1}>
            {activeBaby.baby_name || 'Baby'}
          </Text>
          <Text style={styles.babyMeta}>
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
          pressed && styles.multiContainerPressed,
        ]}
      >
        <View style={styles.iconCircle}>
          <Baby size={14} color="#c4703f" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.babyName} numberOfLines={1}>
            {activeBaby.baby_name || 'Baby'}
          </Text>
          <Text style={styles.babyMeta}>
            {getStageBadge(activeBaby)} · {getWeekLabel(activeBaby)}
          </Text>
        </View>
        <ChevronDown size={14} color="#7a6f62" />
      </Pressable>

      <Modal
        visible={sheetOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSheetOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSheetOpen(false)} />
          {Platform.OS === 'ios' ? (
            <BlurView tint="dark" intensity={40} style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetContent}>
                <Text style={styles.sheetTitle}>Switch Baby</Text>
                {renderBabyList()}
              </View>
            </BlurView>
          ) : (
            <View style={[styles.sheet, styles.sheetAndroid]}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetContent}>
                <Text style={styles.sheetTitle}>Switch Baby</Text>
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
  // Shared container style for both single and multi baby
  singleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(196,112,63,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(196,112,63,0.15)',
  },
  // Same as singleContainer but tappable
  multiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(196,112,63,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(196,112,63,0.15)',
  },
  multiContainerPressed: {
    backgroundColor: 'rgba(196,112,63,0.15)',
  },

  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(196,112,63,0.15)',
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
    color: '#faf6f0',
  },
  babyMeta: {
    fontFamily: 'Karla-Regular',
    fontSize: 10,
    color: '#7a6f62',
    marginTop: 1,
  },

  // Modal overlay
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(237,230,220,0.08)',
    paddingBottom: 34,
  },
  sheetAndroid: {
    backgroundColor: 'rgba(32,28,24,0.97)',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(237,230,220,0.15)',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },

  // Bottom sheet content
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sheetTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },

  // Baby row in sheet
  babyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  babyRowActive: {
    backgroundColor: 'rgba(196,112,63,0.1)',
  },
  babyRowPressed: {
    backgroundColor: 'rgba(237,230,220,0.04)',
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconCircleActive: {
    backgroundColor: 'rgba(196,112,63,0.15)',
  },
  rowTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
    color: '#ede6dc',
  },
  rowNameActive: {
    color: '#c4703f',
    fontFamily: 'Karla-SemiBold',
  },
  rowMeta: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },

  // Add baby row
  addBabyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.06)',
  },
  addIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBabyText: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
    color: '#ede6dc',
  },
})
