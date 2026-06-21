/** Ordered article-stage preferences for a family stage + week (shared by Home + Library). */
export function preferredArticleStages(stage: string, week: number): string[] {
  switch (stage) {
    case 'first-trimester':
      return ['first-trimester', 'second-trimester']
    case 'second-trimester':
      return ['second-trimester', 'first-trimester', 'third-trimester']
    case 'third-trimester':
      return ['third-trimester', 'delivery', 'second-trimester']
    case 'post-birth':
      if (week <= 12) return ['fourth-trimester', 'delivery', '3-6-months']
      if (week <= 26) return ['3-6-months', 'fourth-trimester', '6-12-months']
      if (week <= 52) return ['6-12-months', '3-6-months', '12-18-months']
      if (week <= 78) return ['12-18-months', '6-12-months', '18-24-months']
      return ['18-24-months', '12-18-months']
    case 'pregnancy':
    default:
      if (week <= 13) return ['first-trimester']
      if (week <= 27) return ['second-trimester']
      return ['third-trimester']
  }
}

/** Display order for stage chips. */
export const ARTICLE_STAGE_ORDER = [
  'first-trimester',
  'second-trimester',
  'third-trimester',
  'delivery',
  'fourth-trimester',
  '3-6-months',
  '6-12-months',
  '12-18-months',
  '18-24-months',
]
