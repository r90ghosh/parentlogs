import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RC_WEBHOOK_AUTH = Deno.env.get("REVENUCAT_WEBHOOK_AUTH");

const PRODUCT_TIER_MAP: Record<string, "premium" | "lifetime"> = {
  // App Store product IDs (production)
  "tdc_monthly_499": "premium",
  "tdc_annual_3999": "premium",
  "tdc_lifetime_9999": "lifetime",
  // Test Store product IDs (sandbox)
  "monthly": "premium",
  "yearly": "premium",
  "lifetime": "lifetime",
};

async function updateFamilyTier(userId: string, tier: string) {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("family_id")
    .eq("id", userId)
    .single();

  if (!profile?.family_id) return;

  // Update all profiles in the family (one subscription per family)
  await supabaseAdmin
    .from("profiles")
    .update({
      subscription_tier: tier,
      subscription_expires_at:
        tier === "lifetime" ? null : new Date().toISOString(),
    })
    .eq("family_id", profile.family_id);
}

Deno.serve(async (req: Request) => {
  // Verify auth header
  const authHeader = req.headers.get("Authorization");
  if (!RC_WEBHOOK_AUTH || authHeader !== `Bearer ${RC_WEBHOOK_AUTH}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const event = body.event;
    const userId = event.app_user_id;

    if (!userId) {
      console.error("No app_user_id in RevenueCat webhook event");
      return new Response(JSON.stringify({ error: "Missing app_user_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    switch (event.type) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "PRODUCT_CHANGE":
      case "UNCANCELLATION": {
        const tier = PRODUCT_TIER_MAP[event.product_id] || "premium";
        const platform =
          event.store === "APP_STORE" ? "ios" : "android";
        const expiresAt = event.expiration_at_ms
          ? new Date(event.expiration_at_ms).toISOString()
          : null;

        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            revenucat_app_user_id: event.original_app_user_id,
            tier,
            status: "active",
            platform,
            store_product_id: event.product_id,
            store_original_transaction_id: event.original_transaction_id,
            current_period_start: new Date(
              event.purchased_at_ms
            ).toISOString(),
            current_period_end: expiresAt,
            cancel_at_period_end: false,
            last_verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        // Update profile and family tier
        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: tier,
            subscription_expires_at: expiresAt,
          })
          .eq("id", userId);

        await updateFamilyTier(userId, tier);
        break;
      }

      case "CANCELLATION": {
        const expiresAt = event.expiration_at_ms
          ? new Date(event.expiration_at_ms).toISOString()
          : new Date(Date.now() + 7 * 86400000).toISOString();

        await supabaseAdmin
          .from("subscriptions")
          .update({
            cancel_at_period_end: true,
            current_period_end: expiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
        break;
      }

      case "EXPIRATION": {
        const graceEnd = new Date(
          Date.now() + 7 * 86400000
        ).toISOString();

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            current_period_end: graceEnd,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        // Downgrade profile — grace period handled by subscription-service
        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: "free",
            subscription_expires_at: graceEnd,
          })
          .eq("id", userId);

        await updateFamilyTier(userId, "free");
        break;
      }

      case "BILLING_ISSUE": {
        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
        break;
      }

      default:
        console.log(`Unhandled RevenueCat event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("RevenueCat webhook error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
