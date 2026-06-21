'use client'
import { useEffect, useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Local persistence for checked Briefing "Do this" items (§2.1 §B default:
 * AsyncStorage, not coupled to Tasks). Key: briefing-done:{familyId}:{stage}:{week}
 * → array of checked dad_focus indices.
 */
export function useBriefingDone(familyId: string | null | undefined, stage: string, week: number) {
  const key = familyId ? `briefing-done:${familyId}:${stage}:${week}` : null
  const [done, setDone] = useState<Record<number, boolean>>({})

  useEffect(() => {
    let active = true
    if (!key) {
      setDone({})
      return
    }
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (!active) return
        const map: Record<number, boolean> = {}
        try {
          const arr: number[] = raw ? JSON.parse(raw) : []
          arr.forEach((i) => {
            map[i] = true
          })
        } catch {
          /* ignore malformed */
        }
        setDone(map)
      })
      .catch(() => {
        if (active) setDone({})
      })
    return () => {
      active = false
    }
  }, [key])

  const toggle = useCallback(
    (idx: number) => {
      setDone((prev) => {
        const next = { ...prev, [idx]: !prev[idx] }
        if (key) {
          const arr = Object.keys(next)
            .map(Number)
            .filter((k) => next[k])
          AsyncStorage.setItem(key, JSON.stringify(arr)).catch(() => {})
        }
        return next
      })
    },
    [key]
  )

  return { done, toggle }
}
