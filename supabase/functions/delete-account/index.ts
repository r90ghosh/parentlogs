import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ALLOWED_ORIGINS = [
  "https://thedadcenter.com",
  "https://www.thedadcenter.com",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin") || "";
  const corsOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

// --- Apple Sign-In Token Revocation ---

/**
 * Generate an Apple client secret JWT (ES256, 6-month expiry).
 * Required env vars: APPLE_TEAM_ID, APPLE_CLIENT_ID (Services ID),
 * APPLE_KEY_ID, APPLE_PRIVATE_KEY (PEM, with escaped newlines).
 */
async function generateAppleClientSecret(): Promise<string> {
  const teamId = Deno.env.get("APPLE_TEAM_ID");
  const clientId = Deno.env.get("APPLE_CLIENT_ID");
  const keyId = Deno.env.get("APPLE_KEY_ID");
  const privateKeyPem = Deno.env.get("APPLE_PRIVATE_KEY")?.replace(
    /\\n/g,
    "\n"
  );

  if (!teamId || !clientId || !keyId || !privateKeyPem) {
    throw new Error("Missing Apple Sign-In environment variables");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "ES256", kid: keyId };
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 15777000, // ~6 months
    aud: "https://appleid.apple.com",
    sub: clientId,
  };

  const encode = (obj: Record<string, unknown>) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const signingInput = `${encode(header)}.${encode(payload)}`;

  // Import the PKCS#8 private key
  const pemBody = privateKeyPem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const keyData = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(signingInput)
  );

  // Convert DER signature to raw r||s format for JWT
  const sigBytes = new Uint8Array(signature);
  const sigBase64 = btoa(String.fromCharCode(...sigBytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${signingInput}.${sigBase64}`;
}

/**
 * Revoke an Apple Sign-In token using the authorization code stored during sign-in.
 */
async function revokeAppleToken(authorizationCode: string): Promise<void> {
  const clientId = Deno.env.get("APPLE_CLIENT_ID");
  if (!clientId) throw new Error("Missing APPLE_CLIENT_ID");

  const clientSecret = await generateAppleClientSecret();

  const response = await fetch("https://appleid.apple.com/auth/revoke", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      token: authorizationCode,
      token_type_hint: "authorization_code",
    }).toString(),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Apple token revocation failed (${response.status}): ${body}`
    );
  }
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify the user's JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const userId = user.id;
    console.log(`[delete-account] Starting deletion for user: ${userId}`);

    // Get profile to find family_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("family_id")
      .eq("id", userId)
      .single();

    // Check family ownership BEFORE any deletions
    if (profile?.family_id) {
      const { data: family } = await supabase
        .from("families")
        .select("owner_id")
        .eq("id", profile.family_id)
        .single();

      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("family_id", profile.family_id);

      const isOwner = family?.owner_id === userId;
      const hasOtherMembers = (count || 0) > 1;

      if (isOwner && hasOtherMembers) {
        return new Response(
          JSON.stringify({
            error:
              "Cannot delete account while other family members exist. Transfer ownership first.",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Delete user-scoped data (child tables first)
    // Mirrors the web API route at apps/web/src/app/api/account/delete/route.ts

    const { error: notifError } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId);
    if (notifError) console.error("Failed to delete notifications:", notifError);

    const { error: moodError } = await supabase
      .from("mood_checkins")
      .delete()
      .eq("user_id", userId);
    if (moodError) console.error("Failed to delete mood_checkins:", moodError);

    const { error: dadProfileError } = await supabase
      .from("dad_profiles")
      .delete()
      .eq("user_id", userId);
    if (dadProfileError)
      console.error("Failed to delete dad_profiles:", dadProfileError);

    const { error: notifPrefError } = await supabase
      .from("notification_preferences")
      .delete()
      .eq("user_id", userId);
    if (notifPrefError)
      console.error(
        "Failed to delete notification_preferences:",
        notifPrefError
      );

    const { error: pushSubError } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("user_id", userId);
    if (pushSubError)
      console.error("Failed to delete push_subscriptions:", pushSubError);

    const { error: deviceTokenError } = await supabase
      .from("device_tokens")
      .delete()
      .eq("user_id", userId);
    if (deviceTokenError)
      console.error("Failed to delete device_tokens:", deviceTokenError);

    const { error: contactError } = await supabase
      .from("contact_messages")
      .delete()
      .eq("user_id", userId);
    if (contactError)
      console.error("Failed to delete contact_messages:", contactError);

    // Cancel active subscriptions before deleting records
    const { data: subRecord } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, platform")
      .eq("user_id", userId)
      .single();

    if (subRecord?.stripe_subscription_id && subRecord?.platform !== 'mobile') {
      // Cancel Stripe subscription (web purchases only)
      try {
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
        if (stripeKey) {
          const res = await fetch(
            `https://api.stripe.com/v1/subscriptions/${subRecord.stripe_subscription_id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${stripeKey}`,
              },
            }
          );
          if (res.ok) {
            console.log(`[delete-account] Canceled Stripe subscription: ${subRecord.stripe_subscription_id}`);
          } else {
            console.error(`[delete-account] Stripe cancel failed (${res.status}): ${await res.text()}`);
          }
        }
      } catch (stripeErr) {
        console.error("[delete-account] Failed to cancel Stripe subscription:", stripeErr);
      }
    }

    // Revoke RevenueCat subscriber access (mobile purchases)
    try {
      const rcApiKey = Deno.env.get("REVENUECAT_API_KEY");
      if (rcApiKey) {
        const res = await fetch(
          `https://api.revenuecat.com/v1/subscribers/${userId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${rcApiKey}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok || res.status === 404) {
          console.log(`[delete-account] Deleted RevenueCat subscriber: ${userId}`);
        } else {
          console.error(`[delete-account] RevenueCat delete failed (${res.status}): ${await res.text()}`);
        }
      }
    } catch (rcErr) {
      console.error("[delete-account] Failed to delete RevenueCat subscriber:", rcErr);
    }

    const { error: subError } = await supabase
      .from("subscriptions")
      .delete()
      .eq("user_id", userId);
    if (subError) console.error("Failed to delete subscriptions:", subError);

    // Handle family-scoped data
    if (profile?.family_id) {
      const { data: family } = await supabase
        .from("families")
        .select("owner_id")
        .eq("id", profile.family_id)
        .single();

      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("family_id", profile.family_id);

      const isOwner = family?.owner_id === userId;
      const hasOtherMembers = (count || 0) > 1;

      // If owner and sole member, delete the entire family
      if (isOwner && !hasOtherMembers) {
        const { error: checklistError } = await supabase
          .from("checklist_progress")
          .delete()
          .eq("family_id", profile.family_id);
        if (checklistError)
          console.error("Failed to delete checklist_progress:", checklistError);

        const { error: budgetError } = await supabase
          .from("family_budget")
          .delete()
          .eq("family_id", profile.family_id);
        if (budgetError)
          console.error("Failed to delete family_budget:", budgetError);

        const { error: babyLogsError } = await supabase
          .from("baby_logs")
          .delete()
          .eq("family_id", profile.family_id);
        if (babyLogsError)
          console.error("Failed to delete baby_logs:", babyLogsError);

        const { error: tasksError } = await supabase
          .from("family_tasks")
          .delete()
          .eq("family_id", profile.family_id);
        if (tasksError)
          console.error("Failed to delete family_tasks:", tasksError);

        const { error: babiesError } = await supabase
          .from("babies")
          .delete()
          .eq("family_id", profile.family_id);
        if (babiesError)
          console.error("Failed to delete babies:", babiesError);

        // Delete profile before family (profile has family_id FK)
        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", userId);
        if (profileError)
          console.error("Failed to delete profile:", profileError);

        const { error: familyError } = await supabase
          .from("families")
          .delete()
          .eq("id", profile.family_id);
        if (familyError)
          console.error("Failed to delete family:", familyError);
      } else {
        // Other members exist — just delete this user's profile
        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", userId);
        if (profileError)
          console.error("Failed to delete profile:", profileError);
      }
    } else {
      // No family — just delete profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      if (profileError)
        console.error("Failed to delete profile:", profileError);
    }

    // Revoke Apple Sign-In token if user signed in with Apple (required by Apple)
    const appleIdentity = user.identities?.find(
      (i) => i.provider === "apple"
    );
    if (appleIdentity) {
      const appleAuthCode =
        user.user_metadata?.apple_authorization_code as string | undefined;
      if (appleAuthCode) {
        try {
          await revokeAppleToken(appleAuthCode);
          console.log(
            `[delete-account] Successfully revoked Apple token for user: ${userId}`
          );
        } catch (revokeErr) {
          // Log but don't block account deletion — Apple may reject stale codes
          console.error(
            "[delete-account] Failed to revoke Apple token:",
            revokeErr
          );
        }
      } else {
        console.warn(
          `[delete-account] Apple user ${userId} has no stored authorization code — cannot revoke token`
        );
      }
    }

    // Delete the auth user (final step)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error(
        `[delete-account] Failed to delete auth user: ${deleteError.message}`
      );
      return new Response(
        JSON.stringify({
          error: "Failed to delete account. Please contact support.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`[delete-account] Successfully deleted user: ${userId}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[delete-account] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
