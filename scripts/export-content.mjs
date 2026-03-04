#!/usr/bin/env node
/**
 * Export all content tables from Supabase to an Excel spreadsheet
 * with separate tabs for briefings, tasks, challenges, budget items, checklists.
 *
 * Usage: node scripts/export-content.mjs
 * Output: docs/content-export.xlsx
 */

import { createClient } from '@supabase/supabase-js'
import XLSX from 'xlsx'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync, readFileSync } from 'fs'

// Load .env.local manually (no dotenv dependency needed)
const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const envPath = join(rootDir, '.env.local')
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchAll(table, orderBy) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order(orderBy, { ascending: true })

  if (error) {
    console.error(`Error fetching ${table}:`, error.message)
    return []
  }
  return data || []
}

function flattenArrayColumns(rows) {
  return rows.map(row => {
    const flat = {}
    for (const [key, val] of Object.entries(row)) {
      if (Array.isArray(val)) {
        flat[key] = val.join(' | ')
      } else if (typeof val === 'object' && val !== null) {
        flat[key] = JSON.stringify(val)
      } else {
        flat[key] = val
      }
    }
    return flat
  })
}

async function main() {
  console.log('Fetching data from Supabase...')

  // 1. Briefing Templates
  const briefings = await fetchAll('briefing_templates', 'week')
  console.log(`  Briefings: ${briefings.length} rows`)

  // 2. Task Templates
  const tasks = await fetchAll('task_templates', 'week')
  console.log(`  Task Templates: ${tasks.length} rows`)

  // 3. Dad Challenge Content
  const challenges = await fetchAll('dad_challenge_content', 'sort_order')
  console.log(`  Dad Challenges: ${challenges.length} rows`)

  // 4. Budget Templates
  const budgets = await fetchAll('budget_templates', 'category')
  console.log(`  Budget Items: ${budgets.length} rows`)

  // 5. Checklist Templates
  const checklists = await fetchAll('checklist_templates', 'sort_order')
  console.log(`  Checklists: ${checklists.length} rows`)

  // 6. Checklist Item Templates
  const checklistItems = await fetchAll('checklist_item_templates', 'sort_order')
  console.log(`  Checklist Items: ${checklistItems.length} rows`)

  // Build workbook
  const wb = XLSX.utils.book_new()

  // Helper: create sheet from data with flattened arrays
  const addSheet = (name, data) => {
    const flat = flattenArrayColumns(data)
    const ws = XLSX.utils.json_to_sheet(flat)

    // Auto-size columns
    const colWidths = {}
    flat.forEach(row => {
      Object.entries(row).forEach(([key, val]) => {
        const len = Math.min(String(val ?? '').length, 60)
        colWidths[key] = Math.max(colWidths[key] || key.length, len)
      })
    })
    ws['!cols'] = Object.values(colWidths).map(w => ({ wch: w + 2 }))

    XLSX.utils.book_append_sheet(wb, ws, name)
  }

  addSheet('Briefings', briefings)
  addSheet('Task Templates', tasks)
  addSheet('Dad Challenges', challenges)
  addSheet('Budget Items', budgets)
  addSheet('Checklists', checklists)
  addSheet('Checklist Items', checklistItems)

  // Ensure output dir exists
  const outDir = join(rootDir, 'docs')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const outPath = join(outDir, 'content-export.xlsx')
  XLSX.writeFile(wb, outPath)
  console.log(`\nExported to: ${outPath}`)
  console.log('Open in Excel/Google Sheets to review and edit.')
}

main().catch(err => {
  console.error('Export failed:', err)
  process.exit(1)
})
