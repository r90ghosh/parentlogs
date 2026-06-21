import { useState, useCallback, useMemo } from 'react'
import { View, Text, Pressable, ScrollView, TextInput, ActivityIndicator, Alert, Linking, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Search, Lock, ArrowUpRight } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { useArticles, type Article } from '@/hooks/use-content'
import { useVideos } from '@/hooks/use-videos'
import { PhaseChips } from '@/components/digest'

const STAGE_FILTERS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'trimester-1', label: 'Trimester 1' },
  { value: 'trimester-2', label: 'Trimester 2' },
  { value: 'trimester-3', label: 'Trimester 3' },
  { value: '0-3-months', label: '0–3 Mo' },
  { value: '3-6-months', label: '3–6 Mo' },
  { value: '6-12-months', label: '6–12 Mo' },
]

function readTime(content: string | null | undefined): string {
  if (!content) return ''
  const words = content.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

export default function LibraryScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()

  const [selectedStage, setSelectedStage] = useState<string | undefined>(undefined)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: articles, isLoading } = useArticles(selectedStage)
  const { data: videos } = useVideos(selectedStage)
  const isPremium = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'lifetime'

  const filtered = useMemo(() => {
    const list = articles ?? []
    const q = search.trim().toLowerCase()
    if (!q) return list
    return list.filter((a) => a.title.toLowerCase().includes(q) || (a.excerpt?.toLowerCase().includes(q) ?? false))
  }, [articles, search])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  const openArticle = useCallback(
    (a: Article) => {
      if (!a.is_free && !isPremium) {
        Alert.alert('Premium content', 'This article is available to premium subscribers.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/(screens)/upgrade') },
        ])
        return
      }
      router.push({ pathname: '/(tabs)/more/article', params: { id: a.id } })
    },
    [isPremium, router]
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.ink }]}>Library</Text>
        <Pressable onPress={() => setSearchOpen((o) => !o)} hitSlop={8} style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <Search size={18} color={searchOpen ? colors.accent : colors.ink2} />
        </Pressable>
      </View>

      {searchOpen && (
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <Search size={16} color={colors.muted} />
          <TextInput
            style={[styles.searchInput, { color: colors.ink }]}
            placeholder="Search articles…"
            placeholderTextColor={colors.faint}
            value={search}
            onChangeText={setSearch}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        <PhaseChips
          chips={STAGE_FILTERS.map((s) => ({ key: s.value ?? 'all', label: s.label }))}
          activeKey={selectedStage ?? 'all'}
          onSelect={(k) => setSelectedStage(k === 'all' ? undefined : k)}
        />

        {isLoading ? (
          <View style={styles.loading}><ActivityIndicator color={colors.accent} /></View>
        ) : filtered.length === 0 ? (
          <Text style={[styles.empty, { color: colors.muted }]}>No articles{selectedStage ? ' for this stage' : ''} yet.</Text>
        ) : (
          <>
            {/* Featured read */}
            {featured && (
              <Pressable onPress={() => openArticle(featured)} style={({ pressed }) => [styles.featured, { borderBottomColor: colors.line, opacity: pressed ? 0.85 : 1 }]}>
                <View style={styles.metaRow}>
                  <Text style={[styles.eyebrow, { color: colors.accentInk }]}>Featured{featured.stage ? ` · ${featured.stage}` : ''}</Text>
                  {!featured.is_free && <LockBadge colors={colors} locked={!isPremium} />}
                </View>
                <Text style={[styles.featuredTitle, { color: colors.ink }]}>{featured.title}</Text>
                {!!featured.excerpt && <Text style={[styles.featuredExcerpt, { color: colors.ink2 }]} numberOfLines={3}>{featured.excerpt}</Text>}
                {!!readTime(featured.content) && <Text style={[styles.readTime, { color: colors.muted }]}>{readTime(featured.content)}</Text>}
              </Pressable>
            )}

            {/* More reads */}
            {rest.map((a) => (
              <Pressable key={a.id} onPress={() => openArticle(a)} style={({ pressed }) => [styles.card, { borderBottomColor: colors.line2, backgroundColor: pressed ? colors.cardHover : 'transparent' }]}>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardTitle, { color: colors.ink }]} numberOfLines={2}>{a.title}</Text>
                  {!!a.excerpt && <Text style={[styles.cardExcerpt, { color: colors.ink2 }]} numberOfLines={2}>{a.excerpt}</Text>}
                  <View style={styles.cardMeta}>
                    {!!readTime(a.content) && <Text style={[styles.cardMetaText, { color: colors.muted }]}>{readTime(a.content)}</Text>}
                    {!a.is_free && <LockBadge colors={colors} locked={!isPremium} />}
                  </View>
                </View>
              </Pressable>
            ))}

            {/* Watch & learn — resources shelf */}
            {videos && videos.length > 0 && (
              <View style={styles.shelf}>
                <Text style={[styles.shelfLabel, { color: colors.faint }]}>Watch &amp; learn</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfRow}>
                  {videos.map((v) => (
                    <Pressable key={v.id} onPress={() => Linking.openURL(v.url)} style={[styles.resCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                      <View style={styles.resHead}>
                        <Text style={[styles.resSource, { color: colors.accentInk }]} numberOfLines={1}>{v.source}</Text>
                        <ArrowUpRight size={14} color={colors.muted} />
                      </View>
                      <Text style={[styles.resTitle, { color: colors.ink }]} numberOfLines={3}>{v.title}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  )
}

function LockBadge({ colors, locked }: { colors: ReturnType<typeof useColors>; locked: boolean }) {
  return (
    <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
      {locked && <Lock size={9} color={colors.accentInk} />}
      <Text style={[styles.badgeText, { color: colors.accentInk }]}>Premium</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  title: { fontFamily: 'Jakarta-ExtraBold', fontSize: 26, letterSpacing: -0.6 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 42, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, marginHorizontal: 20, marginTop: 8 },
  searchInput: { flex: 1, fontFamily: 'Jakarta-Regular', fontSize: 14 },
  loading: { paddingVertical: 60, alignItems: 'center' },
  empty: { fontFamily: 'Jakarta-Medium', fontSize: 14, textAlign: 'center', paddingVertical: 48 },
  featured: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 20, borderBottomWidth: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontFamily: 'Jakarta-ExtraBold', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  featuredTitle: { fontFamily: 'Jakarta-ExtraBold', fontSize: 23, lineHeight: 29, marginTop: 10, letterSpacing: -0.4 },
  featuredExcerpt: { fontFamily: 'Jakarta-Regular', fontSize: 15, lineHeight: 22, marginTop: 9 },
  readTime: { fontFamily: 'Jakarta-Medium', fontSize: 12.5, marginTop: 12 },
  card: { paddingVertical: 16, paddingHorizontal: 22, borderBottomWidth: 1 },
  cardBody: { gap: 6 },
  cardTitle: { fontFamily: 'Jakarta-Bold', fontSize: 16.5, lineHeight: 22, letterSpacing: -0.2 },
  cardExcerpt: { fontFamily: 'Jakarta-Regular', fontSize: 14, lineHeight: 20 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  cardMetaText: { fontFamily: 'Jakarta-Medium', fontSize: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontFamily: 'Jakarta-Bold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  shelf: { paddingTop: 22 },
  shelfLabel: { fontFamily: 'Jakarta-Bold', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', paddingHorizontal: 24, paddingBottom: 12 },
  shelfRow: { gap: 12, paddingHorizontal: 20, paddingBottom: 4 },
  resCard: { width: 200, borderWidth: 1, borderRadius: 16, padding: 16 },
  resHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  resSource: { fontFamily: 'Jakarta-Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, flex: 1 },
  resTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 14.5, lineHeight: 20 },
})
