import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { ClipboardPlus, BarChart3, CalendarPlus, Wallet } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useColors, type ColorTokens } from '@/hooks/use-colors'

function getActions(colors: ColorTokens) {
  return [
    {
      label: 'Add Task',
      icon: ClipboardPlus,
      route: '/(screens)/create-task' as const,
      color: colors.sage,
    },
    {
      label: 'Log Data',
      icon: BarChart3,
      route: '/(tabs)/tracker/log' as const,
      color: colors.copper,
    },
    {
      label: 'Add Event',
      icon: CalendarPlus,
      route: '/(screens)/create-task' as const,
      color: colors.sky,
    },
    {
      label: 'Budget',
      icon: Wallet,
      route: '/(screens)/budget' as const,
      color: colors.gold,
    },
  ]
}

export function QuickActionsBar() {
  const router = useRouter()
  const colors = useColors()
  const actions = getActions(colors)

  return (
    <View style={styles.container}>
      {actions.map((action) => {
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
                { backgroundColor: action.color + '18', borderColor: colors.border },
              ]}
            >
              <Icon size={20} color={action.color} />
            </View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{action.label}</Text>
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
  },
  label: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
  },
})
