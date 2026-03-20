import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!supabaseServiceKey || authHeader !== `Bearer ${supabaseServiceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { partner_id, actor_id, event_type, event_data } = await req.json();

    if (!partner_id || !actor_id || !event_type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify both users belong to the same family
    const { data: members } = await supabase
      .from("profiles")
      .select("id, family_id")
      .in("id", [partner_id, actor_id]);

    if (members?.length !== 2 || members[0].family_id !== members[1].family_id) {
      return new Response(JSON.stringify({ error: "Users are not in the same family" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: actor } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", actor_id)
      .single();

    const actorName = actor?.full_name || "Your partner";
    let title: string;
    let body: string;
    let url: string;

    if (event_type === "task_completed") {
      title = `${actorName} completed a task`;
      body = event_data?.title || "A task was completed";
      url = "/tasks";
    } else if (event_type === "baby_log") {
      title = `${actorName} logged a ${event_data?.log_type || "entry"}`;
      body = "Tap to see details";
      url = "/tracker";
    } else {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create in-app notification
    await supabase.from("notifications").insert({
      user_id: partner_id,
      type: "partner_activity",
      title,
      body,
      url,
    });

    // Send push via send-notifications function
    await fetch(`${supabaseUrl}/functions/v1/send-notifications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "direct",
        user_id: partner_id,
        title,
        body,
        url,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in partner-activity:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
