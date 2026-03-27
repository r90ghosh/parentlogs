import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Theme = 'system' | 'dark' | 'light'
type ResolvedTheme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
  isDark: false,
})

const THEME_STORAGE_KEY = '@tdc_theme_preference'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme()
  const [theme, setThemeState] = useState<Theme>('light')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((value) => {
        if (value === 'system' || value === 'dark' || value === 'light') {
          setThemeState(value)
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme).catch(() => {})
  }

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : theme

  if (!loaded) return null

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, isDark: resolvedTheme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
