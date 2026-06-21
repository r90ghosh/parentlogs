import { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  X,
  Baby,
  Calendar,
  Copy,
  Share2,
  RefreshCw,
  LogOut,
  Crown,
} from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import {
  useFamilyMembers,
  useUpdateFamily,
  useRegenerateInviteCode,
} from '@/hooks/use-family'
import { familyService } from '@/lib/services'
import { useColors } from '@/hooks/use-colors'
import { SectionLabel } from '@/components/digest'
import * as Haptics from 'expo-haptics'

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Not set'
  try {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'Not set'
  }
}

export default function FamilyScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { family, profile, user, refreshProfile } = useAuth()
  const { data: members, isLoading: membersLoading } = useFamilyMembers()
  const updateFamily = useUpdateFamily()
  const regenerateInviteCode = useRegenerateInviteCode()
  const colors = useColors()

  const [babyName, setBabyName] = useState('')
  const [originalBabyName, setOriginalBabyName] = useState('')
  const [familyData, setFamilyData] = useState<{
    due_date?: string | null
    birth_date?: string | null
    baby_name?: string | null
  } | null>(null)

  useEffect(() => {
    async function loadFamily() {
      const data = await familyService.getFamily()
      if (data) {
        setFamilyData(data)
        setBabyName(data.baby_name || '')
        setOriginalBabyName(data.baby_name || '')
      }
    }
    loadFamily()
  }, [])

  const isDirty = babyName !== originalBabyName

  function handleSaveBabyName() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    updateFamily.mutate(
      { baby_name: babyName.trim() },
      {
        onSuccess: () => {
          setOriginalBabyName(babyName.trim())
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        },
        onError: () => {
          Alert.alert('Error', 'Failed to update baby name. Please try again.')
        },
      }
    )
  }

  function handleCopyInviteCode() {
    if (!family?.invite_code) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    Share.share({ message: family.invite_code }).catch(() => {})
  }

  function handleShareInviteCode() {
    if (!family?.invite_code) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    Share.share({
      message: `Join me on The Dad Center! Use invite code: ${family.invite_code}\n\nDownload at thedadcenter.com`,
    }).catch(() => {})
  }

  function handleRegenerateCode() {
    Alert.alert(
      'Regenerate Invite Code',
      'This will invalidate the current code. Anyone who has the old code will no longer be able to join.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            regenerateInviteCode.mutate(undefined, {
              onSuccess: () => {
                refreshProfile()
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                )
              },
              onError: () => {
                Alert.alert(
                  'Error',
                  'Failed to regenerate invite code. Please try again.'
                )
              },
            })
          },
        },
      ]
    )
  }

  function handleLeaveFamily() {
    Alert.alert(
      'Leave Family',
      'Are you sure you want to leave this family? You will lose access to all shared data.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
            const { error } = await familyService.leaveFamily()
            if (error) {
              Alert.alert('Error', 'Failed to leave family. Please try again.')
              return
            }
            await refreshProfile()
            router.replace('/(onboarding)/role')
          },
        },
      ]
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={[styles.headerTitle, { color: colors.ink }]}>Family</Text>
          <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.accentSoft }]}>
            <X size={20} color={colors.muted} />
          </Pressable>
        </View>

        {/* Section 1: Family Details */}
        <SectionLabel>Family Details</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <View style={[styles.inputRow, { borderBottomColor: colors.line2 }]}>
            <View style={styles.inputLabelRow}>
              <Baby size={18} color={colors.rose} />
              <Text style={[styles.inputLabel, { color: colors.ink2 }]}>Baby Name</Text>
            </View>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
              value={babyName}
              onChangeText={setBabyName}
              placeholder="Baby's name or nickname"
              placeholderTextColor={colors.faint}
              autoCapitalize="words"
            />
          </View>

          <View style={[styles.detailRow, { borderBottomColor: colors.line2 }]}>
            <View style={styles.detailRowLeft}>
              <Calendar size={18} color={colors.sky} />
              <Text style={[styles.detailLabel, { color: colors.ink2 }]}>Due Date</Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.muted }]}>
              {formatDate(familyData?.due_date ?? family?.due_date)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailRowLeft}>
              <Calendar size={18} color={colors.sage} />
              <Text style={[styles.detailLabel, { color: colors.ink2 }]}>Birth Date</Text>
            </View>
            <Text style={[styles.detailValue, { color: colors.muted }]}>
              {formatDate(familyData?.birth_date)}
            </Text>
          </View>

          <View style={styles.dateHintContainer}>
            <Text style={[styles.dateHint, { color: colors.faint }]}>
              Edit dates in the web app at thedadcenter.com
            </Text>
          </View>

          {isDirty && (
            <Pressable
              onPress={handleSaveBabyName}
              disabled={updateFamily.isPending}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: colors.accent },
                pressed && styles.saveButtonPressed,
                updateFamily.isPending && styles.saveButtonDisabled,
              ]}
            >
              {updateFamily.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </Pressable>
          )}
        </View>

        {/* Section 2: Members */}
        <SectionLabel>Members</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
          {membersLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.accent} size="small" />
            </View>
          ) : members && members.length > 0 ? (
            members.map((member, index) => (
              <View
                key={member.id}
                style={[
                  styles.memberRow,
                  index < members.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.line2 },
                ]}
              >
                <View style={styles.memberLeft}>
                  <View style={[styles.avatar, { backgroundColor: colors.accentSoft }]}>
                    <Text style={[styles.avatarText, { color: colors.accentInk }]}>
                      {(member.full_name || member.email || '?')
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.memberName, { color: colors.ink2 }]}>
                      {member.full_name || 'Unknown'}
                    </Text>
                    <Text style={[styles.memberRole, { color: colors.muted }]}>
                      {member.role
                        ? member.role.charAt(0).toUpperCase() +
                          member.role.slice(1)
                        : 'Member'}
                    </Text>
                  </View>
                </View>
                {member.is_owner && (
                  <Crown size={16} color={colors.gold} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.faint }]}>No members found</Text>
            </View>
          )}
        </View>

        {/* Section 3: Invite Code */}
        <SectionLabel>Invite Code</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <View style={[styles.inviteCodeContainer, { borderBottomColor: colors.line2 }]}>
            <Text style={[styles.inviteCodeValue, { color: colors.sage }]}>
              {family?.invite_code || '------'}
            </Text>

            <View style={styles.inviteActions}>
              <Pressable
                onPress={handleCopyInviteCode}
                style={[styles.inviteActionButton, { backgroundColor: colors.accentSoft }]}
              >
                <Copy size={18} color={colors.sage} />
                <Text style={[styles.inviteActionLabel, { color: colors.sage }]}>Copy</Text>
              </Pressable>
              <Pressable
                onPress={handleShareInviteCode}
                style={[styles.inviteActionButton, { backgroundColor: colors.accentSoft }]}
              >
                <Share2 size={18} color={colors.sage} />
                <Text style={[styles.inviteActionLabel, { color: colors.sage }]}>Share</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleRegenerateCode}
            disabled={regenerateInviteCode.isPending}
            style={({ pressed }) => [
              styles.regenerateButton,
              pressed && { backgroundColor: colors.cardHover },
            ]}
          >
            {regenerateInviteCode.isPending ? (
              <ActivityIndicator color={colors.muted} size="small" />
            ) : (
              <>
                <RefreshCw size={14} color={colors.muted} />
                <Text style={[styles.regenerateText, { color: colors.muted }]}>Regenerate Code</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Section 4: Leave Family */}
        <SectionLabel>Danger Zone</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.coral }]}>
          <Pressable
            onPress={handleLeaveFamily}
            style={({ pressed }) => [
              styles.leaveButton,
              { backgroundColor: pressed ? colors.cardHover : 'transparent' },
            ]}
          >
            <LogOut size={18} color={colors.coral} />
            <Text style={[styles.leaveButtonText, { color: colors.coral }]}>Leave Family</Text>
          </Pressable>
          <Text style={[styles.leaveDescription, { color: colors.faint }]}>
            This will remove you from this family. You will need a new invite
            code to rejoin.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Card
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 4,
  },

  // Family Details
  inputRow: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15.5,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Jakarta-Medium',
    fontSize: 15,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  detailLabel: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15.5,
  },
  detailValue: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
  },

  dateHintContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  dateHint: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
  },

  saveButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },

  // Members
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 16,
  },
  memberName: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15,
  },
  memberRole: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
  },

  // Invite Code
  inviteCodeContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  inviteCodeValue: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 24,
    letterSpacing: 3,
    marginBottom: 20,
  },
  inviteActions: {
    flexDirection: 'row',
    gap: 16,
  },
  inviteActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  inviteActionLabel: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 14,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  regenerateText: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
  },

  // Leave Family
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  leaveButtonText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15.5,
  },
  leaveDescription: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})
