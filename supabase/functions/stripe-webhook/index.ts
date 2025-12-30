import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.10.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

Deno.serve(async (req: Request) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        console.log("Payment succeeded for invoice:", event.data.object.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
});

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const plan = session.metadata?.plan;

  if (!userId) {
    console.error("No user_id in checkout session metadata");
    return;
  }

  // For lifetime purchase (payment mode)
  if (session.mode === "payment" && plan === "lifetime") {
    await supabaseAdmin.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id: session.customer as string,
        tier: "lifetime",
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    // Update profile
    await supabaseAdmin
      .from("profiles")
      .update({
        subscription_tier: "lifetime",
        subscription_expires_at: null,
      })
      .eq("id", userId);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: subRecord } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!subRecord) {
    console.error("No subscription record found for customer:", customerId);
    return;
  }

  const userId = subRecord.user_id;
  const status = subscription.status;
  const periodEnd = new Date(subscription.current_period_end * 1000);

  let tier: "free" | "premium" | "lifetime" = "free";
  if (status === "active" || status === "trialing") {
    tier = "premium";
  }

  await supabaseAdmin
    .from("subscriptions")
    .update({
      stripe_subscription_id: subscription.id,
      tier,
      status,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  await supabaseAdmin
    .from("profiles")
    .update({
      subscription_tier: tier,
      subscription_expires_at: periodEnd.toISOString(),
    })
    .eq("id", userId);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: subRecord } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!subRecord) return;

  await supabaseAdmin
    .from("subscriptions")
    .update({
      tier: "free",
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", subRecord.user_id);

  await supabaseAdmin
    .from("profiles")
    .update({ subscription_tier: "free" })
    .eq("id", subRecord.user_id);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const { data: subRecord } = await supabaseAdmin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!subRecord) return;

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", subRecord.user_id);
}
