import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days (keep cached data longer)
      staleTime: 1000 * 60 * 5, // 5 min default (show cached data, refresh in bg)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 3,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'TDC_QUERY_CACHE',
  throttleTime: 2000,
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        // Don't block UI while hydrating — show cached data immediately if any
        buster: 'v1',
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
