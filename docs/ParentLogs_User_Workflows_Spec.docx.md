

**PARENTLOGS**

User Workflows Specification

Version 2.0 — March 2, 2026

**Status: APPROVED**

*Built for dads. Works for both.*

**KEY DECISIONS SUMMARY**

| Area | Decision |
| :---- | :---- |
| Onboarding | 4 screens to dashboard (\~45 seconds). Dad profile deferred to dashboard card. |
| Dashboard | Single unified feed. No tabs. Cards ordered by daily priority. |
| Navigation | Home | Tasks | Briefing | Tracker | More. Calendar removed. |
| Briefings | Dedicated bottom nav tab. Inline task completion. Week-to-week navigation. |
| Mom Experience | Coordination-focused. Partner Activity card replaces mood check-in. |
| Mid-Pregnancy Catch-Up | 2-bucket triage: auto-handled \+ catch-up. Yellow badges, not red. |
| Free-to-Premium | 3-phase journey: invisible (D1-7), visible (D8-21), urgent (D22+). |

**1\. ONBOARDING FLOW**

# **1\. Onboarding Flow**

The onboarding flow is optimized for speed-to-value. Users reach the dashboard in 4 screens and approximately 45 seconds. All personalization and partner invite steps are deferred to the dashboard as dismissible cards.

## **1.1 Dad Onboarding (Primary User)**

| Step | Screen | Duration | Data Collected |
| :---- | :---- | :---- | :---- |
| 1 | Welcome \+ Sign Up (combined) | \~30s | Email/password or Google OAuth |
| 2 | Role Selection | \~5s | Dad / Mom / Other (auto-advances on tap) |
| 3 | Family Setup | \~15s | Expecting vs Baby Here, due/birth date, baby name (optional) |
| 4 | Preview \+ Transition | \~5s | None (shows generated content while tasks load in background) |

**Screen 1: Welcome \+ Sign Up (Combined)**

Value proposition is above the fold alongside the signup form. Google OAuth is the primary path (single tap). The tagline reads: "Built for dads. Works for both." No separate splash screen. The login link for returning users sits at the bottom.

**Screen 2: Role Selection**

Three large tappable cards: Dad, Mom, Other. Tapping a card auto-advances to the next screen with no separate Continue button required. This feels decisive and saves one interaction.

**Screen 3: Family Setup**

A toggle between "Expecting" (shows due date picker) and "Baby is here" (shows birth date picker). The baby name field is clearly optional. This screen drives everything downstream: task generation, briefing phase, challenge tile content.

**Screen 4: Preview \+ Transition**

Displays a dynamic value preview while task generation runs in the background. Shows real numbers: "56 tasks loaded," "This week’s briefing: Viability Week," "7 challenge guides tailored to your stage." The Go to Dashboard button enables when generation completes (typically under 2 seconds).

## **1.2 Mom Onboarding (Invited Partner)**

Mom joins via an invite link shared by the dad. Her flow is even leaner because family data already exists.

| Step | Screen | Notes |
| :---- | :---- | :---- |
| 1 | Join Link Landing Page | "\[Partner name\] invited you to ParentLogs" |
| 2 | Sign Up (or Log In) | Same combined welcome \+ auth screen |
| 3 | Role Selection | Picks Mom or Other |
| 4 | Dashboard | Lands directly. Family data inherited from partner. |

Three screens to dashboard. No family setup, no personalization prompts, no task generation wait.

## **1.3 Deferred Elements**

Three items were moved out of onboarding to reduce friction. Each surfaces on the dashboard with clear trigger, placement, and dismissal patterns.

**Partner Invite Card**

* Placement: Action section of unified dashboard, below briefing teaser

* Appears: Immediately on first dashboard load. Persists until partner joins or user dismisses.

* Dismissal: "Not now" hides for 7 days, then resurfaces. "I’m doing this solo" dismisses permanently.

* Paywall note: Partner invite is premium. Free users tapping "Share" see the upgrade modal. This is better than gating it during onboarding because they’ve now seen the app’s value.

**Dad Personalize Card**

* Placement: Top of the "On Your Mind" section on the dashboard (dads only)

* Appears: First dashboard visit. Disappears after completion.

* Opens: A single combined screen with work situation, first-time dad, and top concerns (pick up to 3\)

* Cut from V1: Support system questions (relationship status, family nearby, dad friends). Mood check-in situation flags capture this data organically over time.

**Task Generation**

* No screen needed. Generation fires when user submits Family Setup, runs in background, and completes by the time they reach the dashboard.

**2\. NAVIGATION ARCHITECTURE**

# **2\. Navigation Architecture**

Every core content feature is reachable in 2 taps maximum on mobile. Utility features (settings, profile, help) can be deeper. Navigation is role-agnostic; content within pages is role-aware.

## **2.1 Mobile Bottom Navigation (5 Items)**

| Position | Label | Icon | Destination |
| :---- | :---- | :---- | :---- |
| 1 | Home | House | /dashboard — Unified feed |
| 2 | Tasks | Check-square | /tasks — Task list with list/calendar view toggle |
| 3 | Briefing | Book | /briefing — Current week’s briefing |
| 4 | Tracker | Baby | /tracker — Baby log entry \+ shift briefing |
| 5 | More | Menu | Drawer: Checklists, Budget, Family, Settings |

Calendar was removed from the bottom nav. It is now a view toggle within the Tasks page (list view vs calendar view). Briefings replaced it as the dedicated retention feature.

## **2.2 More Drawer Structure**

The More drawer is organized into three sections: Tools, Family, and Account.

**Tools Section:**

* Checklists (with total count badge, e.g., "15 total")

* Budget Planner (with upcoming count, e.g., "3 upcoming")

**Family Section:**

* Invite Partner (paywall trigger for free users)

* Family Settings

**Account Section:**

* Settings

* Upgrade to Premium (or "Manage Subscription" for premium users)

* Help & Support

* Sign Out

## **2.3 Desktop Sidebar**

On screens wider than 768px, the bottom nav is replaced by a sidebar that mirrors the same hierarchy. Dashboard, Tasks, Briefing, and Baby Tracker are primary items. Checklists and Budget appear under a "Tools" separator. Invite Partner appears under a "Family" separator. Settings and Upgrade sit at the bottom near the user avatar.

## **2.4 Header (All Platforms)**

The header contains: the app logo (taps to dashboard), a week indicator showing the current pregnancy/baby week (taps to briefing as a shortcut), a notification bell with badge (premium only; free users see upgrade prompt), and a profile avatar (opens dropdown with Settings, Subscription, Sign Out).

## **2.5 Complete Route Map**

| Route | Page | Access |
| :---- | :---- | :---- |
| / | Marketing/landing page | Public |
| /login | Login | Public |
| /signup | Sign up (combined welcome \+ auth) | Public |
| /forgot-password | Password reset request | Public |
| /reset-password | Password reset form | Public |
| /join/:inviteCode | Partner join flow | Public |
| /onboarding/role | Role selection | Auth, no family |
| /onboarding/family | Due date / birth date entry | Auth, no family |
| /onboarding/ready | Preview \+ transition | Auth, no family |
| /onboarding/personalize | Dad profile (from dashboard card) | Auth \+ family |
| /dashboard | Unified feed dashboard | Auth \+ family |
| /journey | Full My Journey page (7 tiles \+ mood) | Auth \+ family |
| /tasks | Task list (list view default) | Auth \+ family |
| /tasks?view=calendar | Task list (calendar view toggle) | Auth \+ family |
| /tasks/:taskId | Task detail | Auth \+ family |
| /briefing | Current week’s briefing | Auth \+ family |
| /briefing/:weekId | Specific week’s briefing | Auth \+ family |
| /tracker | Baby tracker home | Auth \+ family |
| /tracker/log/:type | Log entry form | Auth \+ family |
| /tracker/history | Full log history (premium) | Auth \+ family |
| /tracker/summary | Daily/weekly summaries (premium) | Auth \+ family |
| /checklists | All checklists | Auth \+ family |
| /checklists/:id | Single checklist | Auth \+ family |
| /budget | Budget planner | Auth \+ family |
| /settings | Settings hub | Auth \+ family |
| /settings/profile | Edit profile | Auth \+ family |
| /settings/family | Family settings | Auth \+ family |
| /settings/notifications | Notification prefs (premium) | Auth \+ family |
| /settings/subscription | Manage subscription | Auth \+ family |
| /upgrade | Premium upgrade page | Auth \+ family |

**3\. DASHBOARD STRUCTURE**

# **3\. Dashboard Structure**

The dashboard is a single unified feed with no tabs. Cards are ordered by daily priority and conditionally shown based on context (pregnancy vs post-birth, role, time of day, task status).

## **3.1 Card Priority Order (Dad)**

| Priority | Card | Shows When | Hides When |
| :---- | :---- | :---- | :---- |
| 1 | Mood Check-in | Not checked in today | Collapses to compact bar after check-in |
| 2 | Shift Briefing | Post-birth \+ partner logged today | Pre-birth, no tracker data |
| 3 | Briefing Teaser | Always | Never (always relevant) |
| 4 | Tasks Due This Week | Has tasks in next 7 days | All tasks completed (shows "All caught up\!") |
| 5 | On Your Mind (2 tiles) | Dad role selected | Mom/Other role |
| 6 | Quick Actions | Post-birth always; pregnancy if tracker enabled | — |
| 7 | Personalize Card | Dad \+ hasn’t completed profile | After profile completed |
| 7 | Invite Partner | No partner \+ not dismissed | Partner joined or "doing this solo" |
| 8 | Budget Snapshot | Upcoming items in next 4 weeks | No upcoming items |
| 9 | Checklist Progress | Active in-progress checklist | No active checklists |

The dashboard naturally gets shorter as users engage. A fully set-up user with partner joined, profile complete, mood checked in, and no overdue tasks might see only 5-6 cards. A new user sees 8-9.

## **3.2 Desktop Layout**

On desktop (\>768px), the unified feed uses a two-column layout to reduce scroll depth. Left column: briefing teaser, On Your Mind tiles, invite partner card. Right column: tasks due, quick actions, budget snapshot, checklist progress. Mood check-in and shift briefing span full width above both columns.

The On Your Mind section shows 2 challenge tiles on desktop (1 on mobile) with a "See all 7 challenges" link to /journey.

## **3.3 The /journey Page**

When the user taps "See all 7 challenges," they navigate to /journey, a full-page experience with mood history at the top followed by all 7 expandable challenge tiles for their current phase. Each tile expands in-place with the full narrative (500-1000 words), action items, and dad quotes. This page is the deep-dive; the dashboard card is the teaser.

**4\. BRIEFINGS PLACEMENT & FLOW**

# **4\. Briefings Placement & Flow**

Briefings are the primary retention hook. They have a dedicated slot in the bottom navigation and a rich, magazine-style reading experience.

## **4.1 Reading Experience**

When a user taps the Briefing tab, they see a single scrollable page for the current week. The content sections, in order: week title and stage context, Baby This Week (developmental update), How Mom’s Doing (physical and emotional changes), Your Focus This Week (3 specific action items for dad), Relationship Check-in (one practical tip), Coming Up Next Week (preview of what’s ahead), Linked Tasks (completable inline), and Source attribution.

**Inline Task Completion:** Users can check off linked tasks directly from the briefing page without switching to the Tasks tab. This connects the "why" (briefing context) to the "what" (task action) in one place.

## **4.2 Week Navigation**

Navigation between weeks uses left/right arrows at the top of the briefing page (swipe also works on mobile). Tapping the week indicator opens a timeline overlay showing all weeks grouped by trimester/stage, with the current week highlighted and locked weeks showing a lock icon for free users.

## **4.3 Paywall Integration**

Free users see the current week plus 3 prior weeks in full. Week 5+ from signup shows title only with an "Upgrade to read full briefing" prompt. The timeline overlay shows all briefing titles (creating FOMO) but locks content beyond the free window. Past week archives are premium-only.

## **4.4 Dashboard Connection**

The Briefing Teaser card on the dashboard shows the week title, a 2-line preview, and a "Read full briefing" link. It is a pointer to the Briefing tab, not the content itself.

**5\. MOM’S EXPERIENCE**

# **5\. Mom’s Experience**

Mom’s primary value from the app is coordination and visibility: shared tasks, baby tracker, shift briefings, and seeing what dad is doing. Her experience focuses on practical tools rather than parallel emotional content.

## **5.1 Dashboard Differences**

| Card | Dad Sees | Mom Sees |
| :---- | :---- | :---- |
| Position 1 | Mood Check-in | Partner Activity Card |
| Position 5 | On Your Mind (challenge tiles) | Not shown |
| Personalize Card | Dad profile questions | Not shown |
| Invite Partner | Shown if no partner | Not shown (she IS the partner) |
| Everything else | Identical | Identical |

## **5.2 Partner Activity Card**

Replaces the mood check-in at the top of mom’s dashboard. Shows partner’s recent activity: tasks completed, briefings read, baby logs entered, and last active timestamp. Reinforces the "neutral third party" principle by showing what dad has done without mom needing to ask.

## **5.3 Shared Content**

Briefings: Mom sees the exact same briefings as dad. The content already includes mom-specific sections (baby update, mom update, dad focus). When both parents read the same briefing, they share context for the week. Tasks: Identical experience. Tasks assigned to Mom, Dad, or Both. She sees her tasks, his tasks, and shared tasks. Navigation: Identical bottom nav, More drawer, sidebar, header. Role-agnostic.

## **5.4 The "Other" Role**

For V1, the "Other" role gets the mom experience (practical tools, partner activity, no dad-specific emotional content). This covers non-traditional family structures without making assumptions.

**6\. MID-PREGNANCY CATCH-UP UX**

# **6\. Mid-Pregnancy Catch-Up UX**

Users who sign up mid-journey face a backlog of tasks with due dates that have already passed. The smart catch-up system ensures their first experience is empowering rather than overwhelming.

## **6.1 The Two-Bucket Triage System**

| Bucket | Contains | UI Treatment | User Action |
| :---- | :---- | :---- | :---- |
| Auto-Handled | Expired tasks (medical window closed) \+ tasks that are almost certainly already done (e.g., select OB at week 28\) | Grouped as "X tasks auto-sorted." Greyed out, collapsed. | One-tap "Looks right" to dismiss, or expand to un-skip individual items |
| Catch-Up | Tasks still actionable even though past original due date | Yellow "Catch up" badge (not red "Overdue"). Shown as prioritized section in task list. | Complete normally. Urgent items flagged. |

## **6.2 Task Template Metadata**

Each task template requires a new catch\_up\_behavior field with value "expired", "likely\_done", or "catch\_up". During task generation, all tasks with due dates before signup date are triaged into the two buckets (expired and likely\_done merge into auto-handled).

## **6.3 Example: Week 28 Signup**

A user signing up at Week 28 has 17 pre-signup pregnancy tasks. Triage result: 8 auto-handled (4 expired medical windows \+ 4 likely already done) and 9 catch-up tasks (daycare waitlist, pediatrician research, budget planning, etc.).

## **6.4 Dashboard Catch-Up Card**

On first dashboard load, a special "Welcome to Your Timeline" card replaces the normal tasks card. Shows three stats: auto-handled count, catch-up count, and upcoming task count. The card persists for 3 days, then catch-up tasks move exclusively to the Tasks tab.

## **6.5 Onboarding Preview Adaptation**

The preview screen (Onboarding Screen 4\) adapts for mid-pregnancy signups. Instead of just showing "56 tasks loaded," it shows "32 tasks loaded through baby’s first year" plus "17 earlier tasks sorted — we’ll help you catch up." This sets expectations before the dashboard.

**7\. FREE-TO-PREMIUM UPGRADE JOURNEY**

# **7\. Free-to-Premium Upgrade Journey**

The upgrade journey follows three phases designed around conversion psychology: let users experience value before showing limitations.

## **7.1 Three Phases**

| Phase | Timeframe | Strategy | User Experience |
| :---- | :---- | :---- | :---- |
| Invisible | Days 1-7 | Let users explore freely within free tier limits | Rich free content: 14-day task window, 4 briefings, 10 checklists, 3 tracker types. Paywalls exist but feel like edges, not walls. |
| Visible | Days 8-21 | User starts hitting limits naturally | Locked content becomes noticeable. Can’t invite partner. Sees briefing titles they can’t read. Each paywall plants a seed. |
| Urgent | Days 22+ | Free briefing window closing, value gap undeniable | Briefing paywall is the highest-conversion moment. Loss aversion kicks in. $49.99/year feels justified by accumulated usage. |

## **7.2 Paywall Modal (Consistent Design)**

Every paywall trigger opens the same modal component with context-specific headline and body copy but an identical feature list and pricing display. This consistency builds familiarity. The headline changes per context (e.g., "Unlock your complete timeline" for tasks, "Continue your weekly briefings" for briefings). The feature list always shows the full premium package. Annual plan ($49.99/year) is the primary CTA. Monthly ($5.99) is secondary text. "Maybe later" dismisses cleanly with no guilt.

## **7.3 Free vs Premium Comparison**

| Feature | Free | Premium |
| :---- | :---- | :---- |
| Tasks | Next 14 days only | Full 2-3 year timeline \+ snooze, custom, assign |
| Briefings | First 4 weeks from signup | All weeks through Year 2 \+ archives |
| Checklists | 10 safety essentials | All 25+ including travel, lifestyle, career |
| Baby Tracker Logs | Feed, diaper, sleep | All types (temp, weight, mood, custom) |
| Tracker History | Today only | Full history \+ daily/weekly summaries |
| Partner Sync | Not available | Full: shared tasks, logs, shift briefings |
| Budget Tracker | 2nd trimester view-only | Full timeline \+ editing |
| Push Notifications | None | Task reminders, briefing alerts, partner activity |

## **7.4 Soft Upgrade Prompts**

Two non-blocking dashboard cards appear at strategic moments:

**Prompt 1 (Day 14):** Personalized usage stats. "You’ve completed 8 tasks and read 2 briefings. Unlock everything: partner sync, full timeline, push notifications, and more." Dismissible.

**Prompt 2 (Day \~28):** Briefing cutoff. "Your free briefings have ended. Week 29: Breech Position is ready — upgrade to keep reading." The specific next briefing title creates targeted curiosity. This is the highest-converting moment.

## **7.5 Post-Purchase Experience**

After payment, a celebration screen shows what just unlocked with specific numbers ("187 additional tasks now visible"). The primary CTA is "Invite your partner now" to ride purchase enthusiasm into the viral loop. Secondary CTA goes to dashboard.

## **7.6 Edge Cases**

* Subscription lapses: 7-day grace period after failed payment. Data retained, access reverts to free tier. Partner sees "Subscription lapsed — contact \[primary user\] to restore."

* Cross-platform: RevenueCat syncs subscription state. Web purchase unlocks mobile and vice versa.

* Partner subscribes: Prompted to have primary user subscribe, or option to become new primary subscriber.

* Pre-paywall conversion: "Upgrade" item in More drawer and Settings serves users who want to subscribe proactively.

**8\. NOTIFICATION SYSTEM**

# **8\. Notification System**

Push notifications are premium-only. Free users receive zero notifications, which serves as both a cost-reduction measure and an upgrade forcing function.

## **8.1 Notification Types (Premium Only)**

| Type | Trigger | Who Receives | Copy Principle |
| :---- | :---- | :---- | :---- |
| Task Reminder | 7 days before \+ 1 day before due | Assigned user | "Car seat installation is due this week" |
| Task Completed | Partner completes a task | Other partner | "Ashirbad completed: Research pediatricians" |
| New Week Briefing | Monday morning (configurable) | Both parents | "Week 24 Briefing: Viability Week is ready" |
| Baby Log Update | Partner logs event | Other partner (optional) | "Sarah logged a feeding: 4oz at 2:15 PM" |
| Partner Joined | Partner accepts invite | Original user | "Sarah has joined your family\!" |

## **8.2 Neutral Third Party Principle**

All notifications come from "the app" as a neutral authority, never implying one partner assigned work to another. Good: "Car seat installation is due this week." Bad: "Your partner wants you to install the car seat."

**APPENDIX: DESIGN PRINCIPLES**

# **Design Principles**

**1\. Speed to Value.** Users should see personalized, useful content within 60 seconds of opening the app for the first time.

**2\. Neutral Third Party.** The app is the authority, not either partner. Tasks are auto-assigned. Notifications come from the system.

**3\. Yellow, Not Red.** Frame catch-up tasks as empowering ("catch up") rather than punitive ("overdue"). Frame limitations as edges, not walls.

**4\. One Subscription Per Family.** Both partners share access. No per-user pricing to avoid friction on the core partner sync feature.

**5\. Four-Level Attention Hierarchy.** 3-second notifications, 90-second briefings, 2-5 minute tasks, on-demand articles. Design for busy parents.

**6\. Role-Agnostic Navigation, Role-Aware Content.** Navigation structure is identical for all users. Dashboard cards and content change based on role.