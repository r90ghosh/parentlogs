import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { BookOpen, ChevronRight } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useColors } from '@/hooks/use-colors'
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
  const colors = useColors()
  const isPregnancy = stage ? isPregnancyStage(stage as FamilyStage) : false
  const babySize = isPregnancy ? getBabySize(currentWeek) : undefined

  return (
    <Pressable onPress={() => router.push('/(tabs)/briefing')}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconBadge, { backgroundColor: colors.copperDim }]}>
            <BookOpen size={18} color={colors.copper} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.weekLabel, { color: colors.copper }]}>Week {currentWeek}</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {briefing?.title ?? "This week's briefing"}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </View>

        {babySize && (
          <View style={[styles.babySizeRow, { backgroundColor: colors.pressed }]}>
            <Text style={styles.babySizeEmoji}>{babySize.emoji}</Text>
            <Text style={[styles.babySizeText, { color: colors.textSecondary }]}>
              Baby is the size of a {babySize.fruit}
            </Text>
          </View>
        )}

        {briefing?.baby_update && (
          <Text style={[styles.preview, { color: colors.textMuted }]} numberOfLines={2}>
            {briefing.baby_update}
          </Text>
        )}

        <View style={styles.ctaRow}>
          <Text style={[styles.ctaText, { color: colors.copper }]}>Read full briefing</Text>
          <ChevronRight size={14} color={colors.copper} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  weekLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
    marginTop: 2,
  },
  babySizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  babySizeEmoji: {
    fontSize: 24,
  },
  babySizeText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
  },
  preview: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
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
  },
})
