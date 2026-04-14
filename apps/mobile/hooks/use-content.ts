import { useQuery } from '@tanstack/react-query'
import { articlesService } from '@/lib/services'
import type { Article } from '@tdc/services'

export function useArticles(stage?: string) {
  return useQuery({
    queryKey: ['articles', stage],
    queryFn: () => articlesService.getArticles(stage),
    staleTime: 1000 * 60 * 10,
  })
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesService.getArticleById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  })
}

export type { Article }
