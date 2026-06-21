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
import { Video, Play, ArrowUpRight } from 'lucide-react-native'
import * as WebBrowser from 'expo-web-browser'
import { useVideos, type Video as VideoType } from '@/hooks/use-videos'
import { ScreenHeader } from '@/components/ui'
import { useColors } from '@/hooks/use-colors'

const STAGE_FILTERS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'first-trimester', label: '1st Tri' },
  { value: 'second-trimester', label: '2nd Tri' },
  { value: 'third-trimester', label: '3rd Tri' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'fourth-trimester', label: '4th Tri' },
  { value: '3-6-months', label: '3–6 Mo' },
  { value: '6-12-months', label: '6–12 Mo' },
]

export default function VideosScreen() {
  const insets = useSafeAreaInsets()
  const colors = useColors()
  const [selectedStage, setSelectedStage] = useState<string | undefined>(undefined)
  const { data: videos, isLoading } = useVideos(selectedStage)

  const handleVideoPress = useCallback(async (video: VideoType) => {
    await WebBrowser.openBrowserAsync(video.url)
  }, [])

  const renderVideo = useCallback(
    ({ item }: { item: VideoType }) => {
      const thumbnailUri = item.youtube_id
        ? `https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`
        : item.thumbnail

      return (
        <Pressable
          onPress={() => handleVideoPress(item)}
          style={({ pressed }) => [
            styles.videoCard,
            { backgroundColor: colors.card, borderColor: colors.line, opacity: pressed ? 0.88 : 1 },
          ]}
        >
          {/* Thumbnail */}
          <View style={[styles.thumbnailContainer, { backgroundColor: colors.cardHover }]}>
            {thumbnailUri ? (
              <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} resizeMode="cover" />
            ) : (
              <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.cardHover }]}>
                <Video size={32} color={colors.faint} />
              </View>
            )}
            {/* Play overlay */}
            <View style={styles.playOverlay}>
              <View style={[styles.playButton, { backgroundColor: colors.accent }]}>
                <Play size={18} color="#fff" fill="#fff" />
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.videoContent}>
            {item.stage_label ? (
              <Text style={[styles.stageBadgeText, { color: colors.muted }]} numberOfLines={1}>
                {item.stage_label.toUpperCase()}
              </Text>
            ) : null}
            <Text style={[styles.videoTitle, { color: colors.ink }]} numberOfLines={2}>
              {item.title}
            </Text>
            {item.description ? (
              <Text style={[styles.videoDescription, { color: colors.ink2 }]} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
            <View style={[styles.videoFooter, { borderTopColor: colors.line2 }]}>
              <View style={styles.sourceRow}>
                <Video size={12} color={colors.muted} />
                <Text style={[styles.sourceText, { color: colors.muted }]}>{item.source}</Text>
              </View>
              <View style={styles.watchRow}>
                <Text style={[styles.watchText, { color: colors.accentInk }]}>Watch</Text>
                <ArrowUpRight size={13} color={colors.accentInk} />
              </View>
            </View>
          </View>
        </Pressable>
      )
    },
    [handleVideoPress, colors]
  )

  const videoListHeader = (
    <>
      <ScreenHeader title="Video Library" />
      {/* Stage filter pills */}
      <ScrollView
        horizontal
        nestedScrollEnabled
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
              style={[
                styles.filterPill,
                { borderColor: isActive ? colors.accent : colors.line },
                isActive && { backgroundColor: colors.accent },
              ]}
            >
              <Text style={[
                styles.filterPillText,
                { color: isActive ? '#fff' : colors.ink2 },
              ]}>
                {filter.label}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </>
  )

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          {videoListHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.accent} size="large" />
          </View>
        </View>
      ) : !videos || videos.length === 0 ? (
        <View style={styles.emptyContainer}>
          {videoListHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 }}>
            <Video size={40} color={colors.faint} />
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>No videos available</Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Check back soon for new video content
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={renderVideo}
          ListHeaderComponent={videoListHeader}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },

  // Filter
  filterBar: { marginBottom: 12 },
  filterContent: { gap: 8, paddingHorizontal: 20 },
  filterPill: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 999, borderWidth: 1 },
  filterPillText: { fontFamily: 'Jakarta-Medium', fontSize: 13 },

  // List
  listContent: { paddingHorizontal: 20 },

  // Video card
  videoCard: {
    overflow: 'hidden',
    marginBottom: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  thumbnailContainer: { height: 180, position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  playOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  videoContent: { padding: 16 },
  stageBadgeText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  videoTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 16, lineHeight: 22, letterSpacing: -0.1, marginBottom: 5 },
  videoDescription: { fontFamily: 'Jakarta-Regular', fontSize: 13, lineHeight: 19, marginBottom: 12 },
  videoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sourceText: { fontFamily: 'Jakarta-Regular', fontSize: 12 },
  watchRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  watchText: { fontFamily: 'Jakarta-Medium', fontSize: 12 },

  // Loading / Empty
  loadingContainer: { flex: 1 },
  emptyContainer: { flex: 1 },
  emptyTitle: { fontFamily: 'Jakarta-Bold', fontSize: 18, textAlign: 'center' },
  emptySubtitle: { fontFamily: 'Jakarta-Regular', fontSize: 14, textAlign: 'center', lineHeight: 21 },
})
