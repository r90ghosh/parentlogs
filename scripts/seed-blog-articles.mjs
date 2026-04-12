#!/usr/bin/env node
/**
 * Seed 12 SEO blog articles from markdown drafts into blog_posts table.
 * Run: node scripts/seed-blog-articles.mjs
 */
import { createClient } from '../apps/web/node_modules/@supabase/supabase-js/dist/index.mjs'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const SUPABASE_URL = 'https://oeeeiquclwfpypojjigx.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY env var')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const DRAFTS_DIR = join(import.meta.dirname, '..', 'apps', 'web', 'content', 'blog-drafts')

// Staggered publishing schedule
const PUBLISH_DATES = [
  '2026-03-15T09:00:00Z', // Article 1
  '2026-03-18T09:00:00Z', // Article 2
  '2026-03-20T09:00:00Z', // Article 3
  '2026-03-22T09:00:00Z', // Article 4
  '2026-03-25T09:00:00Z', // Article 5
  '2026-03-27T09:00:00Z', // Article 6
  '2026-03-29T09:00:00Z', // Article 7
  '2026-04-01T09:00:00Z', // Article 8
  '2026-04-03T09:00:00Z', // Article 9
  '2026-04-05T09:00:00Z', // Article 10
  '2026-04-08T09:00:00Z', // Article 11
  '2026-04-10T09:00:00Z', // Article 12
]

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error('No frontmatter found')

  const yaml = match[1]
  const body = match[2].trim()

  const get = (key) => {
    const m = yaml.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'))
    return m ? m[1] : null
  }

  const getArray = (key) => {
    const m = yaml.match(new RegExp(`^${key}:\\s*\\[(.*)\\]`, 'm'))
    if (!m) return []
    return m[1].split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
  }

  return {
    slug: get('slug'),
    title: get('title'),
    excerpt: get('excerpt'),
    category: get('category'),
    tags: getArray('tags'),
    meta_title: get('meta_title'),
    meta_description: get('meta_description'),
    author: get('author') || 'The Dad Center',
    read_time: parseInt(get('read_time') || '5', 10),
    content: body,
  }
}

async function main() {
  const files = readdirSync(DRAFTS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()

  console.log(`Found ${files.length} draft files`)

  let inserted = 0
  let skipped = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const raw = readFileSync(join(DRAFTS_DIR, file), 'utf-8')
    const data = parseFrontmatter(raw)

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('slug', data.slug)
      .maybeSingle()

    if (existing) {
      console.log(`  SKIP ${file} (slug "${data.slug}" already exists)`)
      skipped++
      continue
    }

    const row = {
      slug: data.slug,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags,
      featured_image: null,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      published_at: PUBLISH_DATES[i] || new Date().toISOString(),
      updated_at: PUBLISH_DATES[i] || new Date().toISOString(),
      author: data.author,
      read_time: data.read_time,
      status: 'published',
    }

    const { error } = await supabase.from('blog_posts').insert(row)

    if (error) {
      console.error(`  FAIL ${file}: ${error.message}`)
    } else {
      console.log(`  OK   ${file} → /blog/${data.slug}`)
      inserted++
    }
  }

  console.log(`\nDone: ${inserted} inserted, ${skipped} skipped`)
}

main().catch(console.error)
