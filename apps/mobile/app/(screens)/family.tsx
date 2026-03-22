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
import { LinearGradient } from 'expo-linear-gradient'
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Family</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color="#7a6f62" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Family Details */}
        <CardEntrance delay={0}>
          <Text style={styles.sectionTitle}>Family Details</Text>
          <GlassCard style={styles.section}>
            <View style={styles.inputRow}>
              <View style={styles.inputLabelRow}>
                <Baby size={18} color="#c47a8f" />
                <Text style={styles.inputLabel}>Baby Name</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={babyName}
                onChangeText={setBabyName}
                placeholder="Baby's name or nickname"
                placeholderTextColor="#4a4239"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailRowLeft}>
                <Calendar size={18} color="#5b9bd5" />
                <Text style={styles.detailLabel}>Due Date</Text>
              </View>
              <Text style={styles.detailValue}>
                {formatDate(familyData?.due_date ?? family?.due_date)}
              </Text>
            </View>

            <View style={[styles.detailRow, styles.lastRow]}>
              <View style={styles.detailRowLeft}>
                <Calendar size={18} color="#6b8f71" />
                <Text style={styles.detailLabel}>Birth Date</Text>
              </View>
              <Text style={styles.detailValue}>
                {formatDate(familyData?.birth_date)}
              </Text>
            </View>

            <View style={styles.dateHintContainer}>
              <Text style={styles.dateHint}>
                Edit dates in the web app at thedadcenter.com
              </Text>
            </View>

            {isDirty && (
              <Pressable
                onPress={handleSaveBabyName}
                disabled={updateFamily.isPending}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.saveButtonPressed,
                  updateFamily.isPending && styles.saveButtonDisabled,
                ]}
              >
                {updateFamily.isPending ? (
                  <ActivityIndicator color="#faf6f0" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </Pressable>
            )}
          </GlassCard>
        </CardEntrance>

        {/* Section 2: Members */}
        <CardEntrance delay={80}>
          <Text style={styles.sectionTitle}>Members</Text>
          <GlassCard style={styles.section}>
            {membersLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#c4703f" size="small" />
              </View>
            ) : members && members.length > 0 ? (
              members.map((member, index) => (
                <View
                  key={member.id}
                  style={[
                    styles.memberRow,
                    index === members.length - 1 && styles.lastRow,
                  ]}
                >
                  <View style={styles.memberLeft}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {(member.full_name || member.email || '?')
                          .charAt(0)
                          .toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.memberName}>
                        {member.full_name || 'Unknown'}
                      </Text>
                      <Text style={styles.memberRole}>
                        {member.role
                          ? member.role.charAt(0).toUpperCase() +
                            member.role.slice(1)
                          : 'Member'}
                      </Text>
                    </View>
                  </View>
                  {member.is_owner && (
                    <Crown size={16} color="#d4a853" />
                  )}
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No members found</Text>
              </View>
            )}
          </GlassCard>
        </CardEntrance>

        {/* Section 3: Invite Code */}
        <CardEntrance delay={160}>
          <Text style={styles.sectionTitle}>Invite Code</Text>
          <GlassCard style={styles.section}>
            <View style={styles.inviteCodeContainer}>
              <Text style={styles.inviteCodeValue}>
                {family?.invite_code || '------'}
              </Text>

              <View style={styles.inviteActions}>
                <Pressable
                  onPress={handleCopyInviteCode}
                  style={styles.inviteActionButton}
                >
                  <Copy size={18} color="#6b8f71" />
                  <Text style={styles.inviteActionLabel}>Copy</Text>
                </Pressable>
                <Pressable
                  onPress={handleShareInviteCode}
                  style={styles.inviteActionButton}
                >
                  <Share2 size={18} color="#6b8f71" />
                  <Text style={styles.inviteActionLabel}>Share</Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleRegenerateCode}
              disabled={regenerateInviteCode.isPending}
              style={({ pressed }) => [
                styles.regenerateButton,
                pressed && styles.regenerateButtonPressed,
              ]}
            >
              {regenerateInviteCode.isPending ? (
                <ActivityIndicator color="#7a6f62" size="small" />
              ) : (
                <>
                  <RefreshCw size={14} color="#7a6f62" />
                  <Text style={styles.regenerateText}>Regenerate Code</Text>
                </>
              )}
            </Pressable>
          </GlassCard>
        </CardEntrance>

        {/* Section 4: Leave Family */}
        <CardEntrance delay={240}>
          <Text style={styles.dangerSectionTitle}>Danger Zone</Text>
          <GlassCard style={styles.dangerSection}>
            <Pressable
              onPress={handleLeaveFamily}
              style={({ pressed }) => [
                styles.leaveButton,
                pressed && styles.leaveButtonPressed,
              ]}
            >
              <LogOut size={18} color="#d4836b" />
              <Text style={styles.leaveButtonText}>Leave Family</Text>
            </Pressable>
            <Text style={styles.leaveDescription}>
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
    backgroundColor: '#12100e',
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
    color: '#faf6f0',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
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
    color: '#7a6f62',
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
    borderBottomColor: 'rgba(237,230,220,0.06)',
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
    color: '#ede6dc',
  },
  textInput: {
    backgroundColor: '#201c18',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#ede6dc',
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
    color: '#ede6dc',
  },
  detailValue: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    color: '#7a6f62',
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
    color: '#4a4239',
  },

  saveButton: {
    backgroundColor: '#c4703f',
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
    color: '#faf6f0',
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
    borderBottomColor: 'rgba(237,230,220,0.06)',
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
    backgroundColor: 'rgba(196,112,63,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#c4703f',
  },
  memberName: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
    color: '#ede6dc',
  },
  memberRole: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    color: '#4a4239',
  },

  // Invite Code
  inviteCodeContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  inviteCodeValue: {
    fontFamily: 'Jost-Medium',
    fontSize: 24,
    color: '#6b8f71',
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
    backgroundColor: 'rgba(107,143,113,0.12)',
  },
  inviteActionLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#6b8f71',
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  regenerateButtonPressed: {
    backgroundColor: 'rgba(237,230,220,0.04)',
  },
  regenerateText: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
  },

  // Leave Family
  dangerSectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#d4836b',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },
  dangerSection: {
    overflow: 'hidden',
    marginBottom: 24,
    padding: 0,
    borderColor: 'rgba(212,131,107,0.15)',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(212,131,107,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212,131,107,0.2)',
    borderRadius: 0,
  },
  leaveButtonPressed: {
    backgroundColor: 'rgba(212,131,107,0.18)',
  },
  leaveButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#d4836b',
  },
  leaveDescription: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#4a4239',
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
})
