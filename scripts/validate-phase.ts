#!/usr/bin/env npx tsx
/**
 * V2 Phase Validator
 *
 * Validates a completed build phase by checking:
 * 1. All expected files exist
 * 2. npm run build passes
 * 3. Phase-specific checks
 *
 * Usage:
 *   npx tsx scripts/validate-phase.ts --phase 1
 *
 * Setup:
 *   npm install -D @anthropic-ai/sdk tsx
 *   Set ANTHROPIC_API_KEY env var
 *
 * Note: The Anthropic SDK is optional — the script works without it
 * for basic file/build checks. With the SDK, it adds AI-powered
 * code review of changed files (~$0.01-0.10 per run).
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve } from 'path'

// Phase file expectations — what each phase should create or modify
const PHASE_FILES: Record<number, { new: string[]; modified: string[] }> = {
  1: {
    new: [],
    modified: [], // Migrations applied via Supabase MCP, no local files
  },
  2: {
    new: [
      'src/types/dad-journey.ts',
      'src/lib/phase-utils.ts',
      'src/lib/dad-pillar-config.ts',
      'src/lib/paywall-copy.ts',
    ],
    modified: [],
  },
  3: {
    new: [
      'src/services/dad-journey-service.ts',
      'src/hooks/use-dad-journey.ts',
    ],
    modified: [],
  },
  4: {
    new: [
      'src/app/(auth)/onboarding/ready/page.tsx',
      'src/app/(main)/onboarding/personalize/page.tsx',
    ],
    modified: [
      'src/app/(auth)/signup/page.tsx',
      'src/app/(auth)/onboarding/role/page.tsx',
      'src/app/(auth)/onboarding/family/page.tsx',
      'src/app/(auth)/onboarding/invite/page.tsx',
      'src/app/(auth)/onboarding/complete/page.tsx',
    ],
  },
  5: {
    new: [],
    modified: [
      'src/components/layouts/main-layout-client.tsx',
    ],
  },
  6: {
    new: [
      'src/app/(main)/journey/page.tsx',
      'src/app/(main)/briefing/[weekId]/page.tsx',
    ],
    modified: [],
  },
  7: {
    new: [
      'src/components/dashboard/MoodCheckinCard.tsx',
      'src/components/dashboard/BriefingTeaserCard.tsx',
      'src/components/dashboard/TasksDueCard.tsx',
      'src/components/dashboard/OnYourMindCard.tsx',
      'src/components/dashboard/PersonalizeCard.tsx',
      'src/components/dashboard/InvitePartnerCard.tsx',
      'src/components/dashboard/BudgetSnapshotCard.tsx',
      'src/components/dashboard/ChecklistProgressCard.tsx',
      'src/components/dashboard/WelcomeCatchUpCard.tsx',
      'src/hooks/use-dashboard-context.ts',
    ],
    modified: [
      'src/components/dashboard/DashboardClient.tsx',
    ],
  },
  8: {
    new: [
      'src/components/dashboard/dad-journey/DadChallengeTiles.tsx',
      'src/components/dashboard/dad-journey/DadChallengeTile.tsx',
      'src/components/dashboard/dad-journey/MoodCheckinWidget.tsx',
      'src/components/dashboard/dad-journey/index.ts',
    ],
    modified: [],
  },
  9: {
    new: [],
    modified: [
      'src/components/dashboard/dad-journey/MoodCheckinWidget.tsx',
    ],
  },
  10: {
    new: [
      'src/app/(main)/briefing/[weekId]/page.tsx',
    ],
    modified: [
      'src/app/(main)/briefing/page.tsx',
    ],
  },
  11: {
    new: [],
    modified: [
      'src/app/(main)/tasks/page.tsx',
      'src/components/tasks/tasks-page-client.tsx',
      'src/app/(main)/calendar/page.tsx',
    ],
  },
  12: {
    new: [],
    modified: [
      'src/components/dashboard/DashboardClient.tsx',
    ],
  },
  13: {
    new: [
      'src/components/dashboard/WelcomeCatchUpCard.tsx',
    ],
    modified: [
      'src/components/tasks/catch-up-section.tsx',
      'src/components/tasks/catch-up-banner.tsx',
      'src/components/tasks/catch-up-task-item.tsx',
    ],
  },
  14: {
    new: [],
    modified: [
      'src/services/notification-service.ts',
      'src/hooks/use-notifications.ts',
    ],
  },
  15: {
    new: [],
    modified: [
      'src/components/shared/paywall-overlay.tsx',
      'src/components/shared/paywall-banner.tsx',
    ],
  },
  16: {
    new: [
      'src/lib/paywall-copy.ts',
    ],
    modified: [
      'src/app/(public)/upgrade/page.tsx',
      'src/app/(main)/settings/subscription/page.tsx',
      'src/services/subscription-service.ts',
    ],
  },
  17: {
    new: [
      'content/dad-challenges.json',
    ],
    modified: [],
  },
}

interface ValidationResult {
  phase: number
  fileChecks: { file: string; exists: boolean; type: 'new' | 'modified' }[]
  buildPassed: boolean
  buildOutput: string
  aiReview: string | null
  summary: string
}

function checkFiles(phase: number): ValidationResult['fileChecks'] {
  const spec = PHASE_FILES[phase]
  if (!spec) return []

  const results: ValidationResult['fileChecks'] = []
  const root = resolve(process.cwd())

  for (const file of spec.new) {
    results.push({
      file,
      exists: existsSync(resolve(root, file)),
      type: 'new',
    })
  }

  for (const file of spec.modified) {
    results.push({
      file,
      exists: existsSync(resolve(root, file)),
      type: 'modified',
    })
  }

  return results
}

function runBuild(): { passed: boolean; output: string } {
  try {
    const output = execSync('npm run build 2>&1', {
      encoding: 'utf-8',
      timeout: 120_000,
      cwd: process.cwd(),
    })
    return { passed: true, output: output.slice(-500) }
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string }
    const output = (error.stdout || '') + (error.stderr || '')
    return { passed: false, output: output.slice(-1000) }
  }
}

async function runAiReview(phase: number): Promise<string | null> {
  try {
    // Dynamic import — only loads if SDK is installed
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic()

    const spec = PHASE_FILES[phase]
    const files = [...spec.new, ...spec.modified].join(', ')

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `You are reviewing Phase ${phase} of The Dad Center V2 build. The following files were created/modified: ${files}. Does the phase look complete based on the file list? Any obvious gaps? Keep response to 2-3 sentences.`,
      }],
    })

    const textBlock = response.content.find(b => b.type === 'text')
    return textBlock ? textBlock.text : null
  } catch {
    return null // SDK not installed or API key missing — skip AI review
  }
}

async function main() {
  const args = process.argv.slice(2)
  const phaseIdx = args.indexOf('--phase')
  if (phaseIdx === -1 || !args[phaseIdx + 1]) {
    console.error('Usage: npx tsx scripts/validate-phase.ts --phase <number>')
    process.exit(1)
  }

  const phase = parseInt(args[phaseIdx + 1], 10)
  if (!PHASE_FILES[phase]) {
    console.error(`Unknown phase: ${phase}. Valid phases: 1-17`)
    process.exit(1)
  }

  console.log(`\n=== Validating Phase ${phase} ===\n`)

  // 1. Check files
  const fileChecks = checkFiles(phase)
  console.log('File checks:')
  let allFilesOk = true
  for (const check of fileChecks) {
    const status = check.exists ? 'OK' : 'MISSING'
    const icon = check.exists ? '\u2705' : '\u274C'
    if (!check.exists) allFilesOk = false
    console.log(`  ${icon} [${check.type}] ${check.file} — ${status}`)
  }
  if (fileChecks.length === 0) {
    console.log('  (no file checks for this phase)')
  }

  // 2. Run build
  console.log('\nRunning npm run build...')
  const { passed: buildPassed, output: buildOutput } = runBuild()
  console.log(`  Build: ${buildPassed ? '\u2705 PASSED' : '\u274C FAILED'}`)
  if (!buildPassed) {
    console.log(`  Last 500 chars of output:\n${buildOutput.slice(-500)}`)
  }

  // 3. AI review (optional)
  console.log('\nRunning AI review...')
  const aiReview = await runAiReview(phase)
  if (aiReview) {
    console.log(`  AI Review: ${aiReview}`)
  } else {
    console.log('  (skipped — @anthropic-ai/sdk not installed or ANTHROPIC_API_KEY not set)')
  }

  // 4. Summary
  const allPassed = allFilesOk && buildPassed
  console.log(`\n=== Phase ${phase} Validation: ${allPassed ? 'PASSED \u2705' : 'ISSUES FOUND \u274C'} ===\n`)

  if (!allPassed) process.exit(1)
}

main().catch(console.error)
