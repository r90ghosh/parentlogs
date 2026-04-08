import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

// Verify the caller is a service-role JWT issued for this project.
// With verify_jwt: true, Supabase's gateway has already validated the signature
// before the function runs, so decoding the payload here is safe.
function isServiceRoleCaller(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    return payload.role === "service_role";
  } catch {
    return false;
  }
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const FROM_EMAIL = "The Dad Center <noreply@thedadcenter.com>";
const APP_URL = "https://thedadcenter.com";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Transactional emails always send regardless of preferences
const TRANSACTIONAL_TYPES = new Set([
  "welcome",
  "partner_invited",
  "partner_joined",
  "subscription_confirmed",
  "subscription_expiring",
  "payment_failed",
]);

// Map notification email types to preference columns
const PREFERENCE_MAP: Record<string, string> = {
  weekly_briefing: "email_weekly_briefing",
  overdue_digest: "email_task_digest",
  milestone: "email_milestones",
  re_engagement: "re_engagement_emails",
  onboarding_drip: "email_lifecycle",
};

// --- Main Handler ---

Deno.serve(async (req: Request) => {
  if (!isServiceRoleCaller(req.headers.get("Authorization"))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { type, user_id, ...data } = body;

    if (!type || !user_id) {
      return new Response(JSON.stringify({ error: "Missing type or user_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name, role, family_id")
      .eq("id", user_id)
      .single();

    if (!profile?.email) {
      return new Response(JSON.stringify({ error: "User email not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check email preferences (skip for transactional)
    if (!TRANSACTIONAL_TYPES.has(type)) {
      const prefColumn = PREFERENCE_MAP[type];
      if (prefColumn) {
        const { data: prefs } = await supabase
          .from("notification_preferences")
          .select(prefColumn)
          .eq("user_id", user_id)
          .single();

        if (prefs && prefs[prefColumn] === false) {
          return new Response(
            JSON.stringify({ skipped: true, reason: "Email preference disabled" }),
            { headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Generate email content
    const email = generateEmail(type, profile, data);
    if (!email) {
      return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send via Resend
    const result = await sendViaResend(profile.email, email.subject, email.html);

    // Log delivery
    await logEmailDelivery(user_id, result.success ? "sent" : "failed", result.error);

    return new Response(JSON.stringify({ success: result.success }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-email error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// --- Email Generation ---

interface ProfileData {
  email: string;
  full_name: string;
  role: string;
  family_id: string | null;
}

interface EmailContent {
  subject: string;
  html: string;
}

function generateEmail(
  type: string,
  profile: ProfileData,
  data: Record<string, unknown>
): EmailContent | null {
  const firstName = escapeHtml((profile.full_name || "").split(" ")[0] || "there");

  switch (type) {
    case "welcome":
      return welcomeEmail(firstName);
    case "partner_invited":
      return partnerInvitedEmail(data.inviter_name as string, data.invite_code as string);
    case "partner_joined":
      return partnerJoinedEmail(firstName, data.partner_name as string);
    case "subscription_confirmed":
      return subscriptionConfirmedEmail(firstName, data.plan as string);
    case "subscription_expiring":
      return subscriptionExpiringEmail(firstName, data.days_remaining as number);
    case "payment_failed":
      return paymentFailedEmail(firstName);
    case "weekly_briefing":
      return weeklyBriefingEmail(firstName, data.week as number);
    case "overdue_digest":
      return overdueDigestEmail(firstName, data.count as number);
    case "re_engagement":
      return reEngagementEmail(firstName, data.days_inactive as number);
    case "onboarding_drip":
      return onboardingDripEmail(firstName, data.day as number, data.subject_hint as string);
    default:
      return null;
  }
}

// --- Email Templates ---

function welcomeEmail(firstName: string): EmailContent {
  return {
    subject: "Welcome to The Dad Center — your ops dashboard is ready",
    html: baseTemplate(
      `<h1 style="${h1Style}">Welcome aboard, ${firstName}.</h1>
      <p style="${pStyle}">
        The Dad Center is your operating system for fatherhood — week-by-week briefings,
        task management, budget planning, and a community of dads who refuse to wing it.
      </p>
      <p style="${pStyle}">Here's what to do first:</p>
      <ol style="${pStyle} padding-left: 20px;">
        <li style="margin-bottom: 8px;">Read your first weekly briefing</li>
        <li style="margin-bottom: 8px;">Review your task list for this week</li>
        <li style="margin-bottom: 8px;">Invite your partner — one subscription covers both of you</li>
      </ol>
      ${ctaButton("Open your dashboard", `${APP_URL}/dashboard`)}`,
      "Your ops dashboard is ready. Here's what to do first."
    ),
  };
}

function partnerInvitedEmail(inviterName: string, inviteCode: string): EmailContent {
  const safeName = escapeHtml(inviterName || "Your partner");
  const safeCode = escapeHtml(inviteCode || "");
  return {
    subject: `${safeName} invited you to The Dad Center`,
    html: baseTemplate(
      `<h1 style="${h1Style}">You've been invited.</h1>
      <p style="${pStyle}">
        ${safeName} set up a family account on The Dad Center and
        wants you to join. You'll share tasks, briefings, and a budget — all from one subscription.
      </p>
      <p style="${pStyle}">
        Your invite code: <strong style="color: #c4703f; font-size: 18px; letter-spacing: 2px;">${safeCode}</strong>
      </p>
      ${ctaButton("Join your family", `${APP_URL}/signup`)}`,
      `${safeName} invited you to join The Dad Center.`
    ),
  };
}

function partnerJoinedEmail(firstName: string, partnerName: string): EmailContent {
  const safeName = escapeHtml(partnerName || "Your partner");
  return {
    subject: `${safeName} just joined your family`,
    html: baseTemplate(
      `<h1 style="${h1Style}">Team complete.</h1>
      <p style="${pStyle}">
        ${safeName} just joined your family on The Dad Center.
        You'll now see each other's activity — tasks completed, logs added, and more.
      </p>
      ${ctaButton("See your dashboard", `${APP_URL}/dashboard`)}`,
      `${safeName} joined your family on The Dad Center.`
    ),
  };
}

function subscriptionConfirmedEmail(firstName: string, plan?: string): EmailContent {
  const planLabel = plan === "lifetime" ? "Lifetime" : "Premium";
  return {
    subject: "Full access unlocked",
    html: baseTemplate(
      `<h1 style="${h1Style}">You're all in, ${firstName}.</h1>
      <p style="${pStyle}">
        ${planLabel} access is now active for your entire family. Here's what you've unlocked:
      </p>
      <ul style="${pStyle} padding-left: 20px;">
        <li style="margin-bottom: 8px;">Unlimited push notifications</li>
        <li style="margin-bottom: 8px;">Full weekly briefings (every week, not just 4)</li>
        <li style="margin-bottom: 8px;">Complete task library across all stages</li>
        <li style="margin-bottom: 8px;">Budget planner with pricing data</li>
        <li style="margin-bottom: 8px;">Dad journey challenges and mood tracking</li>
      </ul>
      ${ctaButton("Explore full access", `${APP_URL}/dashboard`)}`,
      `${planLabel} access unlocked for your family.`
    ),
  };
}

function subscriptionExpiringEmail(firstName: string, daysRemaining?: number): EmailContent {
  const days = daysRemaining ?? 7;
  return {
    subject: `Your access ends in ${days} days`,
    html: baseTemplate(
      `<h1 style="${h1Style}">Heads up, ${firstName}.</h1>
      <p style="${pStyle}">
        Your premium access expires in ${days} day${days !== 1 ? "s" : ""}. After that, you'll lose
        push notifications, full briefings, and the complete task library.
      </p>
      <p style="${pStyle}">
        Your family's data stays safe — you can resubscribe anytime to pick up where you left off.
      </p>
      ${ctaButton("Keep full access", `${APP_URL}/upgrade`)}`,
      `Your premium access expires in ${days} days.`
    ),
  };
}

function paymentFailedEmail(firstName: string): EmailContent {
  return {
    subject: "Your payment didn't go through",
    html: baseTemplate(
      `<h1 style="${h1Style}">Payment issue, ${firstName}.</h1>
      <p style="${pStyle}">
        We couldn't process your latest payment. Your access continues for now, but
        please update your payment method to avoid interruption.
      </p>
      ${ctaButton("Update payment method", `${APP_URL}/settings/billing`)}`,
      "We couldn't process your payment. Update your method to keep access."
    ),
  };
}

function weeklyBriefingEmail(firstName: string, week?: number): EmailContent {
  const weekNum = week ?? "?";
  return {
    subject: `Week ${weekNum} briefing ready`,
    html: baseTemplate(
      `<h1 style="${h1Style}">Week ${weekNum}, ${firstName}.</h1>
      <p style="${pStyle}">
        Your weekly briefing is ready — new developments, tasks for the week, and
        what to focus on. Takes 2 minutes.
      </p>
      ${ctaButton("Read your briefing", `${APP_URL}/briefing`)}
      <p style="font-size: 13px; color: #7a6f62; margin-top: 24px; text-align: center;">
        Briefings drop every week. Adjust frequency in
        <a href="${APP_URL}/settings/notifications" style="color: #c4703f;">notification settings</a>.
      </p>`,
      `Week ${weekNum} briefing: new developments, tasks, and focus areas.`
    ),
  };
}

function overdueDigestEmail(firstName: string, count?: number): EmailContent {
  const taskCount = count ?? 0;
  return {
    subject: `${taskCount} overdue task${taskCount !== 1 ? "s" : ""} need attention`,
    html: baseTemplate(
      `<h1 style="${h1Style}">${taskCount} task${taskCount !== 1 ? "s" : ""} overdue.</h1>
      <p style="${pStyle}">
        ${firstName}, you have ${taskCount} must-do task${taskCount !== 1 ? "s" : ""} past due.
        Catch up before they pile up.
      </p>
      ${ctaButton("View tasks", `${APP_URL}/tasks`)}`,
      `${taskCount} must-do tasks need your attention.`
    ),
  };
}

function reEngagementEmail(firstName: string, daysInactive?: number): EmailContent {
  const days = daysInactive ?? 7;
  if (days <= 7) {
    return {
      subject: "Tasks need attention",
      html: baseTemplate(
        `<h1 style="${h1Style}">Been a minute, ${firstName}.</h1>
        <p style="${pStyle}">
          Your task list has been waiting. A quick check-in takes 30 seconds
          and keeps everything on track.
        </p>
        ${ctaButton("Check your tasks", `${APP_URL}/tasks`)}`,
        "Your task list needs attention."
      ),
    };
  } else if (days <= 21) {
    return {
      subject: "Quick update on your pregnancy",
      html: baseTemplate(
        `<h1 style="${h1Style}">Things have changed, ${firstName}.</h1>
        <p style="${pStyle}">
          Your baby has been growing. New briefings, updated tasks, and
          milestones are waiting for you. Two minutes to catch up.
        </p>
        ${ctaButton("See what's new", `${APP_URL}/briefing`)}`,
        "New briefings and milestones since you last checked in."
      ),
    };
  } else {
    return {
      subject: "We're still here when you need us",
      html: baseTemplate(
        `<h1 style="${h1Style}">No pressure, ${firstName}.</h1>
        <p style="${pStyle}">
          Your data is safe and your dashboard is ready whenever you are.
          Pick up where you left off anytime.
        </p>
        ${ctaButton("Open your dashboard", `${APP_URL}/dashboard`)}
        <p style="font-size: 13px; color: #7a6f62; margin-top: 24px; text-align: center;">
          This is our last check-in. We won't email again unless you come back.
          <a href="${APP_URL}/settings/notifications" style="color: #c4703f;">Unsubscribe</a>
        </p>`,
        "Your dashboard is ready whenever you are."
      ),
    };
  }
}

function onboardingDripEmail(firstName: string, day?: number, hint?: string): EmailContent {
  switch (day) {
    case 1:
      return {
        subject: "Your weekly briefing is ready",
        html: baseTemplate(
          `<h1 style="${h1Style}">Your first briefing, ${firstName}.</h1>
          <p style="${pStyle}">
            Every week, you get a briefing with what's happening — baby development,
            tasks to tackle, and what to focus on. Takes 2 minutes.
          </p>
          ${ctaButton("Read your briefing", `${APP_URL}/briefing`)}`,
          "Your first weekly briefing is ready. 2 minute read."
        ),
      };
    case 3:
      return {
        subject: "Tasks waiting for you",
        html: baseTemplate(
          `<h1 style="${h1Style}">Your task list is set up, ${firstName}.</h1>
          <p style="${pStyle}">
            We've loaded tasks based on your stage. Start with the must-do items —
            knock out the first one in under 5 minutes.
          </p>
          ${ctaButton("View your tasks", `${APP_URL}/tasks`)}`,
          "Tasks loaded based on your stage. Start with the must-dos."
        ),
      };
    case 5:
      return {
        subject: "Better together — invite your partner",
        html: baseTemplate(
          `<h1 style="${h1Style}">One subscription, two parents.</h1>
          <p style="${pStyle}">
            ${firstName}, your partner can join your family account at no extra cost.
            You'll see each other's progress, share tasks, and stay aligned.
          </p>
          ${ctaButton("Invite your partner", `${APP_URL}/settings`)}`,
          "Invite your partner — one subscription covers both of you."
        ),
      };
    case 7:
      return {
        subject: "Your first week: here's what happened",
        html: baseTemplate(
          `<h1 style="${h1Style}">One week in, ${firstName}.</h1>
          <p style="${pStyle}">
            You've had your first week with The Dad Center. Keep the momentum going —
            your next briefing drops soon with new developments and tasks.
          </p>
          ${ctaButton("See your dashboard", `${APP_URL}/dashboard`)}`,
          "Your first week recap. Keep the momentum going."
        ),
      };
    default:
      return {
        subject: `Update from The Dad Center`,
        html: baseTemplate(
          `<h1 style="${h1Style}">Hey ${firstName}.</h1>
          <p style="${pStyle}">New updates are waiting for you on your dashboard.</p>
          ${ctaButton("Open dashboard", `${APP_URL}/dashboard`)}`,
          "New updates on your dashboard."
        ),
      };
  }
}

// --- Template Helpers ---

const h1Style =
  "font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: bold; color: #1a1714; margin: 0 0 16px; line-height: 1.3;";
const pStyle =
  "font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; color: #4a4239; line-height: 1.6; margin: 0 0 16px;";

function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px auto 0;">
    <tr>
      <td style="background-color: #c4703f; border-radius: 8px;">
        <a href="${url}" style="display: inline-block; padding: 14px 32px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

function baseTemplate(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Dad Center</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #faf6f0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf6f0;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px;">
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: bold; color: #1a1714; letter-spacing: 0.5px;">
                The Dad Center
              </span>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; border-radius: 12px; padding: 40px 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="font-size: 12px; color: #7a6f62; margin: 0 0 8px;">
                The Dad Center &mdash; the operating system for modern fatherhood
              </p>
              <p style="font-size: 12px; color: #7a6f62; margin: 0;">
                <a href="${APP_URL}/settings/notifications" style="color: #c4703f; text-decoration: underline;">Manage email preferences</a>
                &nbsp;&middot;&nbsp;
                <a href="${APP_URL}/settings/notifications" style="color: #c4703f; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// --- Resend API ---

async function sendViaResend(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
        headers: {
          "List-Unsubscribe": `<${APP_URL}/settings/notifications>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Resend API error:", response.status, err);
      return { success: false, error: `Resend ${response.status}: ${err}` };
    }

    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Resend fetch failed:", msg);
    return { success: false, error: msg };
  }
}

// --- Delivery Logging ---

async function logEmailDelivery(userId: string, status: "sent" | "failed", errorMessage?: string): Promise<void> {
  try {
    await supabase.from("notification_delivery_log").insert({
      user_id: userId,
      channel: "email",
      status,
      error_message: errorMessage || null,
    });
  } catch (err) {
    console.error("Failed to log email delivery:", err);
  }
}
