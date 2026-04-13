import { Link, Stack } from 'expo-router'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useColors } from '@/hooks/use-colors'

export default function NotFoundScreen() {
  const colors = useColors()
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Page not found</Text>
        <Link href="/" asChild>
          <Pressable style={[styles.link, { backgroundColor: colors.copper }]}>
            <Text style={[styles.linkText, { color: colors.textPrimary }]}>Go home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  linkText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
})
