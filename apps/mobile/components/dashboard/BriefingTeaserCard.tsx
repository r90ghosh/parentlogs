import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { BookOpen, ChevronRight } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { getBabySize } from '@tdc/shared/utils/baby-sizes'
import { isPregnancyStage } from '@tdc/shared/utils/pregnancy-utils'
import type { BriefingTemplate, FamilyStage } from '@tdc/shared/types'

interface BriefingTeaserCardProps {
  briefing: BriefingTemplate | null | undefined
  currentWeek: number
  stage: string | null | undefined
}

export function BriefingTeaserCard({ briefing, currentWeek, stage }: BriefingTeaserCardProps) {
  const router = useRouter()
  const isPregnancy = stage ? isPregnancyStage(stage as FamilyStage) : false
  const babySize = isPregnancy ? getBabySize(currentWeek) : undefined

  return (
    <Pressable onPress={() => router.push('/(tabs)/briefing')}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <BookOpen size={18} color="#c4703f" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.weekLabel}>Week {currentWeek}</Text>
            <Text style={styles.title}>
              {briefing?.title ?? "This week's briefing"}
            </Text>
          </View>
          <ChevronRight size={20} color="#7a6f62" />
        </View>

        {babySize && (
          <View style={styles.babySizeRow}>
            <Text style={styles.babySizeEmoji}>{babySize.emoji}</Text>
            <Text style={styles.babySizeText}>
              Baby is the size of a {babySize.fruit}
            </Text>
          </View>
        )}

        {briefing?.baby_update && (
          <Text style={styles.preview} numberOfLines={2}>
            {briefing.baby_update}
          </Text>
        )}

        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>Read full briefing</Text>
          <ChevronRight size={14} color="#c4703f" />
        </View>
      </GlassCard>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(196,112,63,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  weekLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    color: '#c4703f',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
    color: '#faf6f0',
    marginTop: 2,
  },
  babySizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(237,230,220,0.04)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  babySizeEmoji: {
    fontSize: 24,
    fontFamily: 'System',
  },
  babySizeText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#ede6dc',
  },
  preview: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    lineHeight: 20,
    marginBottom: 12,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#c4703f',
  },
})
