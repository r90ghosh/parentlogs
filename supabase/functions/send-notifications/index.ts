import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "https://esm.sh/web-push@3.6.6";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;
const vapidEmail = Deno.env.get("VAPID_EMAIL") || "mailto:info@thedadcenter.com";

webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Types ---

interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  actions?: Array<{ action: string; title: string }>;
}

// --- Frequency Cap Configuration ---

const FREQUENCY_CAPS = { hourly: 1, daily: 3, weekly: 10 };
// Notification types that bypass push frequency caps (real-time, high-priority)
const BYPASS_FREQUENCY_CAP = new Set(["partner_activity"]);

/**
 * Check if a user has exceeded push frequency caps.
 * Single query — fetches up to 10 recent sends and counts client-side.
 */
async function checkPushFrequencyCap(userId: string): Promise<boolean> {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const { data: recentSends } = await supabase
    .from("notification_delivery_log")
    .select("created_at")
    .eq("user_id", userId)
    .in("channel", ["web_push", "expo_push"])
    .eq("status", "sent")
    .gte("created_at", oneWeekAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(FREQUENCY_CAPS.weekly);

  if (!recentSends?.length) return true;

  // Weekly cap: 10
  if (recentSends.length >= FREQUENCY_CAPS.weekly) return false;

  // Daily cap: 3
  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const todaySends = recentSends.filter((s) => new Date(s.created_at) >= startOfDay);
  if (todaySends.length >= FREQUENCY_CAPS.daily) return false;

  // Hourly cap: 1
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const hourSends = recentSends.filter((s) => new Date(s.created_at) >= oneHourAgo);
  if (hourSends.length >= FREQUENCY_CAPS.hourly) return false;

  return true;
}

/**
 * Log a push delivery attempt to notification_delivery_log.
 */
async function logDelivery(
  userId: string,
  channel: "web_push" | "expo_push" | "email",
  status: "sent" | "failed" | "invalid_token" | "throttled",
  errorMessage?: string,
  tokenId?: string
): Promise<void> {
  try {
    await supabase.from("notification_delivery_log").insert({
      user_id: userId,
      channel,
      status,
      error_message: errorMessage || null,
      token_id: tokenId || null,
    });
  } catch (err) {
    console.error("Failed to log delivery:", err);
  }
}

// --- Main Handler ---

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!supabaseServiceKey || authHeader !== `Bearer ${supabaseServiceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { type } = body;

    switch (type) {
      case "daily_digest":
        await sendDailyDigest();
        break;
      case "task_reminder":
        await sendTaskReminders();
        break;
      case "overdue_alert":
        await sendOverdueAlerts();
        break;
      case "weekly_briefing":
        await sendWeeklyBriefingAlerts();
        break;
      case "milestone":
        await sendMilestoneNotifications();
        break;
      case "onboarding_nudge":
        await sendOnboardingNudges();
        break;
      case "mood_reminder":
        await sendMoodReminders();
        break;
      case "re_engagement":
        await sendReEngagementNotifications();
        break;
      case "celebration":
        await sendCelebrationNotifications();
        break;
      case "push_window_warning":
        await sendPushWindowWarnings();
        break;
      case "onboarding_drip":
        await sendOnboardingDripEmails();
        break;
      case "monthly_backlog_digest":
        await sendMonthlyBacklogDigest();
        break;
      // 'direct' type only sends push — callers persist the in-app notification themselves.
      case "direct": {
        const { user_id, title, body: messageBody, url, notification_type: directType } = body;

        // Validate user_id is a valid UUID
        const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!user_id || typeof user_id !== "string" || !UUID_RE.test(user_id)) {
          return new Response(JSON.stringify({ error: "Invalid or missing user_id — must be a valid UUID" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Validate title and body are non-empty strings
        if (!title || typeof title !== "string" || !title.trim()) {
          return new Response(JSON.stringify({ error: "title is required and must be a non-empty string" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (!messageBody || typeof messageBody !== "string" || !messageBody.trim()) {
          return new Response(JSON.stringify({ error: "body is required and must be a non-empty string" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        // Audit log
        const callerIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
        console.log(`[direct-push] user_id=${user_id} type=${directType || "partner_activity"} caller_ip=${callerIp}`);

        await sendPushNotification(user_id, { title, body: messageBody, url }, directType || "partner_activity");
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Unknown notification type" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending notifications:", error instanceof Error ? error.message : "Unknown error");
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// --- Notification Type Handlers ---

async function sendDailyDigest() {
  const { data: prefsWithProfiles } = await supabase
    .from("notification_preferences")
    .select("user_id, quiet_hours_start, quiet_hours_end, profiles!inner(family_id, timezone)")
    .or("task_reminders_7_day.eq.true,task_reminders_3_day.eq.true,task_reminders_1_day.eq.true");

  if (!prefsWithProfiles?.length) return;

  const familyIds = [
    ...new Set(
      prefsWithProfiles
        .map((p) => (p.profiles as unknown as { family_id: string | null }).family_id)
        .filter(Boolean) as string[]
    ),
  ];

  if (!familyIds.length) return;

  // Scope the daily digest to the week ahead. Anything older than `today` is
  // backlog — surfaced in the monthly digest, not the daily one.
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const weekAheadDate = new Date(now);
  weekAheadDate.setUTCDate(weekAheadDate.getUTCDate() + 7);
  const weekAhead = weekAheadDate.toISOString().split("T")[0];

  const { data: allTasks } = await supabase
    .from("family_tasks")
    .select("*")
    .in("family_id", familyIds)
    .eq("status", "pending")
    .gte("due_date", today)
    .lte("due_date", weekAhead);

  const tasksByFamily = (allTasks || []).reduce((acc, task) => {
    if (!acc[task.family_id]) acc[task.family_id] = [];
    acc[task.family_id].push(task);
    return acc;
  }, {} as Record<string, typeof allTasks>);

  for (const pref of prefsWithProfiles) {
    const profileData = pref.profiles as unknown as { family_id: string | null; timezone: string | null };
    const familyId = profileData.family_id;
    if (!familyId) continue;
    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end, profileData.timezone || "UTC")) continue;

    const familyTasks = tasksByFamily[familyId];
    if (!familyTasks?.length) continue;

    const dueToday = familyTasks.filter((t) => t.due_date === today);
    const count = familyTasks.length;
    const mustDoCount = familyTasks.filter((t) => t.priority === "must-do").length;

    const title = dueToday.length
      ? `${dueToday.length} task${dueToday.length > 1 ? "s" : ""} today · ${count} this week`
      : `${count} task${count > 1 ? "s" : ""} this week`;
    const body = mustDoCount > 0
      ? `${mustDoCount} must-do${mustDoCount > 1 ? "s" : ""}. Plan your week.`
      : "Here's what's on deck.";

    const dailyPayload: NotificationPayload = {
      title,
      body,
      url: "/tasks",
      tag: "daily-digest",
    };
    await persistNotification(pref.user_id, "daily_digest", dailyPayload);
    await sendPushNotification(pref.user_id, dailyPayload, "daily_digest");
  }
}

/**
 * Monthly backlog digest — fires on the 1st of each month (see cron).
 * Surfaces all still-pending tasks with due_date < today so users can triage.
 * Daily digest stays focused on the week ahead; this is the catch-all nudge.
 */
async function sendMonthlyBacklogDigest() {
  const { data: prefsWithProfiles } = await supabase
    .from("notification_preferences")
    .select("user_id, monthly_backlog_digest, quiet_hours_start, quiet_hours_end, profiles!inner(family_id, timezone)")
    .eq("monthly_backlog_digest", true);

  if (!prefsWithProfiles?.length) return;

  const familyIds = [
    ...new Set(
      prefsWithProfiles
        .map((p) => (p.profiles as unknown as { family_id: string | null }).family_id)
        .filter(Boolean) as string[]
    ),
  ];

  if (!familyIds.length) return;

  const today = new Date().toISOString().split("T")[0];
  const { data: backlogTasks } = await supabase
    .from("family_tasks")
    .select("family_id, priority")
    .in("family_id", familyIds)
    .eq("status", "pending")
    .lt("due_date", today);

  const tasksByFamily = (backlogTasks || []).reduce((acc, task) => {
    if (!acc[task.family_id]) acc[task.family_id] = [];
    acc[task.family_id].push(task);
    return acc;
  }, {} as Record<string, typeof backlogTasks>);

  for (const pref of prefsWithProfiles) {
    const profileData = pref.profiles as unknown as { family_id: string | null; timezone: string | null };
    const familyId = profileData.family_id;
    if (!familyId) continue;
    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end, profileData.timezone || "UTC")) continue;

    const familyTasks = tasksByFamily[familyId];
    if (!familyTasks?.length) continue;

    const count = familyTasks.length;
    const mustDoCount = familyTasks.filter((t) => t.priority === "must-do").length;

    const backlogPayload: NotificationPayload = {
      title: `${count} task${count > 1 ? "s" : ""} in your backlog`,
      body: mustDoCount > 0
        ? `${mustDoCount} must-do${mustDoCount > 1 ? "s" : ""}. Catch up or dismiss.`
        : "Catch up or dismiss — your call.",
      url: "/tasks",
      tag: "backlog-digest",
    };
    await persistNotification(pref.user_id, "backlog_digest", backlogPayload);
    await sendPushNotification(pref.user_id, backlogPayload, "backlog_digest");
  }
}

async function sendTaskReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const { data: tasks } = await supabase
    .from("family_tasks")
    .select("*")
    .eq("status", "pending")
    .eq("due_date", tomorrowStr)
    .eq("priority", "must-do");

  if (!tasks?.length) return;

  const tasksByFamily = tasks.reduce((acc, task) => {
    if (!acc[task.family_id]) acc[task.family_id] = [];
    acc[task.family_id].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const familyIds = Object.keys(tasksByFamily);

  const { data: allMembers } = await supabase
    .from("profiles")
    .select("id, family_id")
    .in("family_id", familyIds);

  if (!allMembers?.length) return;

  const memberIds = allMembers.map((m) => m.id);
  const { data: allPrefs } = await supabase
    .from("notification_preferences")
    .select("user_id, task_reminders_1_day, quiet_hours_start, quiet_hours_end, profiles!inner(timezone)")
    .in("user_id", memberIds);

  const prefsMap = new Map((allPrefs || []).map((p) => [p.user_id, p]));

  for (const member of allMembers) {
    const pref = prefsMap.get(member.id);
    if (!pref?.task_reminders_1_day) continue;
    const tz = (pref.profiles as unknown as { timezone: string | null })?.timezone || "UTC";
    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end, tz)) continue;

    const familyTasks = tasksByFamily[member.family_id];
    if (!familyTasks?.length) continue;

    const count = familyTasks.length;
    const taskPayload: NotificationPayload = {
      title: `${count} must-do task${count > 1 ? "s" : ""} due tomorrow`,
      body: "Plan ahead tonight.",
      url: "/tasks",
      tag: "task-reminder",
    };
    await persistNotification(member.id, "task_reminder", taskPayload);
    await sendPushNotification(member.id, taskPayload, "task_reminder");
  }
}

async function sendOverdueAlerts() {
  const today = new Date().toISOString().split("T")[0];

  const { data: tasks } = await supabase
    .from("family_tasks")
    .select("*")
    .eq("status", "pending")
    .eq("priority", "must-do")
    .lt("due_date", today);

  if (!tasks?.length) return;

  const tasksByFamily = tasks.reduce((acc, task) => {
    if (!acc[task.family_id]) acc[task.family_id] = [];
    acc[task.family_id].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const familyIds = Object.keys(tasksByFamily);

  const { data: allMembers } = await supabase
    .from("profiles")
    .select("id, family_id")
    .in("family_id", familyIds);

  if (!allMembers?.length) return;

  const memberIds = allMembers.map((m) => m.id);
  const { data: allPrefs } = await supabase
    .from("notification_preferences")
    .select("user_id, task_reminders_1_day, quiet_hours_start, quiet_hours_end, profiles!inner(timezone)")
    .in("user_id", memberIds);

  const prefsMap = new Map((allPrefs || []).map((p) => [p.user_id, p]));

  for (const member of allMembers) {
    const pref = prefsMap.get(member.id);
    if (!pref?.task_reminders_1_day) continue;
    const tz = (pref.profiles as unknown as { timezone: string | null })?.timezone || "UTC";
    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end, tz)) continue;

    const familyTasks = tasksByFamily[member.family_id];
    if (!familyTasks?.length) continue;

    const count = familyTasks.length;
    const overduePayload: NotificationPayload = {
      title: `${count} overdue must-do task${count > 1 ? "s" : ""}`,
      body: "Catch up before they pile up.",
      url: "/tasks",
      tag: "overdue-alert",
    };
    await persistNotification(member.id, "overdue_alert", overduePayload);
    await sendPushNotification(member.id, overduePayload, "overdue_alert");

    // Also send overdue digest email (send-email checks email_task_digest preference)
    await sendEmailNotification(member.id, "overdue_digest", { count });
  }
}

async function sendWeeklyBriefingAlerts() {
  const { data: families } = await supabase.from("families").select("id, current_week").limit(500);

  if (!families?.length) return;

  const familyIds = families.map((f) => f.id);
  const familyWeekMap = new Map(families.map((f) => [f.id, f.current_week]));

  const { data: allMembers } = await supabase
    .from("profiles")
    .select("id, family_id")
    .in("family_id", familyIds);

  if (!allMembers?.length) return;

  const memberIds = allMembers.map((m) => m.id);
  const { data: allPrefs } = await supabase
    .from("notification_preferences")
    .select("user_id, weekly_briefing, quiet_hours_start, quiet_hours_end, profiles!inner(timezone)")
    .in("user_id", memberIds)
    .eq("weekly_briefing", true);

  const prefsMap = new Map((allPrefs || []).map((p) => [p.user_id, p]));

  for (const member of allMembers) {
    const pref = prefsMap.get(member.id);
    if (!pref) continue;
    const tz = (pref.profiles as unknown as { timezone: string | null })?.timezone || "UTC";
    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end, tz)) continue;

    const currentWeek = familyWeekMap.get(member.family_id);

    const briefingPayload: NotificationPayload = {
      title: `Week ${currentWeek} briefing ready`,
      body: "New developments and tasks this week.",
      url: "/briefing",
      tag: "weekly-briefing",
    };
    await persistNotification(member.id, "weekly_briefing", briefingPayload);
    await sendPushNotification(member.id, briefingPayload, "weekly_briefing");

    // Also send weekly briefing email (send-email checks email_weekly_briefing preference)
    await sendEmailNotification(member.id, "weekly_briefing", { week: currentWeek });
  }
}

// --- Milestone Notifications ---

const PREGNANCY_MILESTONES: Record<number, { title: string; body: string }> = {
  12: { title: "First trimester done", body: "Miscarriage risk just dropped significantly." },
  20: { title: "Halfway there", body: "Anatomy scan week. Major checkpoint." },
  24: { title: "Viability milestone", body: "A significant medical milestone reached." },
  28: { title: "Third trimester", body: "Final stretch begins. 12 weeks to go." },
  37: { title: "Full term", body: "Baby could arrive any day now." },
  40: { title: "Due date week", body: "However baby arrives is right." },
};

async function sendMilestoneNotifications() {
  // Get all families with their current week
  const { data: families } = await supabase
    .from("families")
    .select("id, current_week, stage")
    .limit(500);

  if (!families?.length) return;

  const milestoneFamilies = families.filter(
    (f) => f.stage !== "post-birth" && f.current_week && PREGNANCY_MILESTONES[f.current_week]
  );

  if (!milestoneFamilies.length) return;

  const milestoneFamilyIds = milestoneFamilies.map((f) => f.id);

  const { data: allMembers } = await supabase
    .from("profiles")
    .select("id, family_id")
    .in("family_id", milestoneFamilyIds);

  if (!allMembers?.length) return;

  const allMemberIds = allMembers.map((m) => m.id);

  const { data: allPrefs } = await supabase
    .from("notification_preferences")
    .select("user_id, milestone_notifications, quiet_hours_start, quiet_hours_end, profiles!inner(timezone)")
    .in("user_id", allMemberIds);

  const prefsMap = new Map((allPrefs || []).map((p) => [p.user_id, p]));

  const { data: existingMilestones } = await supabase
    .from("notifications")
    .select("user_id, title")
    .in("user_id", allMemberIds)
    .eq("type", "milestone");

  const milestoneSet = new Set(
    (existingMilestones || []).map((m) => `${m.user_id}:${m.title}`)
  );

  const membersByFamily = allMembers.reduce((acc, m) => {
    if (!acc[m.family_id]) acc[m.family_id] = [];
    acc[m.family_id].push(m);
    return acc;
  }, {} as Record<string, typeof allMembers>);

  for (const family of milestoneFamilies) {
    const milestone = PREGNANCY_MILESTONES[family.current_week];
    const members = membersByFamily[family.id];
    if (!members?.length) continue;

    for (const member of members) {
      const pref = prefsMap.get(member.id);
      if (pref?.milestone_notifications === false) continue;
      if (pref) {
        const tz = (pref.profiles as unknown as { timezone: string | null })?.timezone || "UTC";
        if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end, tz)) continue;
      }

      const expectedTitle = `Week ${family.current_week}: ${milestone.title}`;
      if (milestoneSet.has(`${member.id}:${expectedTitle}`)) continue;

      const payload: NotificationPayload = {
        title: expectedTitle,
        body: milestone.body,
        url: "/briefing",
        tag: "milestone",
      };
      await persistNotification(member.id, "milestone", payload);
      await sendPushNotification(member.id, payload, "milestone");
      await sendEmailNotification(member.id, "milestone", { week: family.current_week });
    }
  }
}

// --- Onboarding Nudges ---

async function sendOnboardingNudges() {
  const now = new Date();

  // Find users who completed onboarding but haven't engaged with features yet
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, created_at, first_briefing_viewed_at, first_task_completed_at, partner_invited_at, first_mood_checkin_at")
    .is("onboarding_completed", true)
    .limit(500);

  if (!profiles?.length) return;

  // Check onboarding nudge preferences
  const profileIds = profiles.map((p) => p.id);
  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("user_id, onboarding_nudges, quiet_hours_start, quiet_hours_end, profiles!inner(timezone)")
    .in("user_id", profileIds);

  const prefsMap = new Map((prefs || []).map((p) => [p.user_id, p]));

  for (const profile of profiles) {
    const pref = prefsMap.get(profile.id);
    if (pref?.onboarding_nudges === false) continue;
    if (pref) {
      const tz = (pref.profiles as unknown as { timezone: string | null })?.timezone || "UTC";
      if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end, tz)) continue;
    }

    const signupDate = new Date(profile.created_at);
    const hoursSinceSignup = (now.getTime() - signupDate.getTime()) / (1000 * 60 * 60);

    // Nudge 1: View first briefing (after 24h)
    if (!profile.first_briefing_viewed_at && hoursSinceSignup >= 24 && hoursSinceSignup < 48) {
      await sendNudge(profile.id, "Your weekly briefing is waiting", "2 min read. Covers what's happening this week.", "/briefing");
    }

    // Nudge 2: Complete first task (after 48h)
    if (!profile.first_task_completed_at && hoursSinceSignup >= 48 && hoursSinceSignup < 72) {
      await sendNudge(profile.id, "Quick win: complete your first task", "Takes under 5 minutes.", "/tasks");
    }

    // Nudge 3: Invite partner (after 72h)
    if (!profile.partner_invited_at && hoursSinceSignup >= 72 && hoursSinceSignup < 96) {
      await sendNudge(profile.id, "Better together: invite your partner", "One subscription covers both of you.", "/settings");
    }

    // Nudge 4: First mood check-in (after 5 days)
    if (!profile.first_mood_checkin_at && hoursSinceSignup >= 120 && hoursSinceSignup < 144) {
      await sendNudge(profile.id, "How are you feeling today?", "First mood check-in takes 10 seconds.", "/dashboard");
    }
  }
}

async function sendNudge(userId: string, title: string, body: string, url: string) {
  // Dedup: check if we already sent this nudge
  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("type", "onboarding")
    .eq("title", title);

  if ((count || 0) > 0) return;

  const payload: NotificationPayload = { title, body, url, tag: "onboarding" };
  await persistNotification(userId, "onboarding", payload);
  await sendPushNotification(userId, payload, "onboarding");
}

// --- Mood Reminders ---

async function sendMoodReminders() {
  // Find users who haven't done a mood check-in today
  const today = new Date().toISOString().split("T")[0];

  const { data: usersWithCheckins } = await supabase
    .from("mood_checkins")
    .select("user_id")
    .gte("created_at", `${today}T00:00:00Z`);

  const checkedInUserIds = new Set((usersWithCheckins || []).map((c) => c.user_id));

  // Get all users with mood reminders enabled
  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("user_id, mood_reminders, quiet_hours_start, quiet_hours_end, profiles!inner(timezone)")
    .neq("mood_reminders", false);

  if (!prefs?.length) return;

  for (const pref of prefs) {
    if (checkedInUserIds.has(pref.user_id)) continue;
    const tz = (pref.profiles as unknown as { timezone: string | null })?.timezone || "UTC";
    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end, tz)) continue;

    // Dedup: only one mood reminder per day
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", pref.user_id)
      .eq("type", "mood_reminder")
      .gte("created_at", `${today}T00:00:00Z`);

    if ((count || 0) > 0) continue;

    const payload: NotificationPayload = {
      title: "How's today going?",
      body: "Quick mood check-in. Takes 10 seconds.",
      url: "/dashboard",
      tag: "mood-reminder",
    };
    await persistNotification(pref.user_id, "mood_reminder", payload);
    await sendPushNotification(pref.user_id, payload, "mood_reminder");
  }
}

// --- Celebration Notifications ---

async function sendCelebrationNotifications() {
  const today = new Date().toISOString().split("T")[0];

  // Find users who hit milestones today
  const { data: firstTaskUsers } = await supabase
    .from("profiles")
    .select("id")
    .gte("first_task_completed_at", `${today}T00:00:00Z`)
    .lt("first_task_completed_at", `${today}T23:59:59.999Z`);

  const { data: firstMoodUsers } = await supabase
    .from("profiles")
    .select("id")
    .gte("first_mood_checkin_at", `${today}T00:00:00Z`)
    .lt("first_mood_checkin_at", `${today}T23:59:59.999Z`);

  const celebrations: Array<{ userId: string; milestone: string; title: string; body: string }> = [];

  for (const user of firstTaskUsers || []) {
    celebrations.push({
      userId: user.id,
      milestone: "first_task_completed",
      title: "First Task Done!",
      body: "You're officially in the game. Keep the momentum going.",
    });
  }

  for (const user of firstMoodUsers || []) {
    celebrations.push({
      userId: user.id,
      milestone: "first_mood_checkin",
      title: "First Check-In!",
      body: "Tracking your wellbeing is a power move. Keep it up.",
    });
  }

  if (!celebrations.length) return;

  // Dedup: check existing celebration notifications sent today
  const userIds = [...new Set(celebrations.map((c) => c.userId))];
  const { data: existingCelebrations } = await supabase
    .from("notifications")
    .select("user_id, title")
    .in("user_id", userIds)
    .eq("type", "celebration")
    .gte("created_at", `${today}T00:00:00Z`);

  const celebrationSet = new Set(
    (existingCelebrations || []).map((c) => `${c.user_id}:${c.title}`)
  );

  for (const c of celebrations) {
    if (celebrationSet.has(`${c.userId}:${c.title}`)) continue;

    const payload: NotificationPayload = {
      title: c.title,
      body: c.body,
      url: "/dashboard",
      tag: "celebration",
    };
    await persistNotification(c.userId, "celebration", payload);
    await sendPushNotification(c.userId, payload, "celebration");
  }
}

// --- Re-engagement ---

async function sendReEngagementNotifications() {
  const now = new Date();

  // Find users inactive for 7, 21, or 45 days
  const { data: inactiveUsers } = await supabase
    .from("profiles")
    .select("id, last_active_at, email, subscription_tier")
    .not("last_active_at", "is", null)
    .lt("last_active_at", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .limit(500);

  if (!inactiveUsers?.length) return;

  // Check re-engagement preferences
  const userIds = inactiveUsers.map((u) => u.id);
  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("user_id, re_engagement_emails")
    .in("user_id", userIds);

  const prefsMap = new Map((prefs || []).map((p) => [p.user_id, p]));

  for (const user of inactiveUsers) {
    const pref = prefsMap.get(user.id);
    if (pref?.re_engagement_emails === false) continue;

    const lastActive = new Date(user.last_active_at);
    const daysInactive = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    // Determine which re-engagement tier
    let tier: "7d" | "21d" | "45d" | null = null;
    if (daysInactive >= 45 && daysInactive < 46) tier = "45d";
    else if (daysInactive >= 21 && daysInactive < 22) tier = "21d";
    else if (daysInactive >= 7 && daysInactive < 8) tier = "7d";

    if (!tier) continue;

    // Dedup: check if we already sent this tier's re-engagement
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", "re_engagement")
      .gte("created_at", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if ((count || 0) > 0) continue;

    if (tier === "7d") {
      // Push + email
      const payload: NotificationPayload = {
        title: "Tasks need attention",
        body: "Your task list has been waiting. Quick check-in?",
        url: "/tasks",
        tag: "re-engagement",
      };
      await persistNotification(user.id, "re_engagement", payload);
      await sendPushNotification(user.id, payload, "re_engagement");
      await sendEmailNotification(user.id, "re_engagement", { days_inactive: 7 });
    } else if (tier === "21d" || tier === "45d") {
      // Email only (no push for long-dormant users)
      await persistNotification(user.id, "re_engagement", {
        title: tier === "21d" ? "Quick update on your pregnancy" : "We're still here when you need us",
        body: tier === "21d" ? "Things have changed since you last checked in." : "Your data is safe. Pick up where you left off.",
        url: "/dashboard",
        tag: "re-engagement",
      });
      await sendEmailNotification(user.id, "re_engagement", { days_inactive: daysInactive });
    }
  }
}

// --- Push Window Warnings ---

async function sendPushWindowWarnings() {
  const now = new Date();

  // Find free users approaching push window expiry (day 27 and day 30)
  const { data: freeUsers } = await supabase
    .from("profiles")
    .select("id, created_at, subscription_tier")
    .eq("subscription_tier", "free")
    .limit(500);

  if (!freeUsers?.length) return;

  const eligibleUsers = freeUsers.filter((user) => {
    const daysSinceSignup = Math.floor((now.getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceSignup === 27 || daysSinceSignup === 30;
  });

  if (!eligibleUsers.length) return;

  const eligibleIds = eligibleUsers.map((u) => u.id);
  const { data: existingWarnings } = await supabase
    .from("notifications")
    .select("user_id, title")
    .in("user_id", eligibleIds)
    .eq("type", "system")
    .in("title", ["Push notifications expire in 3 days", "Last day of push notifications"]);

  const warningSet = new Set(
    (existingWarnings || []).map((w) => `${w.user_id}:${w.title}`)
  );

  for (const user of eligibleUsers) {
    const daysSinceSignup = Math.floor((now.getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceSignup === 27) {
      const title = "Push notifications expire in 3 days";
      if (warningSet.has(`${user.id}:${title}`)) continue;

      const payload: NotificationPayload = {
        title,
        body: "Upgrade to keep task reminders, briefing alerts, and partner activity.",
        url: "/upgrade",
        tag: "push-expiry-warning",
      };
      await persistNotification(user.id, "system", payload);
      await sendPushNotification(user.id, payload, "system");
      await sendEmailNotification(user.id, "subscription_expiring", { days_remaining: 3 });
    } else {
      const title = "Last day of push notifications";
      if (warningSet.has(`${user.id}:${title}`)) continue;

      const payload: NotificationPayload = {
        title,
        body: "After today, you'll only see notifications in-app. Upgrade to keep them.",
        url: "/upgrade",
        tag: "push-expiry-final",
      };
      await persistNotification(user.id, "system", payload);
      await sendPushNotification(user.id, payload, "system");
      await sendEmailNotification(user.id, "subscription_expiring", { days_remaining: 0 });
    }
  }
}

// --- Onboarding Drip Emails ---

async function sendOnboardingDripEmails() {
  const now = new Date();

  // Find recently signed up users (within last 8 days)
  const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
  const { data: newUsers } = await supabase
    .from("profiles")
    .select("id, created_at, full_name")
    .gte("created_at", eightDaysAgo.toISOString())
    .is("onboarding_completed", true)
    .limit(500);

  if (!newUsers?.length) return;

  // Check lifecycle email preferences
  const userIds = newUsers.map((u) => u.id);
  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("user_id, email_lifecycle")
    .in("user_id", userIds);

  const prefsMap = new Map((prefs || []).map((p) => [p.user_id, p]));

  // Get families for week info
  const { data: profileFamilies } = await supabase
    .from("profiles")
    .select("id, family_id")
    .in("id", userIds);

  const familyMap = new Map((profileFamilies || []).map((p) => [p.id, p.family_id]));

  for (const user of newUsers) {
    const pref = prefsMap.get(user.id);
    if (pref?.email_lifecycle === false) continue;

    const signupDate = new Date(user.created_at);
    const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));

    // Day 0: Welcome (handled at signup, skip here)
    // Day 1: Briefing nudge email
    if (daysSinceSignup === 1) {
      await sendDripEmail(user.id, "onboarding_drip", { day: 1, subject_hint: "briefing" });
    }
    // Day 3: Task nudge email
    else if (daysSinceSignup === 3) {
      await sendDripEmail(user.id, "onboarding_drip", { day: 3, subject_hint: "tasks" });
    }
    // Day 5: Partner invite email
    else if (daysSinceSignup === 5) {
      await sendDripEmail(user.id, "onboarding_drip", { day: 5, subject_hint: "partner" });
    }
    // Day 7: First week recap email
    else if (daysSinceSignup === 7) {
      await sendDripEmail(user.id, "onboarding_drip", { day: 7, subject_hint: "recap" });
    }
  }
}

async function sendDripEmail(userId: string, type: string, data: Record<string, unknown>) {
  // Dedup: check if already sent this drip day
  const { count } = await supabase
    .from("notification_delivery_log")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("channel", "email")
    .eq("status", "sent")
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  // Max 1 drip email per day
  if ((count || 0) > 0) return;

  await sendEmailNotification(userId, type, data);
}

// --- Shared Helpers ---

function checkQuietHours(
  quietHoursStart: string | null,
  quietHoursEnd: string | null,
  timezone: string = "UTC"
): boolean {
  if (!quietHoursStart) return false;

  const now = new Date();
  const currentHour = parseInt(
    now.toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: timezone })
  );
  const startHour = parseInt(quietHoursStart.split(":")[0] || "22");
  const endHour = parseInt((quietHoursEnd || "07:00").split(":")[0] || "7");

  if (startHour > endHour) {
    return currentHour >= startHour || currentHour < endHour;
  }
  return currentHour >= startHour && currentHour < endHour;
}

async function sendEmailNotification(
  userId: string,
  emailType: string,
  data: Record<string, unknown> = {}
): Promise<void> {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: emailType, user_id: userId, ...data }),
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error(`Email ${emailType} failed: ${response.status}`, errText);
    }
  } catch (err) {
    console.error(`Failed to trigger ${emailType} email for user ${userId}:`, err);
  }
}

async function persistNotification(userId: string, type: string, payload: NotificationPayload): Promise<void> {
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      type,
      title: payload.title,
      body: payload.body,
      url: payload.url || "/dashboard",
    });
  } catch (err) {
    console.error("Failed to persist notification:", err);
  }
}

async function sendPushNotification(
  userId: string,
  payload: NotificationPayload,
  notificationType: string = "system"
): Promise<void> {
  // Check frequency cap (unless type is exempt)
  if (!BYPASS_FREQUENCY_CAP.has(notificationType)) {
    const canSend = await checkPushFrequencyCap(userId);
    if (!canSend) {
      await logDelivery(userId, "web_push", "throttled", `Frequency cap hit for ${notificationType}`);
      console.log(`Push throttled for user ${userId} (type: ${notificationType})`);
      return;
    }
  }

  // Web push via VAPID
  const { data: subscription } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId)
    .single();

  if (subscription) {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    try {
      await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
      await logDelivery(userId, "web_push", "sent");
    } catch (err: unknown) {
      console.error(`Failed to send web push to user ${userId}:`, err);
      const statusCode = err instanceof Error && "statusCode" in err
        ? (err as Record<string, unknown>).statusCode
        : undefined;
      const message = err instanceof Error ? err.message : String(err);
      if (statusCode === 404 || statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("user_id", userId);
        await logDelivery(userId, "web_push", "invalid_token", `HTTP ${statusCode}`);
      } else {
        await logDelivery(userId, "web_push", "failed", message);
      }
    }
  }

  // Mobile push via Expo Push API
  const { data: mobileTokens } = await supabase
    .from("device_tokens")
    .select("id, token, platform")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (mobileTokens?.length) {
    await sendExpoPush(userId, mobileTokens, payload);
  }
}

async function sendExpoPush(
  userId: string,
  tokens: Array<{ id: string; token: string; platform: string }>,
  payload: NotificationPayload
): Promise<void> {
  const messages = tokens.map((t) => ({
    to: t.token,
    title: payload.title,
    body: payload.body,
    data: { url: payload.url || "/dashboard" },
    sound: "default" as const,
    badge: 1,
    channelId: payload.tag || "default",
  }));

  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100);

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip, deflate",
        },
        body: JSON.stringify(chunk),
      });

      const result = await response.json();

      if (result.data) {
        for (let j = 0; j < result.data.length; j++) {
          const ticket = result.data[j];
          const tokenRecord = tokens[i + j];
          if (ticket.status === "error" && ticket.details?.error === "DeviceNotRegistered") {
            await supabase.from("device_tokens").update({ is_active: false }).eq("id", tokenRecord.id);
            await logDelivery(userId, "expo_push", "invalid_token", "DeviceNotRegistered", tokenRecord.id);
          } else if (ticket.status === "ok") {
            await logDelivery(userId, "expo_push", "sent", undefined, tokenRecord.id);
          } else if (ticket.status === "error") {
            await logDelivery(
              userId,
              "expo_push",
              "failed",
              ticket.message || ticket.details?.error,
              tokenRecord.id
            );
          }
        }
      }
    } catch (err: unknown) {
      console.error(`Failed to send Expo push to user ${userId}:`, err);
      const message = err instanceof Error ? err.message : "Fetch failed";
      for (let j = 0; j < chunk.length; j++) {
        const tokenRecord = tokens[i + j];
        await logDelivery(userId, "expo_push", "failed", message, tokenRecord.id);
      }
    }
  }
}
