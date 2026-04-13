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
import { Newspaper, Lock } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useArticles, type Article } from '@/hooks/use-content'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { ScreenHeader } from '@/components/ui'
import { useColors } from '@/hooks/use-colors'

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
  const colors = useColors()
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
      router.push({ pathname: '/(tabs)/more/article', params: { id: article.id } })
    },
    [isPremium, router]
  )

  const renderArticle = useCallback(
    ({ item, index }: { item: Article; index: number }) => (
      <CardEntrance delay={index * 80}>
        <Pressable onPress={() => handleArticlePress(item)}>
          <GlassCard style={styles.articleCard}>
            <Text style={[styles.articleTitle, { color: colors.textSecondary }]}>{item.title}</Text>
            {item.excerpt ? (
              <Text style={[styles.articleExcerpt, { color: colors.textMuted }]} numberOfLines={2}>
                {item.excerpt}
              </Text>
            ) : null}
            <View style={styles.badgeRow}>
              {item.stage ? (
                <View style={[styles.stageBadge, { backgroundColor: colors.subtleBg }]}>
                  <Text style={[styles.stageBadgeText, { color: colors.textMuted }]}>{item.stage}</Text>
                </View>
              ) : null}
              {item.is_free ? (
                <View style={[styles.freeBadge, { backgroundColor: colors.sageDim }]}>
                  <Text style={[styles.freeBadgeText, { color: colors.sage }]}>Free</Text>
                </View>
              ) : (
                <View style={[styles.premiumBadge, { backgroundColor: colors.goldDim }]}>
                  <Lock size={10} color={colors.gold} />
                  <Text style={[styles.premiumBadgeText, { color: colors.gold }]}>Premium</Text>
                </View>
              )}
            </View>
          </GlassCard>
        </Pressable>
      </CardEntrance>
    ),
    [handleArticlePress, colors]
  )

  return (
    <View style={styles.container}>
      <ScreenHeader title="Blog" />

      {/* Stage filter pills */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {STAGE_FILTERS.map((filter) => {
            const isActive = selectedStage === filter.value
            return (
              <Pressable
                key={filter.label}
                onPress={() => setSelectedStage(filter.value)}
                style={[
                  styles.filterPill,
                  { backgroundColor: colors.subtleBg, borderColor: colors.borderHover },
                  isActive && { backgroundColor: colors.copper, borderColor: colors.copper },
                ]}
              >
                <Text style={[
                  styles.filterPillText,
                  { color: colors.textSecondary },
                  isActive && { color: colors.textPrimary },
                ]}>
                  {filter.label}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.copper} size="large" />
        </View>
      ) : !articles || articles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Newspaper size={40} color={colors.textDim} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No articles available</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
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
    backgroundColor: 'transparent',
  },

  // Filter pills
  filterBar: {
    marginBottom: 12,
    minHeight: 42,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    lineHeight: 18,
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
  },
  articleExcerpt: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
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
  },
  stageBadgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  freeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  freeBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
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
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
})
