import { View, ActivityIndicator } from 'react-native'
import { useColors } from '@/hooks/use-colors'

export default function Index() {
  const colors = useColors()
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.copper} />
    </View>
  )
}
