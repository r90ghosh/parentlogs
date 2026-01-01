# Claude Code Prompt: Tasks Page - Exact Implementation

## Reference

The exact design is in the HTML mockup file. This prompt provides implementation details matching that design precisely.

---

## Page Structure Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Sidebar 240px]  │  [Main Content - flex: 1]                            │
│                  │                                                       │
│ 👶 ParentLogs    │  Tasks                           [📅 Calendar] [+ Add]│
│ [Week 20]        │  Week 20 of 40 — Halfway there! 🎉 • 140 days to go   │
│                  │                                                       │
│ 🏠 Home          │  ┌─────────────────────────────────────────────────┐  │
│ ✅ Tasks [8]     │  │ 🚀 Let's get you caught up!          [34] ████  │  │
│ 📅 Calendar      │  │ You joined at Week 20...      [Continue Triage→]│  │
│ ⏱️ Tracker       │  └─────────────────────────────────────────────────┘  │
│ 📖 Briefings     │                                                       │
│ 📚 Resources     │  [🎯 3 Due Today] [📅 8 This Week] [✅ 12 Done] ...   │
│ 💰 Budget        │                                                       │
│ 📋 Checklists    │  [Active] [Catch-Up] [My Tasks] ... | 🏥 🛒 📋 | 🔍   │
│ ⚙️ Settings      │                                                       │
│                  │  ┌─────────────────────────────┐ ┌─────────────────┐  │
│                  │  │ 📥 Catch-Up Queue (34)      │ │ 🎯 Today's Focus│  │
│                  │  │ [Tasks with triage buttons] │ │ [Focus card]    │  │
│                  │  ├─────────────────────────────┤ ├─────────────────┤  │
│                  │  │ 📅 This Week (8)            │ │ 📅 This Week    │  │
│                  │  │ [Regular task items]        │ │ [Calendar]      │  │
│                  │  ├─────────────────────────────┤ ├─────────────────┤  │
│                  │  │ 🔮 Coming Up (Week 21-24)   │ │ 📊 Progress     │  │
│                  │  │ [Dimmed future tasks]       │ │ [Ring + stats]  │  │
│                  │  └─────────────────────────────┘ ├─────────────────┤  │
│                  │                                   │ 🔥 3 Day Streak │  │
│                  │                                   └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/
├── app/(app)/
│   ├── layout.tsx                    # Layout with sidebar
│   └── dashboard/
│       └── tasks/
│           ├── page.tsx              # Tasks page (server component)
│           └── triage/
│               └── page.tsx          # Full-screen triage mode
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx               # Fixed left sidebar
│   └── tasks/
│       ├── TasksPage.tsx             # Main client component container
│       ├── TasksHeader.tsx           # Page title + subtitle + actions
│       ├── CatchUpBanner.tsx         # Purple "Let's get caught up" banner
│       ├── StatsBar.tsx              # Row of 5 stat cards
│       ├── FilterBar.tsx             # Tabs + category chips + search
│       ├── TaskSection.tsx           # Collapsible section container
│       ├── CatchUpSection.tsx        # Catch-up section with bulk actions
│       ├── CatchUpTaskItem.tsx       # Task with triage buttons (no checkbox)
│       ├── TaskItem.tsx              # Regular task with checkbox
│       ├── RightPanel.tsx            # Container for right side cards
│       ├── FocusCard.tsx             # "Today's Focus" card
│       ├── WeekCalendarCard.tsx      # Mini week calendar
│       ├── ProgressCard.tsx          # Circular progress ring
│       ├── StreakBanner.tsx          # Streak gamification
│       └── triage/
│           └── TriageMode.tsx        # Full-screen triage experience
├── hooks/
│   ├── useTasks.ts
│   ├── useTaskStats.ts
│   └── useTaskTriage.ts
├── lib/
│   └── task-utils.ts
└── types/
    └── tasks.ts
```

---

## Color Palette & Design Tokens

```typescript
// lib/design-tokens.ts

export const colors = {
  // Background
  bg: {
    app: '#0a0a0f',
    sidebar: 'linear-gradient(180deg, #111118 0%, #0d0d12 100%)',
    card: 'linear-gradient(135deg, #18181b 0%, #1f1f26 100%)',
    cardHover: 'rgba(255,255,255,0.03)',
  },
  
  // Borders
  border: {
    default: 'rgba(255,255,255,0.06)',
    hover: 'rgba(255,255,255,0.15)',
    active: 'rgba(245, 158, 11, 0.5)',
  },
  
  // Text
  text: {
    primary: '#fff',
    secondary: '#e4e4e7',
    muted: '#a1a1aa',
    dimmed: '#71717a',
    faint: '#52525b',
  },
  
  // Accent colors
  accent: {
    primary: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    indigo: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    green: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    teal: '#14b8a6',
  },
  
  // Category colors
  category: {
    medical: { bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
    shopping: { bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.2)' },
    planning: { bg: 'rgba(168, 85, 247, 0.1)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.2)' },
    financial: { bg: 'rgba(34, 197, 94, 0.1)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.2)' },
    partner: { bg: 'rgba(236, 72, 153, 0.1)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.2)' },
  },
  
  // Status colors  
  status: {
    warning: '#f59e0b',
    danger: '#ef4444',
    success: '#22c55e',
    info: '#3b82f6',
    purple: '#818cf8',
  },
  
  // Stat icon backgrounds (15% opacity)
  statIcon: {
    focus: 'rgba(245, 158, 11, 0.15)',
    today: 'rgba(239, 68, 68, 0.15)',
    week: 'rgba(59, 130, 246, 0.15)',
    completed: 'rgba(34, 197, 94, 0.15)',
    partner: 'rgba(168, 85, 247, 0.15)',
    catchup: 'rgba(99, 102, 241, 0.15)',
  },
};

export const spacing = {
  sidebar: '240px',
  rightPanel: '380px',
  contentPadding: '32px 40px',
  cardPadding: '16px 20px',
  gap: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
};

export const radius = {
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  '2xl': '16px',
};
```

---

## Components

### 1. Sidebar.tsx

Fixed left sidebar (240px width).

```tsx
// Key styles:
// - width: 240px, position: fixed, height: 100vh
// - background: linear-gradient(180deg, #111118 0%, #0d0d12 100%)
// - border-right: 1px solid rgba(255,255,255,0.06)
// - padding: 24px 16px

// Logo section:
// - 36x36 icon with gradient bg, rounded-10
// - "ParentLogs" text 18px font-weight 700
// - Week badge: bg teal/15%, text teal, rounded-full, px-10 py-4

// Nav items:
// - padding: 10px 12px, rounded-8
// - icon 18px, label 14px font-weight 500
// - color: #a1a1aa, hover: rgba(255,255,255,0.04) + #e4e4e7
// - active: rgba(245, 158, 11, 0.1) + #f59e0b
// - badge: bg #f59e0b, text white, 11px font-weight 600, rounded-full
```

### 2. TasksHeader.tsx

Page header with title, subtitle, and action buttons.

```tsx
interface TasksHeaderProps {
  currentWeek: number;
  daysToGo: number;
}

// Layout: flex justify-between items-start mb-24px
// Left side:
//   - h1: 28px font-weight 700 color white mb-8
//   - subtitle: flex items-center gap-16, color #71717a, 14px
//   - "Week X of 40 — Halfway there! 🎉" • divider dot • "X days to go"

// Right side (header-actions):
//   - flex gap-12
//   - btn-secondary: rgba(255,255,255,0.06) border rgba(255,255,255,0.1)
//   - btn-primary: gradient orange, hover shadow + translateY(-1px)
```

### 3. CatchUpBanner.tsx

The prominent purple banner for catch-up.

```tsx
interface CatchUpBannerProps {
  tasksToReview: number;
  percentDone: number;
  signupWeek: number;
  onContinueTriage: () => void;
}

// Container:
// - background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)
// - border: 1px solid rgba(99, 102, 241, 0.3)
// - border-radius: 16px, padding: 24px
// - display: flex, align-items: center, gap: 20px

// Icon (catchup-icon):
// - 56x56, rounded-16
// - background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
// - font-size: 28px, centered, flex-shrink: 0

// Content (catchup-content):
// - flex: 1
// - Title: 18px font-weight 700 white mb-6
// - Description: 14px color #a1a1aa line-height 1.5

// Progress section:
// - Stats: 32px font-weight 800 white, 12px #a1a1aa label below
// - Progress bar: 120px wide, 8px height, rgba(255,255,255,0.1) bg
// - Fill: gradient indigo, rounded-4
// - Label below: 11px #71717a centered

// Button:
// - background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
// - padding: 12px 24px, rounded-10, 14px font-weight 600
// - hover: translateY(-1px) + shadow rgba(99, 102, 241, 0.3)
```

### 4. StatsBar.tsx

Row of 5 clickable stat cards.

```tsx
interface StatsBarProps {
  stats: {
    dueToday: number;
    thisWeek: number;
    completed: number;
    partnerTasks: number;
    catchUpQueue: number;
  };
  activeCard: string | null;
  onCardClick: (card: string) => void;
}

// Container: grid grid-cols-5 gap-16 mb-24

// Each stat-card:
// - background: linear-gradient(135deg, #18181b 0%, #1f1f26 100%)
// - border: 1px solid rgba(255,255,255,0.06), rounded-12
// - padding: 16px 20px, flex items-center gap-16, cursor-pointer
// - hover: border-color rgba(255,255,255,0.15)
// - active state: border rgba(245, 158, 11, 0.5), bg with amber gradient

// stat-icon: 44x44 rounded-12, centered, 20px emoji
// - Each has different bg color (see statIcon colors above)

// stat-info:
// - value: 24px font-weight 700
//   - .warning = #f59e0b (due today)
//   - .danger = #ef4444
//   - .success = #22c55e (completed)
//   - catchup = #818cf8
// - label: 12px #71717a

// Cards in order:
// 1. 🎯 Due Today (warning color if > 0)
// 2. 📅 This Week
// 3. ✅ Completed (success color)
// 4. 👥 Partner's
// 5. 📥 Catch-Up Queue (purple, only show if > 0)
```

### 5. FilterBar.tsx

Tabs + category chips + search.

```tsx
interface FilterBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Container: flex items-center gap-12 mb-24 pb-24 border-bottom rgba(255,255,255,0.06)

// filter-tabs container:
// - display: flex, bg rgba(255,255,255,0.04), rounded-10, padding: 4px

// Each filter-tab:
// - padding: 8px 16px, rounded-8, 13px font-weight 500
// - color: #71717a, hover: #a1a1aa
// - active: bg rgba(255,255,255,0.1), color white

// Tabs: Active | Catch-Up | My Tasks | Partner's | Completed

// filter-divider: 1px width, 32px height, rgba(255,255,255,0.1)

// category-filters: flex gap-8
// Each category-chip:
// - flex items-center gap-6, padding: 6px 12px, rounded-20
// - 12px font-weight 500, cursor-pointer, border: 1px solid transparent
// - "All" chip: bg rgba(255,255,255,0.08), color #e4e4e7
// - Others: colored per category with border

// search-box: margin-left: auto
// - flex items-center gap-8
// - bg rgba(255,255,255,0.04), border rgba(255,255,255,0.08), rounded-8
// - padding: 8px 12px
// - input: bg none, border none, 13px, 180px width, placeholder #52525b
```

### 6. TaskSection.tsx

Collapsible section for task groups.

```tsx
interface TaskSectionProps {
  icon: string;
  title: string;
  count: number | string; // "8 tasks" or "Week 21-24"
  subtitle?: string;
  actions?: React.ReactNode;
  isCatchUp?: boolean;
  children: React.ReactNode;
}

// Container (task-section):
// - background: linear-gradient(135deg, #18181b 0%, #1f1f26 100%)
// - border: 1px solid rgba(255,255,255,0.06), rounded-16
// - .catchup variant: border-color rgba(99, 102, 241, 0.3)

// section-header:
// - flex items-center justify-between, padding: 16px 20px
// - border-bottom: 1px solid rgba(255,255,255,0.06)
// - .catchup header: bg linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)

// section-title container: flex items-center gap-10
// - emoji span
// - h3: 15px font-weight 600 white
// - section-count: 12px #71717a, bg rgba(255,255,255,0.06), px-8 py-2, rounded-10
// - section-subtitle (if present): 12px #71717a, margin-left 28px, margin-top 4

// section-actions: flex gap-8
// - section-action button: 12px #71717a, bg rgba(255,255,255,0.04), px-12 py-6, rounded-6
// - hover: bg rgba(255,255,255,0.08), color #a1a1aa
// - .primary: bg rgba(99, 102, 241, 0.15), color #818cf8
// - .success: bg rgba(34, 197, 94, 0.15), color #4ade80

// task-list container: padding: 8px
```

### 7. CatchUpTaskItem.tsx

Task item with triage buttons (NO checkbox).

```tsx
interface CatchUpTaskItemProps {
  task: FamilyTask;
  backlogCategory: 'expired' | 'still-relevant' | 'probably-done';
  onAlreadyDid: () => void;
  onAddToList: () => void;
  onSkip: () => void;
}

// Container (task-item):
// - flex items-start gap-16, padding: 16px, rounded-12, cursor-pointer
// - hover: bg rgba(255,255,255,0.03)
// - .expired variant: opacity 0.6

// NO checkbox for catch-up items

// task-content: flex-1, min-width: 0

// task-header: flex items-center gap-10 mb-6 flex-wrap
// - task-title: 15px font-weight 600 color #e4e4e7
//   - .expired: color #71717a
// - task-badges container: flex gap-6

// task-badge styles:
// - 10px font-weight 600, px-8 py-3, rounded-10, uppercase, letter-spacing 0.3px
// - .expired (Window Passed): bg rgba(113, 113, 122, 0.15), color #a1a1aa
// - .still-relevant: bg rgba(34, 197, 94, 0.15), color #22c55e
// - .probably-done: bg rgba(168, 85, 247, 0.15), color #a855f7

// task-description: 13px #71717a mb-10 line-height 1.5

// task-meta: flex items-center gap-16 flex-wrap
// - category-tag: inline-flex items-center gap-4, 11px font-weight 500, px-8 py-3, rounded-6
// - task-meta-item: flex items-center gap-6, 12px #52525b
//   - "📅 Originally Week X" or "📅 Was due Week X"
//   - "⏱️ X hours"

// task-quick-actions: flex gap-8 flex-shrink-0

// quick-action-btn: px-14 py-8, rounded-8, 12px font-weight 600, flex items-center gap-6
// - .done: bg rgba(34, 197, 94, 0.15), color #4ade80
// - .add: bg rgba(59, 130, 246, 0.15), color #60a5fa
// - .skip: bg rgba(255,255,255,0.06), color #71717a
// - hover states: increase bg opacity

// For expired tasks: only show "✓ Already did" and "Skip" (no "Add to list")
// For probably-done: show "✓ Yes, done" and "+ Need to do" (different labels)
```

### 8. TaskItem.tsx

Regular task with checkbox.

```tsx
interface TaskItemProps {
  task: FamilyTask;
  isHighlighted?: boolean; // for "due today" tasks
  onComplete: () => void;
  onSnooze?: () => void;
}

// Container (task-item):
// - flex items-start gap-16, padding: 16px, rounded-12
// - hover: bg rgba(255,255,255,0.03)
// - .highlight: bg rgba(245, 158, 11, 0.05), border 1px solid rgba(245, 158, 11, 0.2)

// task-checkbox:
// - 22x22, border: 2px solid #52525b, rounded-6
// - flex-shrink: 0, margin-top: 2px
// - hover: border-color #22c55e, bg rgba(34, 197, 94, 0.1)

// task-content: flex-1

// task-header: flex items-center gap-10 mb-6 flex-wrap
// - task-title: 15px font-weight 600 #e4e4e7

// task-badges: flex gap-6
// - .must-do: bg rgba(239, 68, 68, 0.15), color #ef4444
// - .nice-to-have: bg rgba(59, 130, 246, 0.15), color #3b82f6
// - .time-sensitive: bg rgba(245, 158, 11, 0.15), color #f59e0b

// task-description: 13px #71717a mb-10 line-height 1.5

// task-meta: flex items-center gap-16 flex-wrap
// - category-tag (colored per category)
// - ⏱️ time estimate
// - 📅 due date ("Due today", "Due Fri", etc.)
// - assignee avatar + label

// assignee-avatar: 20x20 rounded-full, 10px font-weight 600 white
// - .you: gradient purple
// - .partner: gradient pink
// - .both: gradient orange
```

### 9. FocusCard.tsx

"Today's Focus" card for right panel.

```tsx
interface FocusCardProps {
  task: FamilyTask | null;
  onDone: () => void;
  onSnooze: () => void;
}

// Container (focus-card):
// - background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)
// - border: 1px solid rgba(245, 158, 11, 0.2), rounded-16, padding: 24px

// focus-header: flex items-center justify-between mb-20
// - focus-label: flex items-center gap-8, 12px font-weight 600, color #f59e0b
//   uppercase, letter-spacing 0.5px, "🎯 Today's Focus"
// - focus-time: 12px #71717a, "⏱️ ~15 min"

// focus-task-title: 18px font-weight 700 white mb-8

// focus-task-desc: 14px #a1a1aa line-height 1.6 mb-16

// focus-why box:
// - bg rgba(0,0,0,0.2), rounded-10, padding: 12px 16px, mb-20
// - focus-why-label: 11px font-weight 600 #f59e0b uppercase letter-spacing 0.5 mb-6
// - focus-why-text: 13px #a1a1aa line-height 1.5

// focus-actions: flex gap-10
// - focus-btn: flex-1, padding: 12px, rounded-10, 14px font-weight 600
//   flex items-center justify-center gap-6
// - .done: gradient green, color white, hover shadow
// - .snooze: bg rgba(255,255,255,0.06), color #a1a1aa, border rgba(255,255,255,0.1)
//   hover: bg rgba(255,255,255,0.1), color #e4e4e7
```

### 10. WeekCalendarCard.tsx

Mini week calendar.

```tsx
interface WeekCalendarCardProps {
  days: Array<{
    label: string; // "Mon"
    num: number;   // 30
    tasks: number; // task count
    isToday?: boolean;
  }>;
  onPrev: () => void;
  onNext: () => void;
}

// Container (week-summary):
// - background: linear-gradient(135deg, #18181b 0%, #1f1f26 100%)
// - border: 1px solid rgba(255,255,255,0.06), rounded-16, padding: 20px

// week-summary-header: flex items-center justify-between mb-16
// - title: 14px font-weight 600 white, "📅 This Week"
// - nav buttons: flex gap-8, each is 28x28 rounded-6 centered

// week-grid: grid grid-cols-7 gap-8
// Each week-day:
// - text-align: center, padding: 8px, rounded-8
// - week-day-label: 10px #52525b mb-4
// - week-day-num: 14px font-weight 600 #a1a1aa
// - week-day-tasks: 11px #52525b

// .today: border 1px solid #f59e0b, bg rgba(245, 158, 11, 0.1)
//   - .week-day-num color white
// .has-tasks: bg rgba(59, 130, 246, 0.1)
//   - .week-day-num color #60a5fa

// week-legend: flex items-center gap-16 mt-12
// - legend-item: flex items-center gap-6, 11px #52525b
// - legend-dot: 8x8 rounded-full
//   - .today: bg #f59e0b
//   - .tasks: bg #3b82f6
```

### 11. ProgressCard.tsx

Circular progress ring with stats.

```tsx
interface ProgressCardProps {
  percentComplete: number;
  done: number;
  active: number;
  toTriage: number;
}

// Container (progress-card):
// - same card style as others, padding: 20px

// progress-title: 14px font-weight 600 white mb-16, "📊 Your Progress"

// progress-ring-container: flex justify-center mb-16

// SVG ring: 120x120 viewBox
// - progress-ring-bg: circle cx=60 cy=60 r=50
//   stroke: rgba(255,255,255,0.1), stroke-width: 8, fill: none
// - progress-ring-fill: same circle
//   stroke: url(#progressGradient) [green to teal gradient]
//   stroke-width: 8, fill: none
//   stroke-dasharray: 314, stroke-dashoffset: calculated based on %
//   transform: rotate(-90deg), transform-origin: center

// progress-ring-center (absolute positioned):
// - progress-ring-value: 28px font-weight 800 white
// - progress-ring-label: 11px #71717a

// progress-details: flex justify-around
// Each progress-detail:
// - text-align: center
// - value: 18px font-weight 700
//   - .success (Done): #22c55e
//   - Active: white
//   - To Triage: #818cf8
// - label: 11px #52525b
```

### 12. StreakBanner.tsx

Gamification streak banner.

```tsx
interface StreakBannerProps {
  days: number;
  message?: string;
}

// Container (streak-banner):
// - background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)
// - border: 1px solid rgba(245, 158, 11, 0.2), rounded-12, padding: 14px
// - flex items-center gap-12

// streak-icon: 28px emoji "🔥"

// streak-info: flex-1
// - streak-value: 16px font-weight 700 #f59e0b, "X Day Streak!"
// - streak-label: 12px #a1a1aa, "Complete 1 task daily to keep it going"
```

---

## Main Page Assembly

```tsx
// app/(app)/dashboard/tasks/page.tsx

export default async function TasksPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch family, profile, current week
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, family:families(*)')
    .eq('id', user.id)
    .single();
  
  const currentWeek = calculateCurrentWeek(profile.family.due_date);
  const daysToGo = calculateDaysToGo(profile.family.due_date);
  
  return (
    <TasksPageClient
      familyId={profile.family_id}
      userId={user.id}
      currentWeek={currentWeek}
      signupWeek={profile.signup_week || currentWeek}
      daysToGo={daysToGo}
    />
  );
}
```

```tsx
// components/tasks/TasksPageClient.tsx

'use client';

export function TasksPageClient({ familyId, userId, currentWeek, signupWeek, daysToGo }) {
  const { tasks, completeTask, triageTask, bulkTriage } = useTasks(familyId, currentWeek);
  const stats = useTaskStats(tasks, currentWeek);
  
  const [activeTab, setActiveTab] = useState('active');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatCard, setActiveStatCard] = useState<string | null>('dueToday');
  
  // Separate and filter tasks
  const { backlogTasks, thisWeekTasks, comingUpTasks, focusTask } = useMemo(() => {
    if (!tasks) return { backlogTasks: [], thisWeekTasks: [], comingUpTasks: [], focusTask: null };
    
    const backlog = tasks.filter(t => t.is_backlog && t.backlog_status === 'pending');
    const active = tasks.filter(t => !t.is_backlog && t.status === 'pending');
    
    // Apply filters...
    
    const thisWeek = active.filter(t => t.week_due === currentWeek);
    const comingUp = active.filter(t => t.week_due > currentWeek && t.week_due <= currentWeek + 4);
    const focus = thisWeek.find(t => t.priority === 'must-do') || thisWeek[0];
    
    return { backlogTasks: backlog, thisWeekTasks: thisWeek, comingUpTasks: comingUp, focusTask: focus };
  }, [tasks, activeTab, activeCategory, searchQuery, currentWeek]);

  return (
    <div className="main-content">
      <TasksHeader currentWeek={currentWeek} daysToGo={daysToGo} />
      
      {stats.catchUpQueue > 0 && (
        <CatchUpBanner
          tasksToReview={stats.catchUpQueue}
          percentDone={calculateTriagePercent(tasks)}
          signupWeek={signupWeek}
        />
      )}
      
      <StatsBar stats={stats} activeCard={activeStatCard} onCardClick={setActiveStatCard} />
      
      <FilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="content-layout">
        {/* Left: Task Sections */}
        <div className="task-sections">
          {backlogTasks.length > 0 && (
            <CatchUpSection
              tasks={backlogTasks}
              onTriage={triageTask}
              onBulkTriage={bulkTriage}
            />
          )}
          
          <TaskSection icon="📅" title="This Week" count={`${thisWeekTasks.length} tasks`}>
            {thisWeekTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                isHighlighted={task.week_due === currentWeek && task.priority === 'must-do'}
                onComplete={() => completeTask.mutate(task.id)}
              />
            ))}
          </TaskSection>
          
          <TaskSection
            icon="🔮"
            title="Coming Up"
            count={`Week ${currentWeek + 1}-${currentWeek + 4}`}
            actions={<span className="section-action">View all 47 →</span>}
          >
            {comingUpTasks.slice(0, 3).map(task => (
              <TaskItem key={task.id} task={task} dimmed />
            ))}
          </TaskSection>
        </div>
        
        {/* Right: Panel */}
        <div className="right-panel">
          <FocusCard
            task={focusTask}
            onDone={() => focusTask && completeTask.mutate(focusTask.id)}
            onSnooze={() => {/* snooze logic */}}
          />
          <WeekCalendarCard days={generateWeekDays(currentWeek)} />
          <ProgressCard
            percentComplete={stats.completed / (stats.total || 1) * 100}
            done={stats.completed}
            active={stats.thisWeek}
            toTriage={stats.catchUpQueue}
          />
          <StreakBanner days={3} />
        </div>
      </div>
    </div>
  );
}
```

---

## Responsive Behavior

```css
/* At smaller screens */
@media (max-width: 1400px) {
  .content-layout {
    grid-template-columns: 1fr 320px;
  }
}

@media (max-width: 1200px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
  
  .right-panel {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 900px) {
  .sidebar {
    display: none; /* or transform to mobile drawer */
  }
  
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-bar {
    flex-wrap: wrap;
  }
  
  .right-panel {
    grid-template-columns: 1fr;
  }
}
```

---

## Implementation Order

1. **Types & Utils** - task types, categorization logic
2. **Hooks** - useTasks, useTaskStats
3. **Sidebar** - Global layout component
4. **TasksHeader** - Simple, no dependencies
5. **StatsBar** - Stats display
6. **FilterBar** - Tab and filter UI
7. **TaskItem** - Regular task component
8. **TaskSection** - Container component
9. **CatchUpTaskItem** - Triage variant
10. **CatchUpSection** - Uses CatchUpTaskItem
11. **CatchUpBanner** - Uses stats
12. **FocusCard** - Right panel
13. **WeekCalendarCard** - Right panel
14. **ProgressCard** - SVG ring
15. **StreakBanner** - Simple
16. **TasksPageClient** - Assemble everything
17. **Triage Mode** - Full-screen experience (separate page)

---

## Key Interactions

1. **Clicking stat card** → Filters task list to that category
2. **Clicking tab** → Switches main view (Active, Catch-Up, etc.)
3. **Clicking category chip** → Filters by category
4. **Checkbox click** → Complete task (optimistic update)
5. **Triage button click** → Process backlog task, animate out
6. **"Continue Triage" button** → Navigate to /dashboard/tasks/triage
7. **Focus card "Done"** → Complete task, show next focus
8. **Week calendar day click** → Filter to that day's tasks

---

## Testing Checklist

- [ ] User at Week 1 (no backlog): No catch-up banner, no catch-up section
- [ ] User at Week 20 (with backlog): Banner shows, catch-up section shows
- [ ] Stat cards show correct counts
- [ ] Active stat card has amber highlight
- [ ] Tab switching filters correctly
- [ ] Category chip filtering works
- [ ] Search filters by title/description
- [ ] Task checkbox hover turns green
- [ ] Highlighted task has amber border
- [ ] Catch-up expired tasks are dimmed
- [ ] Triage buttons work correctly
- [ ] Focus card shows highest priority
- [ ] Week calendar highlights today
- [ ] Progress ring fills correctly
- [ ] Streak shows current streak count
- [ ] Responsive layout at breakpoints
