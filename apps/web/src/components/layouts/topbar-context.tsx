'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface TopbarConfig {
  title?: ReactNode
  subtitle?: ReactNode
  /** Extra leading actions rendered before the global search/bell/avatar. */
  actions?: ReactNode
}

interface TopbarContextValue {
  config: TopbarConfig
  setConfig: (c: TopbarConfig) => void
}

const TopbarContext = createContext<TopbarContextValue | null>(null)

export function TopbarProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<TopbarConfig>({})
  return <TopbarContext.Provider value={{ config, setConfig }}>{children}</TopbarContext.Provider>
}

export function useTopbar(): TopbarConfig {
  return useContext(TopbarContext)?.config ?? {}
}

/**
 * Page hook: set the shell topbar title/subtitle/actions. Resets on unmount.
 * Pass primitive deps so the effect only re-runs when the displayed values change.
 */
export function usePageHeader(config: TopbarConfig, deps: ReadonlyArray<unknown>) {
  const ctx = useContext(TopbarContext)
  useEffect(() => {
    ctx?.setConfig(config)
    return () => ctx?.setConfig({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
