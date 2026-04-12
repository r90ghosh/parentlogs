import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ClipboardPlus, BarChart3, CalendarPlus, Wallet } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'

const ACTIONS = [
  {
    label: 'Add Task',
    icon: ClipboardPlus,
    route: '/(screens)/create-task' as const,
    color: '#6b8f71',
  },
  {
    label: 'Log Data',
    icon: BarChart3,
    route: '/(tabs)/tracker/log' as const,
    color: '#c4703f',
  },
  {
    label: 'Add Event',
    icon: CalendarPlus,
    route: '/(screens)/create-task' as const,
    color: '#5b9bd5',
  },
  {
    label: 'Budget',
    icon: Wallet,
    route: '/(screens)/budget' as const,
    color: '#d4a853',
  },
]

export function QuickActionsBar() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      {ACTIONS.map((action) => {
        const Icon = action.icon
        return (
          <Pressable
            key={action.label}
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              router.push(action.route)
            }}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: action.color + '18' },
              ]}
            >
              <Icon size={20} color={action.color} />
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
  },
  label: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    color: '#ede6dc',
  },
})
