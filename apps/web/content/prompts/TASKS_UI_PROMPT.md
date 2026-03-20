# Claude Code Prompt: Tasks Page UI with Catch-Up System

## Prerequisites
- Database schema is set up with catch-up fields (is_backlog, backlog_status, triage_action, etc.)
- Run the DATABASE_CATCHUP_SYSTEM_PROMPT first if not done

## Overview

Build a complete Tasks page with smart catch-up handling for late signups. Reference the mockups:
- Main tasks page: Shows stats, filters, task sections, and catch-up banner
- Triage mode: Full-screen focused experience for quickly triaging backlog tasks

## File Structure

```
src/
├── app/(app)/dashboard/tasks/
│   ├── page.tsx                    # Main tasks page
│   └── triage/
│       └── page.tsx                # Full-screen triage mode
├── components/tasks/
│   ├── TasksPage.tsx               # Main container component
│   ├── TaskStatsBar.tsx            # Top stats (Due Today, This Week, etc.)
│   ├── TaskFilters.tsx             # Filter tabs + category chips + search
│   ├── TaskSection.tsx             # Collapsible section (This Week, Coming Up, etc.)
│   ├── TaskItem.tsx                # Individual task card
│   ├── TaskQuickActions.tsx        # Hover actions (complete, snooze, reassign)
│   ├── CatchUpBanner.tsx           # "Let's get you caught up" banner
│   ├── CatchUpSection.tsx          # Backlog tasks section with triage buttons
│   ├── CatchUpTaskItem.tsx         # Task with inline triage buttons
│   ├── TodaysFocus.tsx             # Right panel - highlighted priority task
│   ├── WeekMiniCalendar.tsx        # Right panel - week view
│   ├── TaskProgress.tsx            # Right panel - circular progress
│   ├── StreakBanner.tsx            # Right panel - gamification
│   ├── TriageMode.tsx              # Full-screen triage experience
│   └── TriageTaskCard.tsx          # Card shown in triage mode
├── hooks/
│   ├── useTasks.ts                 # Fetch & mutate tasks
│   ├── useTaskStats.ts             # Calculate stats
│   └── useTaskTriage.ts            # Triage mode state
└── lib/
    ├── task-utils.ts               # Helper functions
    └── task-categories.ts          # Category config (colors, icons)
```

## Core Types

```typescript
// types/tasks.ts

export type TaskStatus = 'pending' | 'completed' | 'skipped' | 'snoozed';
export type TaskCategory = 'medical' | 'shopping' | 'planning' | 'financial' | 'partner' | 'self_care';
export type TaskAssignee = 'mom' | 'dad' | 'both';
export type TaskPriority = 'must-do' | 'good-to-do';
export type BacklogStatus = 'pending' | 'triaged';
export type TriageAction = 'completed' | 'added' | 'skipped';

// Computed category for backlog tasks
export type BacklogCategory = 'still_relevant' | 'window_passed' | 'probably_done';

export interface FamilyTask {
  id: string;
  family_id: string;
  template_id: string | null;
  title: string;
  description: string | null;
  why_it_matters: string | null;
  due_date: string | null;
  week_due: number | null;
  assigned_to: TaskAssignee;
  completed_by: string | null;
  completed_at: string | null;
  status: TaskStatus;
  snoozed_until: string | null;
  category: TaskCategory;
  priority: TaskPriority;
  time_estimate_minutes: number | null;
  is_custom: boolean;
  notes: string | null;
  // Catch-up fields
  is_backlog: boolean;
  backlog_status: BacklogStatus | null;
  triage_action: TriageAction | null;
  triage_date: string | null;
  // Joined from template (if needed)
  is_time_sensitive?: boolean;
  window_weeks?: number;
  commonly_completed_early?: boolean;
}

export interface TaskStats {
  dueToday: number;
  thisWeek: number;
  completed: number;
  partnerTasks: number;
  catchUpQueue: number;  // Pending backlog tasks
}
```

## Category Configuration

```typescript
// lib/task-categories.ts

export const categoryConfig: Record<string, {
  icon: string;
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  medical: {
    icon: '🏥',
    label: 'Medical',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-400',
    borderClass: 'border-red-500/30'
  },
  shopping: {
    icon: '🛒',
    label: 'Shopping',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30'
  },
  planning: {
    icon: '📋',
    label: 'Planning',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30'
  },
  financial: {
    icon: '💰',
    label: 'Financial',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-400',
    borderClass: 'border-green-500/30'
  },
  partner: {
    icon: '💬',
    label: 'Partner',
    bgClass: 'bg-pink-500/10',
    textClass: 'text-pink-400',
    borderClass: 'border-pink-500/30'
  },
  self_care: {
    icon: '🧘',
    label: 'Self Care',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30'
  }
};

export const backlogCategoryConfig: Record<BacklogCategory, {
  label: string;
  bgClass: string;
  textClass: string;
  description: string;
  suggestedAction: TriageAction;
}> = {
  still_relevant: {
    label: 'Still Relevant',
    bgClass: 'bg-green-500/15',
    textClass: 'text-green-400',
    description: 'You can still do this! We recommend adding it to your list.',
    suggestedAction: 'added'
  },
  window_passed: {
    label: 'Window Passed',
    bgClass: 'bg-zinc-500/15',
    textClass: 'text-zinc-400',
    description: 'This was time-sensitive and the window has closed.',
    suggestedAction: 'skipped'
  },
  probably_done: {
    label: 'Probably Done?',
    bgClass: 'bg-purple-500/15',
    textClass: 'text-purple-400',
    description: 'Most people complete this early. Did you already do this?',
    suggestedAction: 'completed'
  }
};
```

## Backlog Categorization Logic

```typescript
// lib/task-utils.ts

export function categorizeBacklogTask(
  task: FamilyTask,
  currentWeek: number
): BacklogCategory {
  const weeksPastDue = currentWeek - (task.week_due || 0);
  
  // Time-sensitive with closed window
  if (task.is_time_sensitive && weeksPastDue > (task.window_weeks || 4)) {
    return 'window_passed';
  }
  
  // Common early tasks
  if (task.commonly_completed_early && (task.week_due || 0) < 12) {
    return 'probably_done';
  }
  
  return 'still_relevant';
}

export function getTriageContextMessage(
  task: FamilyTask,
  category: BacklogCategory,
  currentWeek: number
): string {
  const weeksPast = currentWeek - (task.week_due || 0);
  
  switch (category) {
    case 'window_passed':
      return `This was scheduled for Week ${task.week_due}, which was ${weeksPast} weeks ago. Since it was time-sensitive, the window has passed. You can safely skip this.`;
    case 'probably_done':
      return `This is typically one of the first things parents do. We're just confirming you've got this covered!`;
    case 'still_relevant':
      return weeksPast <= 4
        ? `This was scheduled for Week ${task.week_due}, just ${weeksPast} weeks ago. You still have plenty of time!`
        : `Originally scheduled for Week ${task.week_due}, but there's no deadline. We recommend adding it to your active list.`;
  }
}
```

## Data Fetching Hook

```typescript
// hooks/useTasks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { FamilyTask, TriageAction } from '@/types/tasks';

export function useTasks(familyId: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', familyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('family_tasks')
        .select(`
          *,
          template:task_templates(
            is_time_sensitive,
            window_weeks,
            commonly_completed_early
          )
        `)
        .eq('family_id', familyId)
        .order('week_due', { ascending: true });
      
      if (error) throw error;
      
      // Flatten template fields
      return data.map(task => ({
        ...task,
        is_time_sensitive: task.template?.is_time_sensitive || false,
        window_weeks: task.template?.window_weeks || 4,
        commonly_completed_early: task.template?.commonly_completed_early || false,
      })) as FamilyTask[];
    }
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('family_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] })
  });

  const snoozeTask = useMutation({
    mutationFn: async ({ taskId, until }: { taskId: string; until: string }) => {
      const { error } = await supabase
        .from('family_tasks')
        .update({
          status: 'snoozed',
          snoozed_until: until
        })
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] })
  });

  const triageTask = useMutation({
    mutationFn: async ({ taskId, action }: { taskId: string; action: TriageAction }) => {
      const updates: any = {
        backlog_status: 'triaged',
        triage_action: action,
        triage_date: new Date().toISOString()
      };
      
      if (action === 'completed') {
        updates.status = 'completed';
        updates.completed_at = new Date().toISOString();
      } else if (action === 'added') {
        updates.is_backlog = false;
      }
      // 'skipped' just marks as triaged, stays hidden
      
      const { error } = await supabase
        .from('family_tasks')
        .update(updates)
        .eq('id', taskId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] })
  });

  const bulkTriage = useMutation({
    mutationFn: async ({ taskIds, action }: { taskIds: string[]; action: TriageAction }) => {
      const updates: any = {
        backlog_status: 'triaged',
        triage_action: action,
        triage_date: new Date().toISOString()
      };
      
      if (action === 'completed') {
        updates.status = 'completed';
        updates.completed_at = new Date().toISOString();
      } else if (action === 'added') {
        updates.is_backlog = false;
      }
      
      const { error } = await supabase
        .from('family_tasks')
        .update(updates)
        .in('id', taskIds);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] })
  });

  return {
    tasks: tasksQuery.data,
    isLoading: tasksQuery.isLoading,
    completeTask,
    snoozeTask,
    triageTask,
    bulkTriage
  };
}
```

## Stats Calculation Hook

```typescript
// hooks/useTaskStats.ts

import { useMemo } from 'react';
import { FamilyTask, TaskStats } from '@/types/tasks';

export function useTaskStats(tasks: FamilyTask[] | undefined, currentWeek: number): TaskStats {
  return useMemo(() => {
    if (!tasks) {
      return { dueToday: 0, thisWeek: 0, completed: 0, partnerTasks: 0, catchUpQueue: 0 };
    }

    const activeTasks = tasks.filter(t => !t.is_backlog);
    const backlogTasks = tasks.filter(t => t.is_backlog && t.backlog_status === 'pending');

    return {
      dueToday: activeTasks.filter(t => 
        t.status === 'pending' && t.week_due === currentWeek
      ).length,
      thisWeek: activeTasks.filter(t => 
        t.status === 'pending' && 
        t.week_due !== null && 
        t.week_due >= currentWeek && 
        t.week_due <= currentWeek + 1
      ).length,
      completed: tasks.filter(t => t.status === 'completed').length,
      partnerTasks: activeTasks.filter(t => 
        t.assigned_to === 'partner' && t.status === 'pending'
      ).length,
      catchUpQueue: backlogTasks.length
    };
  }, [tasks, currentWeek]);
}
```

## Key Components

### CatchUpBanner.tsx

Shows when user has pending backlog tasks. Displays:
- Icon (🚀)
- Title: "Let's get you caught up!"
- Description: "You joined at Week X — we've identified Y tasks from earlier weeks..."
- Progress: X of Y reviewed, with progress bar
- CTA button: "Continue Triage →" (links to /dashboard/tasks/triage)

Design: Purple/indigo gradient background, rounded-2xl, prominent but not alarming.

### CatchUpSection.tsx

Collapsible section in main task list showing backlog tasks. Features:
- Header: "📥 Catch-Up Queue" with count badge
- Subtitle: "Tasks from Weeks 1-X • Review and triage quickly"
- Bulk actions: "✓ Mark All Done", "Skip All", "Quick Triage Mode"
- List of CatchUpTaskItem components

### CatchUpTaskItem.tsx

Each backlog task shows:
- Title + backlog category badge (Still Relevant / Window Passed / Probably Done?)
- Description (truncated)
- Category tag + original week
- Quick action buttons: "✓ Already did" | "+ Add to list" | "Skip"

Expired tasks (window_passed) should appear grayed out and not show "Add to list" button.

### TriageMode.tsx (Full-screen)

A focused triage experience at `/dashboard/tasks/triage`:
- Clean, centered layout
- Progress bar at top (X of Y reviewed)
- One task card at a time with:
  - Week badge + category badge
  - Title (large)
  - Description
  - Meta (category, time estimate)
  - Context box explaining "Why we're asking"
- Three big action buttons: Done | Add | Skip
- Keyboard shortcuts (D, A, S, ← for undo)
- Queue preview showing next 3-4 tasks
- "Exit & finish later" link

### TaskStatsBar.tsx

Row of clickable stat cards:
- 🎯 Due Today (amber if > 0)
- 📅 This Week
- ✅ Completed (green)
- 👥 Partner's
- 📥 Catch-Up Queue (indigo, only shows if > 0)

Clicking a stat filters the list. Active stat has highlighted border.

### TaskItem.tsx

Regular task card showing:
- Checkbox (left)
- Content: Title, badges (Must Do / Nice to Have), description, meta row
- Meta row: Category tag, time estimate, due date, assignee avatar
- Hover actions: Complete, Snooze, Reassign

### TodaysFocus.tsx (Right panel)

Highlights the single most important task:
- "🎯 Today's Focus" header
- Task title + description
- "Why it matters" box
- Time estimate
- Big action buttons: "✓ Done" | "→ Tomorrow"

### TaskProgress.tsx (Right panel)

Shows overall progress:
- Circular progress ring (% complete)
- Stats grid: Done | Active | To Triage
- Optional: Streak banner ("🔥 7 Day Streak!")

## Page Layout

### Main Tasks Page

```
┌─────────────────────────────────────────────────────────────┐
│ Header: "Tasks" + subtitle + actions                        │
├─────────────────────────────────────────────────────────────┤
│ [CatchUpBanner - only if catchUpQueue > 0]                  │
├─────────────────────────────────────────────────────────────┤
│ [StatsBar: Due Today | This Week | Completed | Partner | Queue] │
├─────────────────────────────────────────────────────────────┤
│ [FilterBar: Tabs + Category Chips + Search]                 │
├───────────────────────────────────────┬─────────────────────┤
│ Main Column (flex-1)                  │ Right Panel (380px) │
│                                       │                     │
│ [CatchUpSection - if has backlog]     │ [TodaysFocus]       │
│                                       │                     │
│ [TaskSection: This Week]              │ [WeekMiniCalendar]  │
│   - TaskItem                          │                     │
│   - TaskItem                          │ [TaskProgress]      │
│   - TaskItem                          │                     │
│                                       │ [StreakBanner]      │
│ [TaskSection: Coming Up]              │                     │
│   - TaskItem (dimmed)                 │                     │
│   - TaskItem (dimmed)                 │                     │
│                                       │                     │
└───────────────────────────────────────┴─────────────────────┘
```

### Triage Mode Page

```
┌─────────────────────────────────────────────────────────────┐
│                        Logo + Title                          │
│                    "Quick Triage Mode"                       │
├─────────────────────────────────────────────────────────────┤
│                   [Progress Bar: X of Y]                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   TASK CARD                          │    │
│  │  Week 14 • Still Relevant                            │    │
│  │                                                      │    │
│  │  Research pediatricians in your area                 │    │
│  │                                                      │    │
│  │  Interview at least 3 pediatricians...               │    │
│  │                                                      │    │
│  │  📋 Planning • ⏱️ 2 hours                            │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │ 💡 Why we're asking                          │   │    │
│  │  │ This was scheduled for Week 14...            │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│    [✓ Already Did]    [+ Add to List]    [→ Skip]           │
├─────────────────────────────────────────────────────────────┤
│              [D] Done  [A] Add  [S] Skip  [←] Undo          │
├─────────────────────────────────────────────────────────────┤
│  Coming up next...                     Exit & finish later  │
│  10. Start thinking about baby names        [Still Rel.]    │
│  11. Schedule NIPT test                     [Expired]       │
│  12. Order pregnancy pillow                 [Still Rel.]    │
└─────────────────────────────────────────────────────────────┘
```

## Styling Guidelines

- Dark theme: bg-zinc-950, cards bg-zinc-800/900
- Accent colors: Amber/orange for primary actions, Indigo for catch-up
- Category colors as defined in categoryConfig
- Rounded corners: rounded-xl for cards, rounded-lg for buttons
- Subtle borders: border-white/[0.06]
- Hover states: bg-white/[0.03] or bg-white/5
- Animations: Use framer-motion for card transitions in triage mode

## Implementation Order

1. Types and utilities (task-utils.ts, task-categories.ts)
2. Data hooks (useTasks.ts, useTaskStats.ts)
3. Basic components (TaskItem, TaskSection)
4. Stats and filters (TaskStatsBar, TaskFilters)
5. Catch-up components (CatchUpBanner, CatchUpSection, CatchUpTaskItem)
6. Right panel (TodaysFocus, TaskProgress, WeekMiniCalendar)
7. Main page assembly
8. Triage mode (TriageMode, TriageTaskCard)
9. Animations and polish

## Testing

- [ ] New user at Week 1: No catch-up banner/section
- [ ] User at Week 20: Shows catch-up banner with correct count
- [ ] Triage "Already Did" → Marks complete, removes from queue
- [ ] Triage "Add to List" → Moves to active tasks
- [ ] Triage "Skip" → Removes from queue (doesn't show anywhere)
- [ ] "Mark All Done" bulk action works
- [ ] Keyboard shortcuts in triage mode (D, A, S)
- [ ] Stats update correctly after actions
- [ ] Filter tabs work correctly
- [ ] Mobile responsive (stack layout, hide right panel)
