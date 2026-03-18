import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "https://esm.sh/web-push@3.6.6";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;
const vapidEmail = Deno.env.get("VAPID_EMAIL") || "mailto:hello@thedadcenter.com";

webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface NotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  actions?: Array<{ action: string; title: string }>;
}

Deno.serve(async (req: Request) => {
  // Verify service role key authentication
  const authHeader = req.headers.get("Authorization");
  if (!supabaseServiceKey || authHeader !== `Bearer ${supabaseServiceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { type } = await req.json();

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
    console.error("Error sending notifications:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

async function sendDailyDigest() {
  // Batch: get all users with task reminders enabled + their family_id in one query
  const { data: prefsWithProfiles } = await supabase
    .from("notification_preferences")
    .select("user_id, quiet_hours_start, quiet_hours_end, profiles!inner(family_id)")
    .or("task_reminders_7_day.eq.true,task_reminders_3_day.eq.true,task_reminders_1_day.eq.true");

  if (!prefsWithProfiles?.length) return;

  // Collect all unique family IDs
  const familyIds = [
    ...new Set(
      prefsWithProfiles
        .map((p) => (p.profiles as unknown as { family_id: string | null }).family_id)
        .filter(Boolean) as string[]
    ),
  ];

  if (!familyIds.length) return;

  // Batch: fetch all pending tasks due today or earlier for all relevant families
  const today = new Date().toISOString().split("T")[0];
  const { data: allTasks } = await supabase
    .from("family_tasks")
    .select("*")
    .in("family_id", familyIds)
    .eq("status", "pending")
    .lte("due_date", today);

  // Group tasks by family_id
  const tasksByFamily = (allTasks || []).reduce((acc, task) => {
    if (!acc[task.family_id]) acc[task.family_id] = [];
    acc[task.family_id].push(task);
    return acc;
  }, {} as Record<string, typeof allTasks>);

  for (const pref of prefsWithProfiles) {
    const familyId = (pref.profiles as unknown as { family_id: string | null }).family_id;
    if (!familyId) continue;

    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end)) continue;

    const familyTasks = tasksByFamily[familyId];
    if (!familyTasks?.length) continue;

    const count = familyTasks.length;
    const mustDoCount = familyTasks.filter((t) => t.priority === "must-do").length;

    const dailyPayload = {
      title: "Good morning! 🌅",
      body: `You have ${count} task${count > 1 ? "s" : ""} due today${mustDoCount > 0 ? ` (${mustDoCount} must-do)` : ""}`,
      url: "/tasks",
      tag: "daily-digest",
    };
    await persistNotification(pref.user_id, "daily_digest", dailyPayload);
    await sendPushNotification(pref.user_id, dailyPayload);
  }
}

async function sendTaskReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // Batch: get must-do tasks due tomorrow
  const { data: tasks } = await supabase
    .from("family_tasks")
    .select("*")
    .eq("status", "pending")
    .eq("due_date", tomorrowStr)
    .eq("priority", "must-do");

  if (!tasks?.length) return;

  // Group by family
  const tasksByFamily = tasks.reduce((acc, task) => {
    if (!acc[task.family_id]) acc[task.family_id] = [];
    acc[task.family_id].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const familyIds = Object.keys(tasksByFamily);

  // Batch: fetch all profiles for relevant families
  const { data: allMembers } = await supabase
    .from("profiles")
    .select("id, family_id")
    .in("family_id", familyIds);

  if (!allMembers?.length) return;

  // Batch: fetch all notification preferences for those members
  const memberIds = allMembers.map((m) => m.id);
  const { data: allPrefs } = await supabase
    .from("notification_preferences")
    .select("user_id, task_reminders_1_day, quiet_hours_start, quiet_hours_end")
    .in("user_id", memberIds);

  const prefsMap = new Map((allPrefs || []).map((p) => [p.user_id, p]));

  for (const member of allMembers) {
    const pref = prefsMap.get(member.id);
    if (!pref?.task_reminders_1_day) continue;
    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end)) continue;

    const familyTasks = tasksByFamily[member.family_id];
    if (!familyTasks?.length) continue;

    const taskPayload = {
      title: "Tasks due tomorrow",
      body: `${familyTasks.length} must-do task${familyTasks.length > 1 ? "s" : ""} due tomorrow`,
      url: "/tasks",
      tag: "task-reminder",
    };
    await persistNotification(member.id, "task_reminder", taskPayload);
    await sendPushNotification(member.id, taskPayload);
  }
}

async function sendOverdueAlerts() {
  const today = new Date().toISOString().split("T")[0];

  // Batch: get overdue must-do tasks
  const { data: tasks } = await supabase
    .from("family_tasks")
    .select("*")
    .eq("status", "pending")
    .eq("priority", "must-do")
    .lt("due_date", today);

  if (!tasks?.length) return;

  // Group by family
  const tasksByFamily = tasks.reduce((acc, task) => {
    if (!acc[task.family_id]) acc[task.family_id] = [];
    acc[task.family_id].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const familyIds = Object.keys(tasksByFamily);

  // Batch: fetch all profiles for relevant families
  const { data: allMembers } = await supabase
    .from("profiles")
    .select("id, family_id")
    .in("family_id", familyIds);

  if (!allMembers?.length) return;

  // Batch: fetch all notification preferences for those members
  const memberIds = allMembers.map((m) => m.id);
  const { data: allPrefs } = await supabase
    .from("notification_preferences")
    .select("user_id, task_reminders_1_day, quiet_hours_start, quiet_hours_end")
    .in("user_id", memberIds);

  const prefsMap = new Map((allPrefs || []).map((p) => [p.user_id, p]));

  for (const member of allMembers) {
    const pref = prefsMap.get(member.id);
    if (!pref?.task_reminders_1_day) continue;
    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end)) continue;

    const familyTasks = tasksByFamily[member.family_id];
    if (!familyTasks?.length) continue;

    const overduePayload = {
      title: "⚠️ Overdue tasks",
      body: `${familyTasks.length} must-do task${familyTasks.length > 1 ? "s are" : " is"} overdue`,
      url: "/tasks",
      tag: "overdue-alert",
    };
    await persistNotification(member.id, "overdue_alert", overduePayload);
    await sendPushNotification(member.id, overduePayload);
  }
}

async function sendWeeklyBriefingAlerts() {
  // Batch: get all families
  const { data: families } = await supabase.from("families").select("id, current_week");

  if (!families?.length) return;

  const familyIds = families.map((f) => f.id);
  const familyWeekMap = new Map(families.map((f) => [f.id, f.current_week]));

  // Batch: fetch all profiles for all families
  const { data: allMembers } = await supabase
    .from("profiles")
    .select("id, family_id")
    .in("family_id", familyIds);

  if (!allMembers?.length) return;

  // Batch: fetch all notification preferences with weekly_briefing enabled
  const memberIds = allMembers.map((m) => m.id);
  const { data: allPrefs } = await supabase
    .from("notification_preferences")
    .select("user_id, weekly_briefing, quiet_hours_start, quiet_hours_end")
    .in("user_id", memberIds)
    .eq("weekly_briefing", true);

  const prefsMap = new Map((allPrefs || []).map((p) => [p.user_id, p]));

  for (const member of allMembers) {
    const pref = prefsMap.get(member.id);
    if (!pref) continue;
    if (checkQuietHours(pref.quiet_hours_start, pref.quiet_hours_end)) continue;

    const currentWeek = familyWeekMap.get(member.family_id);

    const briefingPayload = {
      title: "📬 New Weekly Briefing",
      body: `Your Week ${currentWeek} briefing is ready!`,
      url: "/briefing",
      tag: "weekly-briefing",
    };
    await persistNotification(member.id, "weekly_briefing", briefingPayload);
    await sendPushNotification(member.id, briefingPayload);
  }
}

function checkQuietHours(quietHoursStart: string | null, quietHoursEnd: string | null): boolean {
  if (!quietHoursStart) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const startHour = parseInt(quietHoursStart.split(":")[0] || "22");
  const endHour = parseInt((quietHoursEnd || "07:00").split(":")[0] || "7");

  // Handle overnight quiet hours (e.g., 22:00 - 07:00)
  if (startHour > endHour) {
    return currentHour >= startHour || currentHour < endHour;
  }
  return currentHour >= startHour && currentHour < endHour;
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

async function sendPushNotification(userId: string, payload: NotificationPayload): Promise<void> {
  // Get user's push subscription
  const { data: subscription } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId)
    .single();

  if (!subscription) return;

  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };

  try {
    await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
  } catch (error) {
    console.error(`Failed to send notification to user ${userId}:`, error);

    // Remove invalid subscriptions
    if (error.statusCode === 404 || error.statusCode === 410) {
      await supabase.from("push_subscriptions").delete().eq("user_id", userId);
    }
  }
}
