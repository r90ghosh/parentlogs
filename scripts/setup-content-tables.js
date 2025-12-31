/**
 * Script to create articles and videos tables in Supabase
 * and seed them with content from JSON files.
 *
 * Run with: node scripts/setup-content-tables.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedArticles() {
  console.log('Seeding articles...')

  const articlesPath = path.join(process.cwd(), 'content', 'articles.json')
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'))

  console.log(`Found ${articles.length} articles`)

  // Insert in batches of 10
  const batchSize = 10
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize)

    const { data, error } = await supabase
      .from('articles')
      .upsert(batch, { onConflict: 'slug' })

    if (error) {
      console.error(`Error inserting articles batch ${i / batchSize + 1}:`, error.message)
      // If table doesn't exist, we need to create it first
      if (error.message.includes('does not exist')) {
        console.log('\nTable does not exist. Please create it manually in Supabase Dashboard:')
        console.log('Go to: SQL Editor > New Query > Paste the SQL from supabase/migrations/004_create_articles_videos.sql')
        return false
      }
    } else {
      console.log(`  Inserted batch ${i / batchSize + 1}/${Math.ceil(articles.length / batchSize)}`)
    }
  }

  console.log('Articles seeded successfully!')
  return true
}

async function seedVideos() {
  console.log('\nSeeding videos...')

  const videosPath = path.join(process.cwd(), 'content', 'videos.json')
  const videos = JSON.parse(fs.readFileSync(videosPath, 'utf-8'))

  console.log(`Found ${videos.length} videos`)

  // Insert in batches of 10
  const batchSize = 10
  for (let i = 0; i < videos.length; i += batchSize) {
    const batch = videos.slice(i, i + batchSize)

    const { data, error } = await supabase
      .from('videos')
      .upsert(batch, { onConflict: 'slug' })

    if (error) {
      console.error(`Error inserting videos batch ${i / batchSize + 1}:`, error.message)
      if (error.message.includes('does not exist')) {
        console.log('\nTable does not exist. Please create it manually in Supabase Dashboard.')
        return false
      }
    } else {
      console.log(`  Inserted batch ${i / batchSize + 1}/${Math.ceil(videos.length / batchSize)}`)
    }
  }

  console.log('Videos seeded successfully!')
  return true
}

async function checkTables() {
  console.log('Checking if tables exist...\n')

  // Try to query articles table
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('id')
    .limit(1)

  if (articlesError && articlesError.message.includes('does not exist')) {
    console.log('❌ articles table does not exist')
    return false
  }
  console.log('✓ articles table exists')

  // Try to query videos table
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('id')
    .limit(1)

  if (videosError && videosError.message.includes('does not exist')) {
    console.log('❌ videos table does not exist')
    return false
  }
  console.log('✓ videos table exists')

  return true
}

async function main() {
  console.log('=== Supabase Content Setup ===\n')

  const tablesExist = await checkTables()

  if (!tablesExist) {
    console.log('\n⚠️  Tables need to be created first.')
    console.log('Please run the following SQL in Supabase Dashboard (SQL Editor):\n')

    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '004_create_articles_videos.sql')
    if (fs.existsSync(migrationPath)) {
      console.log('Copy from: supabase/migrations/004_create_articles_videos.sql')
    }
    console.log('\nOr use the Supabase CLI: npx supabase db push')
    process.exit(1)
  }

  console.log('\n')

  const articlesOk = await seedArticles()
  if (!articlesOk) process.exit(1)

  const videosOk = await seedVideos()
  if (!videosOk) process.exit(1)

  console.log('\n✅ All content seeded successfully!')

  // Verify counts
  const { count: articleCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })

  const { count: videoCount } = await supabase
    .from('videos')
    .select('*', { count: 'exact', head: true })

  console.log(`\nFinal counts:`)
  console.log(`  Articles: ${articleCount}`)
  console.log(`  Videos: ${videoCount}`)
}

main().catch(console.error)
