export async function GET() {
  const content = `# The Dad Center
> The operating system for modern fatherhood.

## About
The Dad Center is a pregnancy and parenting companion app designed primarily for dads (but also moms). It provides week-by-week briefings, task management, mood tracking, budget planning, checklists, and a "dad journey" system with challenge tiles across 7 pillars. One subscription covers the whole family — both partners share full access.

## URL
https://thedadcenter.com

## Features
- Weekly Briefings: Week-by-week guidance covering baby development, partner experience, practical tasks, health tips, and preparation milestones tailored to your specific pregnancy week or parenting stage.
- Task Management: Curated, expert-sourced tasks organized by timeline (trimester through 18+ months). Assignable to mom, dad, both, or either partner. 30-day rolling window on the free tier.
- Dad Journey: 7 challenge pillars (Knowledge, Planning, Finances, Anxiety, Baby Bonding, Relationship, Extended Family) with phase-specific content across 9 stages from pre-pregnancy through 18+ months.
- Mood Check-in: Daily mood tracking with emoji-based input, optional flags, and streak tracking to help dads monitor their mental health throughout the journey.
- Budget Planner: Baby-related budget planning with product recommendations organized by timeline categories and tier filters (Budget, Mid-Range, Premium).
- Checklists: Pre-built checklists for hospital bags, nursery setup, and other preparation milestones.
- Baby Tracker: Development tracking for your baby's growth and milestones.
- Partner Sync: Both partners see shared tasks, activity, and progress. The app acts as a neutral third party — the authority is the app, not either partner.

## Pricing
- Free tier: 30-day rolling task window, 4 weeks of briefings, 30 days of push notifications
- Monthly: $4.99/month
- Annual: $39.99/year ($3.33/month)
- Lifetime: $99.99 one-time purchase
- One subscription per family — both partners share access

## Design Philosophy
1. Speed to Value: Useful content within 60 seconds of signing up
2. Neutral Third Party: The app is the authority, not either partner
3. Yellow, Not Red: "Catch up" instead of "overdue" — no guilt-driven UX
4. One Subscription Per Family: Both partners share access
5. Role-Agnostic Navigation, Role-Aware Content: Same app structure, personalized experience
6. Dad-First, Not Dad-Only: Designed for dads but welcoming to all parents
7. Free Should Feel Complete: Real value before ever paying

## Target Audience
- Expectant fathers during pregnancy
- New dads in the first 18+ months of parenthood
- Partners (moms) who want shared parenting coordination
- Dads joining at any stage — the app adapts to wherever you are in your journey

## Content Pillars (Dad Journey)
1. Knowledge: Understanding pregnancy, birth, and child development
2. Planning: Practical preparation for baby's arrival and beyond
3. Finances: Budgeting and financial planning for growing families
4. Anxiety: Managing stress, worry, and mental health
5. Baby Bonding: Building connection with your child
6. Relationship: Maintaining and strengthening your partnership
7. Extended Family: Navigating relationships with grandparents and family

## Timeline Stages
- Pre-Pregnancy
- Trimester 1 (Weeks 1-13)
- Trimester 2 (Weeks 14-27)
- Trimester 3 (Weeks 28-40)
- 0-3 Months
- 3-6 Months
- 6-12 Months
- 12-18 Months
- 18+ Months

## Contact
support@thedadcenter.com
https://thedadcenter.com
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
