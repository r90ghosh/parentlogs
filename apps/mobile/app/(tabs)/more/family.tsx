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
  Users,
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
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useColors } from '@/hooks/use-colors'
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
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Family</Text>
          <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.subtleBg }]}>
            <X size={20} color={colors.textMuted} />
          </Pressable>
        </View>
        {/* Section 1: Family Details */}
        <CardEntrance delay={0}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Family Details</Text>
          <GlassCard style={styles.section}>
            <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
              <View style={styles.inputLabelRow}>
                <Baby size={18} color={colors.rose} />
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Baby Name</Text>
              </View>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={babyName}
                onChangeText={setBabyName}
                placeholder="Baby's name or nickname"
                placeholderTextColor={colors.textDim}
                autoCapitalize="words"
              />
            </View>

            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <View style={styles.detailRowLeft}>
                <Calendar size={18} color={colors.sky} />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Due Date</Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.textMuted }]}>
                {formatDate(familyData?.due_date ?? family?.due_date)}
              </Text>
            </View>

            <View style={[styles.detailRow, styles.lastRow]}>
              <View style={styles.detailRowLeft}>
                <Calendar size={18} color={colors.sage} />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Birth Date</Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.textMuted }]}>
                {formatDate(familyData?.birth_date)}
              </Text>
            </View>

            <View style={styles.dateHintContainer}>
              <Text style={[styles.dateHint, { color: colors.textDim }]}>
                Edit dates in the web app at thedadcenter.com
              </Text>
            </View>

            {isDirty && (
              <Pressable
                onPress={handleSaveBabyName}
                disabled={updateFamily.isPending}
                style={({ pressed }) => [
                  styles.saveButton,
                  { backgroundColor: colors.copper },
                  pressed && styles.saveButtonPressed,
                  updateFamily.isPending && styles.saveButtonDisabled,
                ]}
              >
                {updateFamily.isPending ? (
                  <ActivityIndicator color={colors.textPrimary} size="small" />
                ) : (
                  <Text style={[styles.saveButtonText, { color: colors.textPrimary }]}>Save</Text>
                )}
              </Pressable>
            )}
          </GlassCard>
        </CardEntrance>

        {/* Section 2: Members */}
        <CardEntrance delay={80}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Members</Text>
          <GlassCard style={styles.section}>
            {membersLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.copper} size="small" />
              </View>
            ) : members && members.length > 0 ? (
              members.map((member, index) => (
                <View
                  key={member.id}
                  style={[
                    styles.memberRow,
                    { borderBottomColor: colors.border },
                    index === members.length - 1 && styles.lastRow,
                  ]}
                >
                  <View style={styles.memberLeft}>
                    <View style={[styles.avatar, { backgroundColor: colors.copperGlow }]}>
                      <Text style={[styles.avatarText, { color: colors.copper }]}>
                        {(member.full_name || member.email || '?')
                          .charAt(0)
                          .toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.memberName, { color: colors.textSecondary }]}>
                        {member.full_name || 'Unknown'}
                      </Text>
                      <Text style={[styles.memberRole, { color: colors.textMuted }]}>
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
                <Text style={[styles.emptyText, { color: colors.textDim }]}>No members found</Text>
              </View>
            )}
          </GlassCard>
        </CardEntrance>

        {/* Section 3: Invite Code */}
        <CardEntrance delay={160}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Invite Code</Text>
          <GlassCard style={styles.section}>
            <View style={[styles.inviteCodeContainer, { borderBottomColor: colors.border }]}>
              <Text style={[styles.inviteCodeValue, { color: colors.sage }]}>
                {family?.invite_code || '------'}
              </Text>

              <View style={styles.inviteActions}>
                <Pressable
                  onPress={handleCopyInviteCode}
                  style={[styles.inviteActionButton, { backgroundColor: colors.sageDim }]}
                >
                  <Copy size={18} color={colors.sage} />
                  <Text style={[styles.inviteActionLabel, { color: colors.sage }]}>Copy</Text>
                </Pressable>
                <Pressable
                  onPress={handleShareInviteCode}
                  style={[styles.inviteActionButton, { backgroundColor: colors.sageDim }]}
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
                pressed && { backgroundColor: colors.pressed },
              ]}
            >
              {regenerateInviteCode.isPending ? (
                <ActivityIndicator color={colors.textMuted} size="small" />
              ) : (
                <>
                  <RefreshCw size={14} color={colors.textMuted} />
                  <Text style={[styles.regenerateText, { color: colors.textMuted }]}>Regenerate Code</Text>
                </>
              )}
            </Pressable>
          </GlassCard>
        </CardEntrance>

        {/* Section 4: Leave Family */}
        <CardEntrance delay={240}>
          <Text style={[styles.dangerSectionTitle, { color: colors.coral }]}>Danger Zone</Text>
          <GlassCard style={[styles.dangerSection, { borderColor: 'rgba(212,131,107,0.15)' }]}>
            <Pressable
              onPress={handleLeaveFamily}
              style={({ pressed }) => [
                styles.leaveButton,
                { backgroundColor: colors.coralDim, borderColor: 'rgba(212,131,107,0.2)' },
                pressed && { backgroundColor: 'rgba(212,131,107,0.18)' },
              ]}
            >
              <LogOut size={18} color={colors.coral} />
              <Text style={[styles.leaveButtonText, { color: colors.coral }]}>Leave Family</Text>
            </Pressable>
            <Text style={[styles.leaveDescription, { color: colors.textDim }]}>
              This will remove you from this family. You will need a new invite
              code to rejoin.
            </Text>
          </GlassCard>
        </CardEntrance>
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
    fontFamily: 'Karla-SemiBold',
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

  // Section
  sectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },
  section: {
    overflow: 'hidden',
    marginBottom: 24,
    padding: 0,
  },

  // Family Details
  inputRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
  detailValue: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
  },
  lastRow: {
    borderBottomWidth: 0,
  },

  dateHintContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  dateHint: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
  },

  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
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
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
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
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  memberName: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
  memberRole: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Karla-Regular',
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
    fontFamily: 'Jost-Medium',
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
    fontFamily: 'Karla-Medium',
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
    fontFamily: 'Karla-Regular',
    fontSize: 13,
  },

  // Leave Family
  dangerSectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },
  dangerSection: {
    overflow: 'hidden',
    marginBottom: 24,
    padding: 0,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 0,
  },
  leaveButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
  },
  leaveDescription: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})
