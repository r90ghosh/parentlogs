import { View, Text, StyleSheet } from 'react-native'
import { CheckCircle2, Clock } from 'lucide-react-native'
import { formatDistanceToNow } from 'date-fns'
import { GlassCard } from '@/components/glass'
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

function getAvatarColor(role: string | undefined): string {
  if (role === 'mom') return '#c47a8f'
  if (role === 'dad') return '#5b9bd5'
  return '#7a6f62'
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
  const { profile } = useAuth()

  // Partner role is the opposite of the current user
  const partnerRole = profile?.role === 'dad' ? 'mom' : profile?.role === 'mom' ? 'dad' : undefined
  const avatarColor = getAvatarColor(partnerRole)

  return (
    <GlassCard style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor + '22', borderColor: avatarColor + '44' }]}>
          <Text style={[styles.avatarInitial, { color: avatarColor }]}>{data.initial}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.lastActive}>{formatLastActive(data.updatedAt)}</Text>
        </View>
      </View>

      {/* Recent tasks */}
      {data.recentTasks.length > 0 && (
        <View style={styles.taskList}>
          {data.recentTasks.map((task, index) => {
            const isCompleted = task.status === 'completed'
            return (
              <View key={index} style={styles.taskRow}>
                {isCompleted ? (
                  <CheckCircle2 size={15} color="#6b8f71" />
                ) : (
                  <Clock size={15} color="#c4703f" />
                )}
                <Text
                  style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}
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
        <Text style={styles.noActivity}>No recent task activity</Text>
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
    color: '#faf6f0',
  },
  lastActive: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },
  taskList: {
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.06)',
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
    color: '#ede6dc',
  },
  taskTitleCompleted: {
    color: '#7a6f62',
    textDecorationLine: 'line-through',
  },
  noActivity: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#4a4239',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.06)',
  },
})
