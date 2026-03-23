'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dadJourneyService } from '@/lib/services'
import { ContentPhase, DadProfile } from '@tdc/shared/types/dad-journey'

export function useDadChallengeContent(phase: ContentPhase) {
  return useQuery({
    queryKey: ['dad-challenge-content', phase],
    queryFn: () => dadJourneyService.getContentForPhase(phase),
    enabled: !!phase,
    staleTime: 1000 * 60 * 10, // 10 minutes — content changes rarely
  })
}

export function useDadProfile(userId: string) {
  return useQuery({
    queryKey: ['dad-profile', userId],
    queryFn: () => dadJourneyService.getDadProfile(userId),
    enabled: !!userId,
  })
}

export function useUpsertDadProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, profile }: { userId: string; profile: Partial<DadProfile> }) =>
      dadJourneyService.upsertDadProfile(userId, profile),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['dad-profile', userId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useSubmitMoodCheckin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dadJourneyService.submitMoodCheckin,
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['mood-checkin', userId] })
      queryClient.invalidateQueries({ queryKey: ['mood-history', userId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useLastCheckin(userId: string) {
  return useQuery({
    queryKey: ['mood-checkin', userId],
    queryFn: () => dadJourneyService.getLastCheckin(userId),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  })
}

export function useMoodHistory(userId: string, limit = 7) {
  return useQuery({
    queryKey: ['mood-history', userId, limit],
    queryFn: () => dadJourneyService.getRecentCheckins(userId, limit),
    enabled: !!userId,
  })
}
