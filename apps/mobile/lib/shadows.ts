import { Platform } from 'react-native'
import type { ColorTokens } from '@/lib/colors'

export function createShadows(colors: ColorTokens) {
  return {
    card: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
    hover: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 5 },
    }),
    lift: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: { elevation: 8 },
    }),
    copper: Platform.select({
      ios: {
        shadowColor: colors.copper,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 5 },
    }),
    gold: Platform.select({
      ios: {
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 5 },
    }),
  }
}

// Keep a static default for module-level usage (backwards compat during migration)
export const shadows = createShadows({
  copper: '#c4703f',
  gold: '#d4a853',
} as any)
