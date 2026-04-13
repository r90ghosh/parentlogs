import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ShieldCheck } from 'lucide-react-native'
import { useArticle } from '@/hooks/use-content'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { CardEntrance } from '@/components/animations'
import { ScreenHeader } from '@/components/ui'
import { GlassCard } from '@/components/glass'

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()
  const colors = useColors()
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
        <ScreenHeader title="Article" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.copper} size="large" />
        </View>
      </View>
    )
  }

  if (error || !article) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Article" />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>Article not found</Text>
          <Text style={[styles.errorSubtitle, { color: colors.textMuted }]}>
            This article may have been removed or is unavailable.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Article" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <CardEntrance delay={0}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>{article.title}</Text>

          {/* Reviewed badge */}
          {article.reviewed_by ? (
            <View style={[styles.reviewedBadge, { backgroundColor: colors.sageDim }]}>
              <ShieldCheck size={14} color={colors.sage} />
              <Text style={[styles.reviewedText, { color: colors.sage }]}>Reviewed by {article.reviewed_by}</Text>
            </View>
          ) : null}

          {/* Published date */}
          {article.published_at ? (
            <Text style={[styles.publishedDate, { color: colors.textMuted }]}>{formatDate(article.published_at)}</Text>
          ) : null}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Content body or paywall */}
          {isLocked ? (
            <GlassCard style={styles.paywallContainer}>
              <Text style={[styles.paywallTitle, { color: colors.gold }]}>Premium Content</Text>
              <Text style={[styles.paywallText, { color: colors.textMuted }]}>
                This article is available to premium subscribers. Upgrade to unlock the full library of expert-reviewed articles.
              </Text>
              <Pressable
                onPress={() => router.push('/(screens)/upgrade')}
                style={[styles.upgradeButton, { backgroundColor: colors.copper }]}
              >
                <Text style={[styles.upgradeButtonText, { color: colors.textPrimary }]}>Upgrade Now</Text>
              </Pressable>
            </GlassCard>
          ) : (
            <>
              {article.content.split('\n').map((paragraph, idx) =>
                paragraph.trim() ? (
                  <Text key={idx} style={[styles.bodyText, { color: colors.textSecondary }]}>
                    {paragraph}
                  </Text>
                ) : (
                  <View key={idx} style={styles.paragraphSpacer} />
                )
              )}

              {/* Sources */}
              {article.sources ? (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <Text style={[styles.sourcesHeader, { color: colors.textPrimary }]}>Sources</Text>
                  <Text style={[styles.sourcesText, { color: colors.textMuted }]}>{article.sources}</Text>
                </>
              ) : null}

              {/* Medical Disclaimer */}
              <Text style={[styles.medicalDisclaimer, { color: colors.textDim }]}>
                This article is for informational purposes only and does not constitute medical advice. Always consult your healthcare provider for medical decisions.
              </Text>
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
    backgroundColor: 'transparent',
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
    lineHeight: 32,
  },

  // Reviewed badge
  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  reviewedText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
  },

  // Published date
  publishedDate: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 8,
  },

  // Divider
  divider: {
    height: 1,
    marginVertical: 20,
  },

  // Body content
  bodyText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
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
    marginBottom: 8,
  },
  sourcesText: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    lineHeight: 20,
  },

  // Medical disclaimer
  medicalDisclaimer: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    lineHeight: 16,
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
    marginBottom: 12,
  },
  paywallText: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  upgradeButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
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
    textAlign: 'center',
  },
  errorSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
})
