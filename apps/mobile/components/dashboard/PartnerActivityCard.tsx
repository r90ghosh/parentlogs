import { View, Text, StyleSheet } from 'react-native'
import { CheckCircle2, Clock } from 'lucide-react-native'
import { formatDistanceToNow } from 'date-fns'
import { GlassCard } from '@/components/glass'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
import { useAuth } from '@/components/providers/AuthProvider'

type RecentTask = {
  title: string
  status: string
  completedAt: string | null
}

interface PartnerActivityCardProps {
  data: {
    name: string
    initial: string
    updatedAt: string | null
    recentTasks: RecentTask[]
  }
}

function getAvatarColor(role: string | undefined, colors: ColorTokens): string {
  if (role === 'mom') return colors.rose
  if (role === 'dad') return colors.sky
  return colors.textMuted
}

function formatLastActive(updatedAt: string | null): string {
  if (!updatedAt) return 'Not active yet'
  try {
    return formatDistanceToNow(new Date(updatedAt), { addSuffix: true })
  } catch {
    return 'Not active yet'
  }
}

export function PartnerActivityCard({ data }: PartnerActivityCardProps) {
  const colors = useColors()
  const { profile } = useAuth()

  // Partner role is the opposite of the current user
  const partnerRole = profile?.role === 'dad' ? 'mom' : profile?.role === 'mom' ? 'dad' : undefined
  const avatarColor = getAvatarColor(partnerRole, colors)

  return (
    <GlassCard style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor + '22', borderColor: avatarColor + '44' }]}>
          <Text style={[styles.avatarInitial, { color: avatarColor }]}>{data.initial}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{data.name}</Text>
          <Text style={[styles.lastActive, { color: colors.textMuted }]}>{formatLastActive(data.updatedAt)}</Text>
        </View>
      </View>

      {/* Recent tasks */}
      {data.recentTasks.length > 0 && (
        <View style={[styles.taskList, { borderTopColor: colors.subtleBg }]}>
          {data.recentTasks.map((task, index) => {
            const isCompleted = task.status === 'completed'
            return (
              <View key={index} style={styles.taskRow}>
                {isCompleted ? (
                  <CheckCircle2 size={15} color={colors.sage} />
                ) : (
                  <Clock size={15} color={colors.copper} />
                )}
                <Text
                  style={[
                    styles.taskTitle,
                    { color: colors.textSecondary },
                    isCompleted && { color: colors.textMuted, textDecorationLine: 'line-through' as const },
                  ]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
              </View>
            )
          })}
        </View>
      )}

      {data.recentTasks.length === 0 && (
        <Text style={[styles.noActivity, { color: colors.textDim, borderTopColor: colors.subtleBg }]}>No recent task activity</Text>
      )}
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
  },
  lastActive: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  taskList: {
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskTitle: {
    flex: 1,
    fontFamily: 'Jost-Regular',
    fontSize: 13,
  },
  noActivity: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    paddingTop: 4,
    borderTopWidth: 1,
  },
})
