# Claude Code Prompt: Dashboard "Command Center" Implementation

## Reference

The exact design is in the HTML mockup file: `dashboard-v1-command-center.html`. This prompt provides implementation details matching that design precisely.

---

## Page Structure Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Sidebar 240px]  │  [Main Content]                                          │
│                  │                                                           │
│ 👶 ParentLogs    │  Good morning, Ashirbad 👋          [📅 Calendar][+ Quick]│
│                  │  Thursday, January 1, 2025 • 3 tasks need attention       │
│ 🏠 Home ●        │                                                           │
│ ✅ Tasks         │  ┌─────────────────────────┐ ┌─────────────────────────┐  │
│ 📅 Calendar      │  │ 🍋 Baby's Development   │ │ 💜 How Sarah Might Feel │  │
│ ⏱️ Tracker       │  │ Week 12 • First Tri     │ │ Common this week        │  │
│ 📖 Briefings     │  │ [Visual] Stats: 2.1"    │ │ [Symptoms] [Dad Tip]    │  │
│ 📚 Resources     │  └─────────────────────────┘ └─────────────────────────┘  │
│ 💰 Budget        │                                                           │
│ 📋 Checklists    │  ┌───────────────────────────────┐ ┌───────────────────┐  │
│ ⚙️ Settings      │  │ 🎯 Today's Priorities         │ │ ⏳ Countdown      │  │
│                  │  │ [Task 1 - urgent]             │ │ 189 days : 27 wks │  │
│                  │  │ [Task 2]                      │ ├───────────────────┤  │
│                  │  │ [Task 3]                      │ │ 📊 Progress       │  │
│                  │  │ View all tasks →              │ │ [Ring] 30%        │  │
│                  │  ├───────────────────────────────┤ ├───────────────────┤  │
│                  │  │ ⚡ Quick Actions              │ │ 👥 Partner        │  │
│                  │  │ [Add Task][Log][Event][$$]    │ │ Sarah • Synced    │  │
│                  │  ├───────────────────────────────┤ ├───────────────────┤  │
│                  │  │ 📅 Coming Up                  │ │ 📖 Week 12 Brief  │  │
│                  │  │ [Event 1] [Event 2]           │ │ The Safe Zone     │  │
│                  │  └───────────────────────────────┘ ├───────────────────┤  │
│                  │                                    │ 🏆 Achievement    │  │
│                  │                                    └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/
├── app/(app)/
│   └── dashboard/
│       └── page.tsx                    # Dashboard page (server component)
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx                 # Fixed left sidebar (shared)
│   └── dashboard/
│       ├── DashboardClient.tsx         # Main client component
│       ├── DashboardHeader.tsx         # Greeting + date + actions
│       ├── BabyDevelopmentCard.tsx     # Baby visual + stats
│       ├── MomStatusCard.tsx           # Symptoms + dad tip
│       ├── PriorityTasksCard.tsx       # Today's priority tasks
│       ├── QuickActionsBar.tsx         # Quick action buttons
│       ├── UpcomingEventsCard.tsx      # Calendar events preview
│       ├── CountdownCard.tsx           # Days/weeks to due date
│       ├── ProgressCard.tsx            # Circular progress ring
│       ├── PartnerActivityCard.tsx     # Partner sync status
│       ├── WeeklyBriefingCard.tsx      # Briefing preview
│       └── AchievementBanner.tsx       # Milestone celebration
├── hooks/
│   ├── useDashboardData.ts             # Fetch all dashboard data
│   └── usePregnancyWeek.ts             # Calculate current week
├── lib/
│   ├── pregnancy-utils.ts              # Week calculations, baby data
│   └── baby-development-data.ts        # Size comparisons, stats by week
└── types/
    └── dashboard.ts                    # Dashboard-specific types
```

---

## Types

```typescript
// types/dashboard.ts

export interface BabyDevelopment {
  week: number;
  trimester: 1 | 2 | 3;
  sizeComparison: string;      // "lime", "avocado", etc.
  sizeEmoji: string;           // 🍋
  lengthInches: number;
  weightOz: number;
  heartRateBpm: number;
  keyDevelopments: string[];   // ["Reflexes developing", "Can make sucking motions"]
}

export interface MomSymptom {
  name: string;
  isCommon: boolean;           // Highlighted if common this week
}

export interface DadTip {
  week: number;
  tip: string;
}

export interface PriorityTask {
  id: string;
  title: string;
  category: 'medical' | 'planning' | 'shopping' | 'financial' | 'partner';
  timeEstimate: string;        // "10 min", "1 hour"
  dueLabel: string;            // "Due today", "This week"
  isUrgent: boolean;
  isOverdue: boolean;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  icon: string;                // 🏥, 🎉, etc.
}

export interface PartnerActivity {
  name: string;
  initial: string;
  lastActive: string;          // "2 min ago"
  isSynced: boolean;
  recentTasks: Array<{
    title: string;
    status: 'completed' | 'in-progress';
    time: string;
  }>;
}

export interface WeeklyBriefing {
  week: number;
  title: string;               // "The Safe Zone"
  excerpt: string;
  isNew: boolean;
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
}

export interface DashboardData {
  user: {
    name: string;
    role: 'dad' | 'mom';
  };
  pregnancy: {
    currentWeek: number;
    dueDate: Date;
    daysToGo: number;
    weeksToGo: number;
  };
  baby: BabyDevelopment;
  momSymptoms: MomSymptom[];
  dadTip: DadTip;
  priorityTasks: PriorityTask[];
  taskStats: {
    completed: number;
    remaining: number;
    overdue: number;
  };
  upcomingEvents: UpcomingEvent[];
  partner: PartnerActivity;
  briefing: WeeklyBriefing;
  achievement: Achievement | null;
}
```

---

## Baby Development Data

```typescript
// lib/baby-development-data.ts

export const babyDevelopmentByWeek: Record<number, BabyDevelopment> = {
  4: {
    week: 4,
    trimester: 1,
    sizeComparison: "poppy seed",
    sizeEmoji: "🫛",
    lengthInches: 0.04,
    weightOz: 0.001,
    heartRateBpm: 0, // Not detectable yet
    keyDevelopments: ["Implantation complete", "Placenta forming"]
  },
  8: {
    week: 8,
    trimester: 1,
    sizeComparison: "raspberry",
    sizeEmoji: "🫐",
    lengthInches: 0.6,
    weightOz: 0.04,
    heartRateBpm: 150,
    keyDevelopments: ["All major organs forming", "Tiny fingers and toes"]
  },
  12: {
    week: 12,
    trimester: 1,
    sizeComparison: "lime",
    sizeEmoji: "🍋",
    lengthInches: 2.1,
    weightOz: 0.5,
    heartRateBpm: 165,
    keyDevelopments: ["Reflexes developing", "Can make sucking motions", "Miscarriage risk drops"]
  },
  16: {
    week: 16,
    trimester: 2,
    sizeComparison: "avocado",
    sizeEmoji: "🥑",
    lengthInches: 4.6,
    weightOz: 3.5,
    heartRateBpm: 150,
    keyDevelopments: ["Can hear sounds", "Growing hair", "Facial expressions"]
  },
  20: {
    week: 20,
    trimester: 2,
    sizeComparison: "banana",
    sizeEmoji: "🍌",
    lengthInches: 6.5,
    weightOz: 10.5,
    heartRateBpm: 140,
    keyDevelopments: ["Halfway point!", "Movements felt", "Anatomy scan time"]
  },
  // ... continue for all weeks
};

export const momSymptomsByWeek: Record<number, MomSymptom[]> = {
  12: [
    { name: "Morning sickness easing", isCommon: true },
    { name: "More energy returning", isCommon: true },
    { name: "Possible food aversions", isCommon: false },
    { name: "Mild headaches", isCommon: false },
  ],
  // ... continue for all weeks
};

export const dadTipsByWeek: Record<number, string> = {
  12: "Energy often returns in the 2nd trimester. This is a great time to plan a babymoon or tackle nursery projects together!",
  // ... continue for all weeks
};
```

---

## Components

### 1. Sidebar.tsx

Already exists - 240px fixed sidebar with navigation.

---

### 2. DashboardHeader.tsx

Greeting, date, overdue badge, and action buttons.

```tsx
interface DashboardHeaderProps {
  userName: string;
  overdueCount: number;
}

// Layout: flex justify-between items-start mb-32

// Left side (greeting):
// - h1: 32px font-weight 700 white
// - "Good morning, " + <span gradient orange>Name</span> + " 👋"
// - header-meta: flex items-center gap-16, 14px #71717a
//   - Date string: "Thursday, January 1, 2025"
//   - Overdue badge (if count > 0):
//     - bg: rgba(239, 68, 68, 0.15), color: #ef4444
//     - rounded-20, px-12 py-4, 13px font-weight 500
//     - Red dot before text (6x6 rounded-full)
//     - "X tasks need attention"

// Right side (header-actions):
// - flex gap-12
// - btn-secondary: bg rgba(255,255,255,0.06), border rgba(255,255,255,0.1)
//   "📅 Calendar"
// - btn-primary: gradient orange
//   "+ Quick Add"
```

---

### 3. BabyDevelopmentCard.tsx

Left hero card showing baby development.

```tsx
interface BabyDevelopmentCardProps {
  baby: BabyDevelopment;
}

// Container (baby-card):
// - background: linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)
// - border: 1px solid rgba(20, 184, 166, 0.2)
// - border-radius: 20px, padding: 28px
// - display: flex, gap: 24px

// baby-visual:
// - 140x140, rounded-full, flex-shrink-0
// - background: linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)
// - flex column centered
// - baby-emoji: 56px
// - baby-size: 13px #14b8a6 font-weight 600 (e.g., "Size of a lime")

// baby-info:
// - flex: 1
// - h2: 20px font-weight 700 white mb-4, "Baby's Development"
// - week-label: 14px #14b8a6 font-weight 600 mb-16
//   "Week X of 40 • First Trimester" (or Second/Third)

// baby-stats grid:
// - grid-cols-3 gap-16
// - Each baby-stat:
//   - bg: rgba(0,0,0,0.2), padding: 12px, rounded-12
//   - value: 18px font-weight 700 white
//   - label: 11px #71717a mt-2
// - Stats: Length (X"), Weight (X oz), Heart (💓 X BPM)
```

---

### 4. MomStatusCard.tsx

Right hero card showing mom's status.

```tsx
interface MomStatusCardProps {
  partnerName: string;
  symptoms: MomSymptom[];
  dadTip: string;
}

// Container (mom-card):
// - background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 63, 94, 0.05) 100%)
// - border: 1px solid rgba(236, 72, 153, 0.2)
// - border-radius: 20px, padding: 28px

// mom-header: flex items-center gap-12 mb-20
// - mom-icon: 48x48 rounded-12, gradient pink, centered 24px emoji 💜
// - h2: 18px font-weight 700 white, "How {Name} Might Feel"
// - p: 13px #f472b6, "Common this week"

// mom-symptoms: flex flex-wrap gap-8 mb-20
// - Each symptom-tag:
//   - bg: rgba(255,255,255,0.06), px-12 py-6, rounded-20
//   - 12px #a1a1aa
//   - .common variant: bg rgba(236, 72, 153, 0.15), color #f472b6

// mom-tip box:
// - bg: rgba(0,0,0,0.2), rounded-12, padding: 16px
// - mom-tip-label: 11px font-weight 600 #f472b6 uppercase letter-spacing 0.5 mb-6
//   "💡 Dad Tip"
// - mom-tip-text: 14px #e4e4e7 line-height 1.5
```

---

### 5. PriorityTasksCard.tsx

Today's priority tasks list.

```tsx
interface PriorityTasksCardProps {
  tasks: PriorityTask[];
  onComplete: (taskId: string) => void;
  onSnooze: (taskId: string) => void;
}

// Container (priority-card):
// - Standard card style, rounded-20, padding: 24px

// priority-header: flex items-center justify-between mb-20
// - priority-title: flex items-center gap-10, 16px font-weight 600 white
//   "🎯 Today's Priorities"
// - priority-count: bg rgba(245, 158, 11, 0.15), color #f59e0b
//   px-10 py-4, rounded-20, 12px font-weight 600
//   "X tasks"

// priority-tasks: flex flex-col gap-12
// Each priority-task:
// - flex items-center gap-16, padding: 16px
// - bg: rgba(255,255,255,0.02), border: 1px solid rgba(255,255,255,0.04)
// - rounded-14, cursor-pointer
// - hover: bg rgba(255,255,255,0.04), border-color rgba(255,255,255,0.08)
// - .urgent variant: border-color rgba(239, 68, 68, 0.3), bg rgba(239, 68, 68, 0.05)

// task-checkbox: 24x24, border 2px #52525b, rounded-8
// - hover: border #22c55e, bg rgba(34, 197, 94, 0.1)

// task-content: flex-1
// - task-title: 15px font-weight 600 #e4e4e7 mb-4
// - task-meta: flex items-center gap-12, 12px #71717a
//   - task-tag: px-8 py-2, rounded-6, 11px font-weight 500
//     - .medical: bg rgba(239, 68, 68, 0.15), color #f87171
//     - .planning: bg rgba(168, 85, 247, 0.15), color #c084fc
//     - .shopping: bg rgba(59, 130, 246, 0.15), color #60a5fa
//   - Time estimate: "⏱️ X min"
//   - Due label: "Due today" in #ef4444 if urgent

// task-actions: flex gap-8
// - task-action-btn: 36x36 rounded-10, bg rgba(255,255,255,0.06)
//   - Complete (✓): hover green
//   - Snooze (→): hover default

// view-all-link at bottom:
// - flex items-center justify-center gap-8, padding: 14px
// - border-top: 1px solid rgba(255,255,255,0.04), margin-top: 12px
// - 14px #71717a font-weight 500, hover: #f59e0b
// - "View all tasks →"
```

---

### 6. QuickActionsBar.tsx

Row of quick action buttons.

```tsx
// Container (quick-actions):
// - Standard card style, rounded-20, padding: 20px

// quick-actions-title: 14px font-weight 600 #a1a1aa mb-16
// "⚡ Quick Actions"

// quick-actions-grid: grid grid-cols-4 gap-12

// Each quick-action:
// - flex flex-col items-center gap-10, padding: 20px 16px
// - bg: rgba(255,255,255,0.02), border: 1px solid rgba(255,255,255,0.04)
// - rounded-14, cursor-pointer
// - hover: bg rgba(255,255,255,0.05), border-color rgba(255,255,255,0.1)
//   transform: translateY(-2px)

// quick-action-icon: 48x48 rounded-14, centered, 24px emoji
// - .teal: bg rgba(20, 184, 166, 0.15)
// - .purple: bg rgba(168, 85, 247, 0.15)
// - .blue: bg rgba(59, 130, 246, 0.15)
// - .amber: bg rgba(245, 158, 11, 0.15)

// quick-action-label: 13px font-weight 500 #a1a1aa

// Actions:
// 1. 📝 Add Task (teal)
// 2. 📊 Log Data (purple)
// 3. 📅 Add Event (blue)
// 4. 💰 Log Expense (amber)
```

---

### 7. UpcomingEventsCard.tsx

Calendar events preview.

```tsx
interface UpcomingEventsCardProps {
  events: UpcomingEvent[];
}

// Container: Standard card style

// card-header: flex items-center justify-between mb-16
// - card-title: 14px font-weight 600 white, "📅 Coming Up"
// - card-action: 12px #71717a, hover #f59e0b, "View calendar →"

// upcoming-list: flex flex-col gap-12

// Each upcoming-item:
// - flex items-center gap-14, padding: 14px
// - bg: rgba(255,255,255,0.02), rounded-12

// upcoming-date: text-align center, min-width 48px
// - day: 20px font-weight 700 white
// - month: 10px #71717a uppercase

// upcoming-info: flex-1
// - title: 14px font-weight 500 #e4e4e7
// - type: 12px #71717a (time + location)

// upcoming-icon: 36x36 rounded-10, bg rgba(20, 184, 166, 0.15), centered 16px
```

---

### 8. CountdownCard.tsx

Days/weeks countdown to due date.

```tsx
interface CountdownCardProps {
  daysToGo: number;
  weeksToGo: number;
  dueDate: Date;
}

// Container (countdown-card):
// - background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)
// - border: 1px solid rgba(245, 158, 11, 0.2)

// card-header: card-title "⏳ Countdown to Due Date"

// countdown-display: flex items-center justify-center gap-20 mb-16
// - Each countdown-item: text-align center
//   - value: 36px font-weight 800 white
//   - label: 11px #71717a uppercase
// - countdown-separator: 28px #52525b, ":"

// Display: [189 Days] : [27 Weeks]

// countdown-date: text-align center, 13px #a1a1aa
// "Due <strong style='color: #f59e0b'>July 9, 2025</strong>"
```

---

### 9. ProgressCard.tsx

Circular progress ring with stats.

```tsx
interface ProgressCardProps {
  completed: number;
  remaining: number;
  overdue: number;
  percentComplete: number;
}

// card-header: card-title "📊 Your Progress"

// progress-visual: flex items-center gap-16 mb-16

// progress-ring: position relative, 80x80
// - SVG with gradient stroke
// - stroke-dasharray: 226, stroke-dashoffset: calculated
// - Center overlay: value (18px font-weight 700) + label (9px #71717a)

// progress-stats: flex-1
// - Each progress-stat: flex justify-between, padding 8px 0
//   border-bottom: 1px solid rgba(255,255,255,0.04)
// - label: 13px #71717a
// - value: 13px font-weight 600
//   - .success: #22c55e (completed)
//   - .warning: #f59e0b (overdue)
//   - default: white (remaining)
```

---

### 10. PartnerActivityCard.tsx

Partner sync status and recent activity.

```tsx
interface PartnerActivityCardProps {
  partner: PartnerActivity;
}

// card-header: card-title "👥 Partner Activity"

// partner-status: flex items-center gap-12 mb-16 pb-16
//   border-bottom: 1px solid rgba(255,255,255,0.04)

// partner-avatar: 44x44 rounded-12, gradient pink, centered initial
// partner-info: flex-1
// - name: 15px font-weight 600 white
// - last-active: 12px #71717a

// sync-indicator: flex items-center gap-6, 12px #22c55e
// - sync-dot: 8x8 rounded-full #22c55e, pulse animation
// - "Synced"

// partner-tasks: flex flex-col gap-10
// Each partner-task:
// - flex items-center gap-12, padding: 12px
// - bg: rgba(255,255,255,0.02), rounded-10
// - status icon: 20x20 rounded-full, bg rgba(236, 72, 153, 0.15)
//   - ✓ for completed, → for in-progress
// - title: 13px #a1a1aa flex-1
// - time: 11px #52525b
```

---

### 11. WeeklyBriefingCard.tsx

Briefing preview with link.

```tsx
interface WeeklyBriefingCardProps {
  briefing: WeeklyBriefing;
}

// Container (briefing-card):
// - background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)
// - border-color: rgba(99, 102, 241, 0.2)

// card-header:
// - card-title: "📖 Week X Briefing"
// - card-action: "New!" badge if isNew

// briefing-preview mb-16:
// - briefing-title: 16px font-weight 600 white mb-8
// - briefing-excerpt: 13px #a1a1aa line-height 1.5

// briefing-link: flex items-center gap-8
// - 13px font-weight 500 #818cf8, hover #a5b4fc
// - "Read full briefing →"
```

---

### 12. AchievementBanner.tsx

Milestone celebration banner.

```tsx
interface AchievementBannerProps {
  achievement: Achievement;
}

// Container (achievement-banner):
// - background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)
// - border: 1px solid rgba(34, 197, 94, 0.2)
// - rounded-14, padding: 16px
// - flex items-center gap-14

// achievement-icon: 32px emoji (🏆)

// achievement-content: flex-1
// - title: 14px font-weight 600 #4ade80
// - desc: 12px #86efac
```

---

## Page Assembly

```tsx
// app/(app)/dashboard/page.tsx

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch profile with family
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, family:families(*)')
    .eq('id', user.id)
    .single();
  
  // Calculate pregnancy data
  const currentWeek = calculateCurrentWeek(profile.family.due_date);
  const daysToGo = calculateDaysToGo(profile.family.due_date);
  const weeksToGo = Math.floor(daysToGo / 7);
  
  return (
    <DashboardClient
      userId={user.id}
      familyId={profile.family_id}
      userName={profile.first_name}
      partnerName={profile.family.partner_name || "Partner"}
      currentWeek={currentWeek}
      dueDate={profile.family.due_date}
      daysToGo={daysToGo}
      weeksToGo={weeksToGo}
    />
  );
}
```

```tsx
// components/dashboard/DashboardClient.tsx

'use client';

export function DashboardClient(props) {
  const { dashboardData, isLoading } = useDashboardData(props.familyId, props.currentWeek);
  
  const baby = babyDevelopmentByWeek[props.currentWeek] || babyDevelopmentByWeek[12];
  const symptoms = momSymptomsByWeek[props.currentWeek] || [];
  const dadTip = dadTipsByWeek[props.currentWeek] || "";

  return (
    <main className="main-content">
      {/* Header */}
      <DashboardHeader
        userName={props.userName}
        overdueCount={dashboardData?.taskStats.overdue || 0}
      />
      
      {/* Hero Section */}
      <section className="hero-section">
        <BabyDevelopmentCard baby={baby} />
        <MomStatusCard
          partnerName={props.partnerName}
          symptoms={symptoms}
          dadTip={dadTip}
        />
      </section>
      
      {/* Main Grid */}
      <div className="main-grid">
        {/* Left Column */}
        <div className="left-column">
          <PriorityTasksCard
            tasks={dashboardData?.priorityTasks || []}
            onComplete={handleComplete}
            onSnooze={handleSnooze}
          />
          <QuickActionsBar />
          <UpcomingEventsCard events={dashboardData?.upcomingEvents || []} />
        </div>
        
        {/* Right Column */}
        <div className="right-column">
          <CountdownCard
            daysToGo={props.daysToGo}
            weeksToGo={props.weeksToGo}
            dueDate={new Date(props.dueDate)}
          />
          <ProgressCard
            completed={dashboardData?.taskStats.completed || 0}
            remaining={dashboardData?.taskStats.remaining || 0}
            overdue={dashboardData?.taskStats.overdue || 0}
            percentComplete={calculatePercent(dashboardData?.taskStats)}
          />
          <PartnerActivityCard partner={dashboardData?.partner} />
          <WeeklyBriefingCard briefing={dashboardData?.briefing} />
          {dashboardData?.achievement && (
            <AchievementBanner achievement={dashboardData.achievement} />
          )}
        </div>
      </div>
    </main>
  );
}
```

---

## Layout CSS Structure

```css
/* Main content area */
.main-content {
  flex: 1;
  margin-left: 240px;  /* Sidebar width */
  padding: 32px 40px;
  max-width: 1600px;
}

/* Hero section - 2 equal columns */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

/* Main grid - content + right panel */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
```

---

## Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1200px) {
  .hero-section {
    grid-template-columns: 1fr;
  }
  
  .main-grid {
    grid-template-columns: 1fr;
  }
  
  .right-column {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .right-column {
    grid-template-columns: 1fr;
  }
}
```

---

## Data Fetching Hook

```typescript
// hooks/useDashboardData.ts

export function useDashboardData(familyId: string, currentWeek: number) {
  const supabase = createClient();
  
  return useQuery({
    queryKey: ['dashboard', familyId],
    queryFn: async () => {
      // Fetch priority tasks (today + overdue)
      const { data: tasks } = await supabase
        .from('family_tasks')
        .select('*')
        .eq('family_id', familyId)
        .eq('status', 'pending')
        .lte('week_due', currentWeek)
        .order('priority', { ascending: false })
        .limit(5);
      
      // Fetch task stats
      const { data: allTasks } = await supabase
        .from('family_tasks')
        .select('status, week_due')
        .eq('family_id', familyId);
      
      const stats = {
        completed: allTasks?.filter(t => t.status === 'completed').length || 0,
        remaining: allTasks?.filter(t => t.status === 'pending').length || 0,
        overdue: allTasks?.filter(t => 
          t.status === 'pending' && t.week_due < currentWeek
        ).length || 0,
      };
      
      // Fetch upcoming events
      const { data: events } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('family_id', familyId)
        .gte('date', new Date().toISOString())
        .order('date')
        .limit(3);
      
      // Fetch briefing
      const briefing = {
        week: currentWeek,
        title: weeklyBriefings[currentWeek]?.title || "This Week",
        excerpt: weeklyBriefings[currentWeek]?.excerpt || "",
        isNew: true, // Logic to determine if unread
      };
      
      // Partner activity (would need partner profile)
      const partner = {
        name: "Sarah",
        initial: "S",
        lastActive: "2 min ago",
        isSynced: true,
        recentTasks: [
          { title: "Booked OB appointment", status: 'completed', time: "Today" },
          { title: "Research maternity leave", status: 'in-progress', time: "This week" },
        ]
      };
      
      // Check for achievements
      const achievement = currentWeek === 12 ? {
        title: "First Trimester Complete!",
        description: "You've hit a major milestone",
        icon: "🏆"
      } : null;
      
      return {
        priorityTasks: tasks?.map(t => ({
          id: t.id,
          title: t.title,
          category: t.category,
          timeEstimate: formatTime(t.time_estimate_minutes),
          dueLabel: getDueLabel(t.week_due, currentWeek),
          isUrgent: t.week_due <= currentWeek,
          isOverdue: t.week_due < currentWeek,
        })) || [],
        taskStats: stats,
        upcomingEvents: events || [],
        partner,
        briefing,
        achievement,
      };
    }
  });
}
```

---

## Implementation Order

1. **Types & Data** - Dashboard types, baby development data
2. **Utility Functions** - Week calculations, date formatting
3. **useDashboardData Hook** - Data fetching
4. **DashboardHeader** - Simple, no dependencies
5. **BabyDevelopmentCard** - Uses static baby data
6. **MomStatusCard** - Uses static symptom data
7. **CountdownCard** - Simple calculations
8. **ProgressCard** - SVG ring
9. **PriorityTasksCard** - Uses task data
10. **QuickActionsBar** - Static buttons
11. **UpcomingEventsCard** - Uses event data
12. **PartnerActivityCard** - Uses partner data
13. **WeeklyBriefingCard** - Uses briefing data
14. **AchievementBanner** - Conditional display
15. **DashboardClient** - Assemble everything
16. **Dashboard Page** - Server component wrapper

---

## Testing Checklist

- [ ] Greeting shows correct time of day (morning/afternoon/evening)
- [ ] User name displays correctly
- [ ] Overdue badge shows correct count (hidden if 0)
- [ ] Baby card shows correct week data (size, weight, heart rate)
- [ ] Mom card shows correct symptoms for current week
- [ ] Dad tip displays for current week
- [ ] Priority tasks show max 3-5 tasks
- [ ] Urgent/overdue tasks highlighted correctly
- [ ] Quick actions open correct modals/pages
- [ ] Countdown calculates correctly from due date
- [ ] Progress ring fills to correct percentage
- [ ] Partner activity shows recent tasks
- [ ] Briefing card shows current week content
- [ ] Achievement banner appears at milestones (Week 12, 20, 28, etc.)
- [ ] "View all tasks" links to /dashboard/tasks
- [ ] "View calendar" links to /dashboard/calendar
- [ ] Responsive layout works at all breakpoints
- [ ] Loading states display correctly
