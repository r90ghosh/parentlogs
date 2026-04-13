import { useState, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowLeft, Newspaper, Lock } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useArticles, type Article } from '@/hooks/use-content'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'

const STAGE_FILTERS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'trimester-1', label: 'Trimester 1' },
  { value: 'trimester-2', label: 'Trimester 2' },
  { value: 'trimester-3', label: 'Trimester 3' },
  { value: '0-3-months', label: '0\u20133 Mo' },
  { value: '3-6-months', label: '3\u20136 Mo' },
  { value: '6-12-months', label: '6\u201312 Mo' },
]

export default function ContentScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()
  const [selectedStage, setSelectedStage] = useState<string | undefined>(undefined)

  const { data: articles, isLoading } = useArticles(selectedStage)

  const isPremium =
    profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'lifetime'

  const handleArticlePress = useCallback(
    (article: Article) => {
      if (!article.is_free && !isPremium) {
        Alert.alert(
          'Premium Content',
          'This article is available to premium subscribers. Upgrade to unlock all articles.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade', onPress: () => router.push('/(screens)/upgrade') },
          ]
        )
        return
      }
      router.push({ pathname: '/(screens)/article', params: { id: article.id } })
    },
    [isPremium, router]
  )

  const renderArticle = useCallback(
    ({ item, index }: { item: Article; index: number }) => (
      <CardEntrance delay={index * 80}>
        <Pressable onPress={() => handleArticlePress(item)}>
          <GlassCard style={styles.articleCard}>
            <Text style={styles.articleTitle}>{item.title}</Text>
            {item.excerpt ? (
              <Text style={styles.articleExcerpt} numberOfLines={2}>
                {item.excerpt}
              </Text>
            ) : null}
            <View style={styles.badgeRow}>
              {item.stage ? (
                <View style={styles.stageBadge}>
                  <Text style={styles.stageBadgeText}>{item.stage}</Text>
                </View>
              ) : null}
              {item.is_free ? (
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>Free</Text>
                </View>
              ) : (
                <View style={styles.premiumBadge}>
                  <Lock size={10} color="#d4a853" />
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </View>
              )}
            </View>
          </GlassCard>
        </Pressable>
      </CardEntrance>
    ),
    [handleArticlePress]
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color="#faf6f0" />
        </Pressable>
        <Text style={styles.headerTitle}>Blog</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Stage filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
        style={styles.filterBar}
      >
        {STAGE_FILTERS.map((filter) => {
          const isActive = selectedStage === filter.value
          return (
            <Pressable
              key={filter.label}
              onPress={() => setSelectedStage(filter.value)}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
            >
              <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                {filter.label}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#c4703f" size="large" />
        </View>
      ) : !articles || articles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Newspaper size={40} color="#4a4239" />
          <Text style={styles.emptyTitle}>No articles available</Text>
          <Text style={styles.emptySubtitle}>
            Check back soon for new content
          </Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={renderArticle}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
  },

  // Filter pills
  filterBar: {
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(237,230,220,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.12)',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#c4703f',
    borderColor: '#c4703f',
  },
  filterPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#ede6dc',
    lineHeight: 18,
  },
  filterPillTextActive: {
    color: '#faf6f0',
  },

  // List
  listContent: {
    paddingHorizontal: 20,
  },

  // Article card
  articleCard: {
    padding: 16,
    marginBottom: 12,
  },
  articleTitle: {
    fontFamily: 'Karla-Medium',
    fontSize: 16,
    color: '#ede6dc',
  },
  articleExcerpt: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  stageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(237,230,220,0.06)',
  },
  stageBadgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 10,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  freeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(107,143,113,0.15)',
  },
  freeBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    color: '#6b8f71',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(212,168,83,0.12)',
  },
  premiumBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    color: '#d4a853',
  },

  // Loading / Empty
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
  },
})
