/**
 * Script to parse markdown content files and generate JSON for Supabase import
 * Run with: node scripts/generate-content-json.js
 */

const fs = require('fs')
const path = require('path')

// Stage configuration
const stageConfig = {
  'first-trimester': { label: 'First Trimester', order: 1 },
  'second-trimester': { label: 'Second Trimester', order: 2 },
  'third-trimester': { label: 'Third Trimester', order: 3 },
  'delivery': { label: 'Delivery & Week 1', order: 4 },
  'fourth-trimester': { label: 'Fourth Trimester', order: 5 },
  '3-6-months': { label: '3-6 Months', order: 6 },
  '6-12-months': { label: '6-12 Months', order: 7 },
  '12-18-months': { label: '12-18 Months', order: 8 },
  '18-24-months': { label: '18-24 Months', order: 9 },
}

// File to stage mapping for articles
const articleFileToStage = {
  'first_trimester_articles.md': 'first-trimester',
  'second_trimester_articles.md': 'second-trimester',
  'ParentLogs_Third_Trimester_Articles.md': 'third-trimester',
  'delivery_first_week_articles.md': 'delivery',
  'fourth_trimester_articles.md': 'fourth-trimester',
  'parentlogs_3-6_month_articles.md': '3-6-months',
  'parentlogs_6_12_month_articles.md': '6-12-months',
  'parentlogs_12-18_month_articles.md': '12-18-months',
  'parentlogs_18-24_months_articles.md': '18-24-months',
}

// Video section to stage mapping
const videoSectionToStage = {
  '1st Trimester': 'first-trimester',
  '2nd Trimester': 'second-trimester',
  '3rd Trimester': 'third-trimester',
  'Delivery': 'delivery',
  '0-3 Months': 'fourth-trimester',
  '3-6 Months': '3-6-months',
  '6-12 Months': '6-12-months',
  '12-18 Months': '12-18-months',
  '18-24 Months': '18-24-months',
  'Cross-Phase Resources': 'cross-phase',
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function extractWeekNumber(title) {
  const match = title.match(/Week\s+(\d+)/i)
  return match ? parseInt(match[1], 10) : null
}

function estimateReadTime(content) {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

function extractExcerpt(content, maxLength = 200) {
  // Find "The Quick Brief" section or use first paragraph
  const quickBriefMatch = content.match(/\*\*The Quick Brief\*\*\s*\n\n([^\n]+)/i)
  if (quickBriefMatch) {
    const excerpt = quickBriefMatch[1].trim()
    return excerpt.length > maxLength ? excerpt.substring(0, maxLength) + '...' : excerpt
  }

  // Fallback: first non-heading paragraph
  const paragraphs = content.split('\n\n')
  for (const p of paragraphs) {
    const trimmed = p.trim()
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('*')) {
      return trimmed.length > maxLength ? trimmed.substring(0, maxLength) + '...' : trimmed
    }
  }

  return ''
}

function extractSources(content) {
  const sources = []
  const sourceSection = content.match(/\*\*Sources?:\*\*\s*([\s\S]*?)(?=\n---|\n===|$)/i)
  if (sourceSection) {
    const lines = sourceSection[1].split('\n')
    for (const line of lines) {
      const cleaned = line.replace(/^[-*]\s*/, '').trim()
      if (cleaned && !cleaned.startsWith('**')) {
        sources.push(cleaned)
      }
    }
  }
  return sources
}

function parseArticlesFromFile(fileContent, stage, stageLabel, startIndex) {
  const articles = []

  // Try different formats:
  // 1. ===ARTICLE N: WEEK X=== delimiter
  // 2. ## Article N: Week X heading
  // 3. # Week X: Title heading (separated by ---)

  // Check which format this file uses
  if (fileContent.includes('===ARTICLE')) {
    // Format 1: ===ARTICLE N: WEEK X===
    const articleMatches = fileContent.split(/===ARTICLE\s+\d+:\s*[^=]+===/i)

    for (let i = 1; i < articleMatches.length; i++) {
      const content = articleMatches[i].trim()
      if (!content) continue

      const titleMatch = content.match(/^#\s+(.+)$/m)
      const title = titleMatch ? titleMatch[1].trim() : `Article ${startIndex + i}`

      const week = extractWeekNumber(title)
      const slug = slugify(title)
      const excerpt = extractExcerpt(content)
      const readTime = estimateReadTime(content)
      const sources = extractSources(content)

      articles.push({
        slug,
        title,
        stage,
        stage_label: stageLabel,
        week,
        excerpt,
        read_time: readTime,
        is_free: i <= 2,
        reviewed_by: null,
        content,
        sources,
      })
    }
  } else if (fileContent.match(/^## Article \d+:/m)) {
    // Format 2: ## Article N: Week X — Title
    const articleMatches = fileContent.split(/(?=^## Article \d+:)/m)

    for (let i = 0; i < articleMatches.length; i++) {
      const section = articleMatches[i].trim()
      if (!section.startsWith('## Article')) continue

      // Extract title from ## Article N: heading
      const headerMatch = section.match(/^## Article \d+:\s*(.+)$/m)
      if (!headerMatch) continue

      const title = headerMatch[1].replace(/[—–-]\s*/, ': ').trim()
      const content = section.replace(/^## Article \d+:.*$/m, '').trim()

      const week = extractWeekNumber(title)
      const slug = slugify(title)
      const excerpt = extractExcerpt(content)
      const readTime = estimateReadTime(content)
      const sources = extractSources(content)

      articles.push({
        slug,
        title,
        stage,
        stage_label: stageLabel,
        week,
        excerpt,
        read_time: readTime,
        is_free: articles.length < 2,
        reviewed_by: null,
        content,
        sources,
      })
    }
  } else {
    // Format 3: # Week X: Title (separated by --- or ---)
    // Split by horizontal rules that separate articles
    const sections = fileContent.split(/\n---+\s*---+\s*\n|\n---+\s*\n(?=# Week)/i)

    for (const section of sections) {
      // Find the main heading (# Week X: Title)
      const headingMatch = section.match(/^# (Week \d+:.+)$/m)
      if (!headingMatch) continue

      const title = headingMatch[1].trim()
      const content = section.trim()

      // Skip if this looks like a file header, not an article
      if (title.toLowerCase().includes('trimester') && title.toLowerCase().includes('articles')) continue

      const week = extractWeekNumber(title)
      const slug = slugify(title)
      const excerpt = extractExcerpt(content)
      const readTime = estimateReadTime(content)
      const sources = extractSources(content)

      articles.push({
        slug,
        title,
        stage,
        stage_label: stageLabel,
        week,
        excerpt,
        read_time: readTime,
        is_free: articles.length < 2,
        reviewed_by: null,
        content,
        sources,
      })
    }
  }

  return articles
}

function parseVideosFromFile(fileContent) {
  const videos = []
  let currentStage = ''
  let currentStageLabel = ''

  const lines = fileContent.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Check for section headers (## 1st Trimester, etc.)
    if (line.startsWith('## ')) {
      const sectionName = line.replace('## ', '').replace(/\(.*\)/, '').trim()
      const mappedStage = videoSectionToStage[sectionName]
      if (mappedStage) {
        currentStage = mappedStage
        currentStageLabel = stageConfig[mappedStage]?.label || sectionName
      }
    }

    // Parse table rows (| Title | Source | Description | Link |)
    if (line.startsWith('|') && !line.includes('---') && !line.toLowerCase().includes('title')) {
      const cells = line
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c)

      if (cells.length >= 4 && currentStage) {
        const [title, source, description, url] = cells

        // Skip if it's the header row
        if (title.toLowerCase() === 'title' || title.toLowerCase() === 'resource') continue

        // Extract YouTube ID if applicable
        const youtubeMatch = url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
        )
        const youtubeId = youtubeMatch ? youtubeMatch[1] : null

        const slug = slugify(title)

        videos.push({
          slug,
          title,
          source,
          description,
          url,
          youtube_id: youtubeId,
          stage: currentStage,
          stage_label: currentStageLabel,
          duration: null,
          thumbnail: youtubeId
            ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
            : null,
        })
      }
    }
  }

  return videos
}

function main() {
  console.log('Parsing content files...\n')

  // Parse articles
  const articlesDir = path.join(process.cwd(), 'content', 'articles')
  const allArticles = []

  try {
    const files = fs.readdirSync(articlesDir)
    let totalArticles = 0

    for (const file of files) {
      if (!file.endsWith('.md')) continue

      const stage = articleFileToStage[file]
      if (!stage) {
        console.log(`Skipping ${file} - no stage mapping`)
        continue
      }

      const stageLabel = stageConfig[stage]?.label || stage
      const filePath = path.join(articlesDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const articles = parseArticlesFromFile(content, stage, stageLabel, totalArticles)
      allArticles.push(...articles)
      totalArticles += articles.length

      console.log(`  ${file}: ${articles.length} articles`)
    }

    // Sort by stage order, then by week
    allArticles.sort((a, b) => {
      const stageOrderA = stageConfig[a.stage]?.order || 99
      const stageOrderB = stageConfig[b.stage]?.order || 99
      if (stageOrderA !== stageOrderB) return stageOrderA - stageOrderB
      return (a.week || 0) - (b.week || 0)
    })

    console.log(`\nTotal articles: ${allArticles.length}`)

    // Write articles JSON
    const articlesOutput = path.join(process.cwd(), 'content', 'articles.json')
    fs.writeFileSync(articlesOutput, JSON.stringify(allArticles, null, 2))
    console.log(`Written to: ${articlesOutput}`)
  } catch (error) {
    console.error('Error parsing articles:', error)
  }

  // Parse videos
  const videosDir = path.join(process.cwd(), 'content', 'videos')
  const allVideos = []

  try {
    const files = fs.readdirSync(videosDir)

    for (const file of files) {
      if (!file.endsWith('.md')) continue

      const filePath = path.join(videosDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      const videos = parseVideosFromFile(content)
      allVideos.push(...videos)

      console.log(`\n  ${file}: ${videos.length} videos`)
    }

    // Sort by stage order
    allVideos.sort((a, b) => {
      const stageOrderA = stageConfig[a.stage]?.order || 99
      const stageOrderB = stageConfig[b.stage]?.order || 99
      return stageOrderA - stageOrderB
    })

    console.log(`\nTotal videos: ${allVideos.length}`)

    // Write videos JSON
    const videosOutput = path.join(process.cwd(), 'content', 'videos.json')
    fs.writeFileSync(videosOutput, JSON.stringify(allVideos, null, 2))
    console.log(`Written to: ${videosOutput}`)
  } catch (error) {
    console.error('Error parsing videos:', error)
  }

  // Summary
  console.log('\n=== Summary ===')
  console.log(`Articles: ${allArticles.length}`)
  console.log(`  Free: ${allArticles.filter((a) => a.is_free).length}`)
  console.log(`  Locked: ${allArticles.filter((a) => !a.is_free).length}`)
  console.log(`Videos: ${allVideos.length}`)

  // Stage breakdown
  console.log('\n=== By Stage ===')
  const stages = Object.keys(stageConfig).sort(
    (a, b) => stageConfig[a].order - stageConfig[b].order
  )
  for (const stage of stages) {
    const stageArticles = allArticles.filter((a) => a.stage === stage).length
    const stageVideos = allVideos.filter((v) => v.stage === stage).length
    if (stageArticles > 0 || stageVideos > 0) {
      console.log(`${stageConfig[stage].label}: ${stageArticles} articles, ${stageVideos} videos`)
    }
  }
}

main()
