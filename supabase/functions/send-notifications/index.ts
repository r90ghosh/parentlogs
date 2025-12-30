import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "https://esm.sh/web-push@3.6.6";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;
const vapidEmail = Deno.env.get("VAPID_EMAIL") || "mailto:hello@parentlogs.com";

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
  // Get all users with task_reminders enabled
  const { data: preferences } = await supabase
    .from("notification_preferences")
    .select("user_id")
    .eq("task_reminders", true);

  if (!preferences) return;

  for (const pref of preferences) {
    // Check quiet hours
    if (await isInQuietHours(pref.user_id)) continue;

    // Get user's family
    const { data: profile } = await supabase
      .from("profiles")
      .select("family_id")
      .eq("id", pref.user_id)
      .single();

    if (!profile?.family_id) continue;

    // Get today's tasks
    const today = new Date().toISOString().split("T")[0];
    const { data: tasks, count } = await supabase
      .from("family_tasks")
      .select("*", { count: "exact" })
      .eq("family_id", profile.family_id)
      .eq("status", "pending")
      .lte("due_date", today);

    if (!count || count === 0) continue;

    const mustDoCount = tasks?.filter((t) => t.priority === "must-do").length || 0;

    await sendPushNotification(pref.user_id, {
      title: "Good morning! 🌅",
      body: `You have ${count} task${count > 1 ? "s" : ""} due today${mustDoCount > 0 ? ` (${mustDoCount} must-do)` : ""}`,
      url: "/tasks",
      tag: "daily-digest",
    });
  }
}

async function sendTaskReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // Get tasks due tomorrow
  const { data: tasks } = await supabase
    .from("family_tasks")
    .select("*, families!inner(id)")
    .eq("status", "pending")
    .eq("due_date", tomorrowStr)
    .eq("priority", "must-do");

  if (!tasks) return;

  // Group by family
  const tasksByFamily = tasks.reduce((acc, task) => {
    if (!acc[task.family_id]) acc[task.family_id] = [];
    acc[task.family_id].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  for (const [familyId, familyTasks] of Object.entries(tasksByFamily)) {
    // Get family members
    const { data: members } = await supabase
      .from("profiles")
      .select("id")
      .eq("family_id", familyId);

    if (!members) continue;

    for (const member of members) {
      // Check preferences
      const { data: pref } = await supabase
        .from("notification_preferences")
        .select("due_date_reminders")
        .eq("user_id", member.id)
        .single();

      if (!pref?.due_date_reminders) continue;
      if (await isInQuietHours(member.id)) continue;

      await sendPushNotification(member.id, {
        title: "Tasks due tomorrow",
        body: `${familyTasks.length} must-do task${familyTasks.length > 1 ? "s" : ""} due tomorrow`,
        url: "/tasks",
        tag: "task-reminder",
      });
    }
  }
}

async function sendOverdueAlerts() {
  const today = new Date().toISOString().split("T")[0];

  // Get overdue must-do tasks
  const { data: tasks } = await supabase
    .from("family_tasks")
    .select("*")
    .eq("status", "pending")
    .eq("priority", "must-do")
    .lt("due_date", today);

  if (!tasks) return;

  // Group by family
  const tasksByFamily = tasks.reduce((acc, task) => {
    if (!acc[task.family_id]) acc[task.family_id] = [];
    acc[task.family_id].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  for (const [familyId, familyTasks] of Object.entries(tasksByFamily)) {
    const { data: members } = await supabase
      .from("profiles")
      .select("id")
      .eq("family_id", familyId);

    if (!members) continue;

    for (const member of members) {
      const { data: pref } = await supabase
        .from("notification_preferences")
        .select("overdue_alerts")
        .eq("user_id", member.id)
        .single();

      if (!pref?.overdue_alerts) continue;
      if (await isInQuietHours(member.id)) continue;

      await sendPushNotification(member.id, {
        title: "⚠️ Overdue tasks",
        body: `${familyTasks.length} must-do task${familyTasks.length > 1 ? "s are" : " is"} overdue`,
        url: "/tasks",
        tag: "overdue-alert",
      });
    }
  }
}

async function sendWeeklyBriefingAlerts() {
  // Get all families
  const { data: families } = await supabase.from("families").select("id, current_week");

  if (!families) return;

  for (const family of families) {
    const { data: members } = await supabase
      .from("profiles")
      .select("id")
      .eq("family_id", family.id);

    if (!members) continue;

    for (const member of members) {
      const { data: pref } = await supabase
        .from("notification_preferences")
        .select("weekly_briefing")
        .eq("user_id", member.id)
        .single();

      if (!pref?.weekly_briefing) continue;
      if (await isInQuietHours(member.id)) continue;

      await sendPushNotification(member.id, {
        title: "📬 New Weekly Briefing",
        body: `Your Week ${family.current_week} briefing is ready!`,
        url: "/briefing",
        tag: "weekly-briefing",
      });
    }
  }
}

async function isInQuietHours(userId: string): Promise<boolean> {
  const { data: pref } = await supabase
    .from("notification_preferences")
    .select("quiet_hours_enabled, quiet_hours_start, quiet_hours_end")
    .eq("user_id", userId)
    .single();

  if (!pref?.quiet_hours_enabled) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const startHour = parseInt(pref.quiet_hours_start?.split(":")[0] || "22");
  const endHour = parseInt(pref.quiet_hours_end?.split(":")[0] || "7");

  // Handle overnight quiet hours (e.g., 22:00 - 07:00)
  if (startHour > endHour) {
    return currentHour >= startHour || currentHour < endHour;
  }
  return currentHour >= startHour && currentHour < endHour;
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
