import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowLeft, ShieldCheck } from 'lucide-react-native'
import { useArticle } from '@/hooks/use-content'
import { useAuth } from '@/components/providers/AuthProvider'
import { CardEntrance } from '@/components/animations'

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()
  const { data: article, isLoading, error } = useArticle(id ?? '')

  const isPremium =
    profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'lifetime'

  const isLocked = article && !article.is_free && !isPremium

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#12100e', '#1a1714', '#12100e']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color="#faf6f0" />
          </Pressable>
          <Text style={styles.headerTitle}>Article</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#c4703f" size="large" />
        </View>
      </View>
    )
  }

  if (error || !article) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#12100e', '#1a1714', '#12100e']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={20} color="#faf6f0" />
          </Pressable>
          <Text style={styles.headerTitle}>Article</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Article not found</Text>
          <Text style={styles.errorSubtitle}>
            This article may have been removed or is unavailable.
          </Text>
        </View>
      </View>
    )
  }

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
        <Text style={styles.headerTitle}>Article</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <CardEntrance delay={0}>
          {/* Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Reviewed badge */}
          {article.reviewed_by ? (
            <View style={styles.reviewedBadge}>
              <ShieldCheck size={14} color="#6b8f71" />
              <Text style={styles.reviewedText}>Reviewed by {article.reviewed_by}</Text>
            </View>
          ) : null}

          {/* Published date */}
          {article.published_at ? (
            <Text style={styles.publishedDate}>{formatDate(article.published_at)}</Text>
          ) : null}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Content body or paywall */}
          {isLocked ? (
            <View style={styles.paywallContainer}>
              <Text style={styles.paywallTitle}>Premium Content</Text>
              <Text style={styles.paywallText}>
                This article is available to premium subscribers. Upgrade to unlock the full library of expert-reviewed articles.
              </Text>
              <Pressable
                onPress={() => router.push('/(screens)/upgrade')}
                style={styles.upgradeButton}
              >
                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {article.content.split('\n').map((paragraph, idx) =>
                paragraph.trim() ? (
                  <Text key={idx} style={styles.bodyText}>
                    {paragraph}
                  </Text>
                ) : (
                  <View key={idx} style={styles.paragraphSpacer} />
                )
              )}

              {/* Sources */}
              {article.sources ? (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.sourcesHeader}>Sources</Text>
                  <Text style={styles.sourcesText}>{article.sources}</Text>
                </>
              ) : null}
            </>
          )}
        </CardEntrance>
      </ScrollView>
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

  // Scroll content
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Title
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: '#faf6f0',
    lineHeight: 32,
  },

  // Reviewed badge
  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(107,143,113,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  reviewedText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    color: '#6b8f71',
  },

  // Published date
  publishedDate: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 8,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(237,230,220,0.08)',
    marginVertical: 20,
  },

  // Body content
  bodyText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#ede6dc',
    lineHeight: 26,
    marginBottom: 12,
  },
  paragraphSpacer: {
    height: 8,
  },

  // Sources
  sourcesHeader: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#faf6f0',
    marginBottom: 8,
  },
  sourcesText: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    lineHeight: 20,
  },

  // Paywall
  paywallContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  paywallTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#d4a853',
    marginBottom: 12,
  },
  paywallText: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#c4703f',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#faf6f0',
  },

  // Loading / Error
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  errorTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
    textAlign: 'center',
  },
  errorSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
  },
})
