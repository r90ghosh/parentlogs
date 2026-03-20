import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  ArrowLeft,
  CheckCircle2,
  SkipForward,
  Clock,
  Stethoscope,
  ShoppingBag,
  ClipboardList,
  Wallet,
  Heart,
  Sparkles,
  Lightbulb,
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useTaskById, useCompleteTask, useSnoozeTask, useSkipTask } from '@/hooks/use-tasks'
import { format } from 'date-fns'

function getCategoryIcon(category: string) {
  switch (category?.toLowerCase()) {
    case 'medical':
    case 'healthcare':
    case 'health':
      return Stethoscope
    case 'shopping':
    case 'gear':
    case 'nursery':
      return ShoppingBag
    case 'planning':
    case 'preparation':
      return ClipboardList
    case 'financial':
    case 'legal':
    case 'insurance':
      return Wallet
    case 'partner':
    case 'relationship':
      return Heart
    default:
      return Sparkles
  }
}

function getCategoryColor(category: string): string {
  switch (category?.toLowerCase()) {
    case 'medical':
    case 'healthcare':
    case 'health':
      return '#c47a8f'
    case 'shopping':
    case 'gear':
    case 'nursery':
      return '#d4a853'
    case 'financial':
    case 'legal':
    case 'insurance':
      return '#6b8f71'
    case 'partner':
    case 'relationship':
      return '#c47a8f'
    default:
      return '#5b9bd5'
  }
}

function getAssigneeLabel(assignee: string): string {
  switch (assignee) {
    case 'dad':
      return 'Dad'
    case 'mom':
      return 'Mom'
    case 'both':
      return 'Both parents'
    case 'either':
      return 'Either parent'
    default:
      return assignee
  }
}

function getAssigneeColor(assignee: string): string {
  switch (assignee) {
    case 'dad':
      return '#5b9bd5'
    case 'mom':
      return '#c47a8f'
    case 'both':
      return '#d4a853'
    default:
      return '#7a6f62'
  }
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: task, isLoading } = useTaskById(id)
  const completeTask = useCompleteTask()
  const snoozeTask = useSnoozeTask()
  const skipTask = useSkipTask()

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    completeTask.mutate(id, {
      onSuccess: () => router.back(),
    })
  }

  const handleSnooze = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    snoozeTask.mutate(id, {
      onSuccess: () => router.back(),
    })
  }

  const handleSkip = () => {
    Alert.alert('Skip Task', 'Are you sure you want to skip this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Skip',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          skipTask.mutate(id, {
            onSuccess: () => router.back(),
          })
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#12100e', '#1a1714', '#12100e']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c4703f" />
        </View>
      </View>
    )
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#12100e', '#1a1714', '#12100e']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color="#ede6dc" />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Task not found</Text>
        </View>
      </View>
    )
  }

  const CategoryIcon = getCategoryIcon(task.category)
  const categoryColor = getCategoryColor(task.category)
  const assigneeColor = getAssigneeColor(task.assigned_to)
  const isCompleted = task.status === 'completed'
  const isActionable = task.status === 'pending' || task.status === 'snoozed'

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color="#ede6dc" />
        </Pressable>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: isActionable ? insets.bottom + 120 : insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <CardEntrance delay={0}>
          <Text style={styles.title}>{task.title}</Text>
        </CardEntrance>

        {/* Meta badges */}
        <CardEntrance delay={80}>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.metaBadge,
                { backgroundColor: categoryColor + '18' },
              ]}
            >
              <CategoryIcon size={14} color={categoryColor} />
              <Text style={[styles.metaBadgeText, { color: categoryColor }]}>
                {task.category}
              </Text>
            </View>
            <View
              style={[
                styles.metaBadge,
                { backgroundColor: assigneeColor + '18' },
              ]}
            >
              <Text style={[styles.metaBadgeText, { color: assigneeColor }]}>
                {getAssigneeLabel(task.assigned_to)}
              </Text>
            </View>
            {task.due_date && (
              <View style={styles.metaBadge}>
                <Clock size={12} color="#7a6f62" />
                <Text style={styles.metaBadgeTextMuted}>
                  Due {format(new Date(task.due_date), 'MMM d, yyyy')}
                </Text>
              </View>
            )}
          </View>
        </CardEntrance>

        {isCompleted && task.completed_at && (
          <CardEntrance delay={120}>
            <View style={styles.completedBanner}>
              <CheckCircle2 size={16} color="#6b8f71" />
              <Text style={styles.completedText}>
                Completed on {format(new Date(task.completed_at), 'MMM d, yyyy')}
              </Text>
            </View>
          </CardEntrance>
        )}

        {/* Description */}
        {task.description && (
          <CardEntrance delay={160}>
            <GlassCard style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionBody}>{task.description}</Text>
            </GlassCard>
          </CardEntrance>
        )}

        {/* Why it matters */}
        {task.why_it_matters && (
          <CardEntrance delay={240}>
            <GlassCard style={[styles.sectionCard, styles.whyCard]}>
              <View style={styles.whyHeader}>
                <Lightbulb size={16} color="#d4a853" />
                <Text style={styles.whyTitle}>Why It Matters</Text>
              </View>
              <Text style={styles.whyBody}>{task.why_it_matters}</Text>
            </GlassCard>
          </CardEntrance>
        )}
      </ScrollView>

      {/* Bottom action buttons */}
      {isActionable && (
        <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.secondaryActions}>
            <Pressable onPress={handleSkip} style={styles.secondaryButton}>
              <SkipForward size={18} color="#7a6f62" />
              <Text style={styles.secondaryButtonText}>Skip</Text>
            </Pressable>
            <Pressable onPress={handleSnooze} style={styles.secondaryButton}>
              <Clock size={18} color="#c4703f" />
              <Text style={[styles.secondaryButtonText, { color: '#c4703f' }]}>
                Snooze
              </Text>
            </Pressable>
          </View>
          <Pressable
            onPress={handleComplete}
            disabled={completeTask.isPending}
            style={styles.completeButton}
          >
            <LinearGradient
              colors={['#6b8f71', '#5a7d60']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.completeGradient}
            >
              {completeTask.isPending ? (
                <ActivityIndicator color="#faf6f0" />
              ) : (
                <>
                  <CheckCircle2 size={20} color="#faf6f0" />
                  <Text style={styles.completeText}>Mark Complete</Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#7a6f62',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 26,
    color: '#faf6f0',
    lineHeight: 34,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(237,230,220,0.06)',
  },
  metaBadgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  metaBadgeTextMuted: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(107,143,113,0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  completedText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#6b8f71',
  },
  sectionCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 12,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionBody: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#ede6dc',
    lineHeight: 24,
  },
  whyCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#d4a853',
  },
  whyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  whyTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#d4a853',
  },
  whyBody: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#ede6dc',
    lineHeight: 24,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(18,16,14,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.08)',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 12,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#7a6f62',
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
})
