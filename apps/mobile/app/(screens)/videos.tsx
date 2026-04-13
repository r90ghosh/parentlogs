import { useState, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Video, Play, ExternalLink } from 'lucide-react-native'
import * as WebBrowser from 'expo-web-browser'
import { useVideos, type Video as VideoType } from '@/hooks/use-videos'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { ScreenHeader } from '@/components/ui'

const STAGE_FILTERS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'first-trimester', label: '1st Tri' },
  { value: 'second-trimester', label: '2nd Tri' },
  { value: 'third-trimester', label: '3rd Tri' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'fourth-trimester', label: '4th Tri' },
  { value: '3-6-months', label: '3\u20136 Mo' },
  { value: '6-12-months', label: '6\u201312 Mo' },
]

export default function VideosScreen() {
  const insets = useSafeAreaInsets()
  const [selectedStage, setSelectedStage] = useState<string | undefined>(undefined)
  const { data: videos, isLoading } = useVideos(selectedStage)

  const handleVideoPress = useCallback(async (video: VideoType) => {
    await WebBrowser.openBrowserAsync(video.url)
  }, [])

  const renderVideo = useCallback(
    ({ item, index }: { item: VideoType; index: number }) => {
      const thumbnailUri = item.youtube_id
        ? `https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`
        : item.thumbnail

      return (
        <CardEntrance delay={index * 80}>
          <Pressable onPress={() => handleVideoPress(item)}>
            <GlassCard style={styles.videoCard}>
              {/* Thumbnail */}
              <View style={styles.thumbnailContainer}>
                {thumbnailUri ? (
                  <Image
                    source={{ uri: thumbnailUri }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.thumbnailPlaceholder}>
                    <Video size={32} color="#4a4239" />
                  </View>
                )}
                {/* Play overlay */}
                <View style={styles.playOverlay}>
                  <View style={styles.playButton}>
                    <Play size={18} color="#faf6f0" fill="#faf6f0" />
                  </View>
                </View>
                {/* Free badge */}
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>FREE</Text>
                </View>
              </View>

              {/* Content */}
              <View style={styles.videoContent}>
                {item.stage_label ? (
                  <View style={styles.stageBadge}>
                    <Text style={styles.stageBadgeText}>{item.stage_label}</Text>
                  </View>
                ) : null}
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.description ? (
                  <Text style={styles.videoDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
                <View style={styles.videoFooter}>
                  <View style={styles.sourceRow}>
                    <Video size={12} color="#7a6f62" />
                    <Text style={styles.sourceText}>{item.source}</Text>
                  </View>
                  <View style={styles.watchRow}>
                    <Text style={styles.watchText}>Watch</Text>
                    <ExternalLink size={12} color="#c4703f" />
                  </View>
                </View>
              </View>
            </GlassCard>
          </Pressable>
        </CardEntrance>
      )
    },
    [handleVideoPress]
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      <ScreenHeader title="Video Library" />

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
                style={[styles.filterPill, isActive && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
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
          <ActivityIndicator color="#c4703f" size="large" />
        </View>
      ) : !videos || videos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Video size={40} color="#4a4239" />
          <Text style={styles.emptyTitle}>No videos available</Text>
          <Text style={styles.emptySubtitle}>
            Check back soon for new video content
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={renderVideo}
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

  // Video card
  videoCard: {
    overflow: 'hidden',
    marginBottom: 16,
    padding: 0,
  },
  thumbnailContainer: {
    height: 180,
    backgroundColor: '#201c18',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1714',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(196,112,63,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  freeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#6b8f71',
  },
  freeBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    color: '#faf6f0',
    letterSpacing: 0.5,
  },
  videoContent: {
    padding: 16,
  },
  stageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(237,230,220,0.06)',
    marginBottom: 8,
  },
  stageBadgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 10,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  videoTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#ede6dc',
    marginBottom: 4,
  },
  videoDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    lineHeight: 18,
    marginBottom: 12,
  },
  videoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.06)',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceText: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
  },
  watchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  watchText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    color: '#c4703f',
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
