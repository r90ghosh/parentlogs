import { View, ActivityIndicator } from 'react-native'

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#12100e', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#c4703f" />
    </View>
  )
}
