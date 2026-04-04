import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RAZORPAY_KEY_ID = "rzp_live_SZIYgnAQN4Bg5n";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!RAZORPAY_KEY_SECRET) {
    return new Response(JSON.stringify({ error: "RAZORPAY_KEY_SECRET not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { action, payment_id, order_id, signature, amount } = await req.json();

    if (action === "create_order") {
      const orderAmount = (amount || 39) * 100; // paise
      const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: orderAmount,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      const order = await res.json();
      if (!res.ok) {
        throw new Error(`Razorpay order creation failed [${res.status}]: ${JSON.stringify(order)}`);
      }

      return new Response(JSON.stringify({ order_id: order.id, amount: order.amount, key_id: RAZORPAY_KEY_ID }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "verify_payment") {
      if (!payment_id || !order_id || !signature) {
        return new Response(JSON.stringify({ error: "Missing payment_id, order_id, or signature" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify signature using HMAC SHA256
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw", encoder.encode(RAZORPAY_KEY_SECRET),
        { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
      );
      const data = encoder.encode(`${order_id}|${payment_id}`);
      const sig = await crypto.subtle.sign("HMAC", key, data);
      const expectedSig = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");

      if (expectedSig !== signature) {
        return new Response(JSON.stringify({ error: "Invalid signature", verified: false }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Store verified payment
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: accessCode } = await supabase.rpc("generate_access_code");

      await supabase.from("payments").insert({
        amount: 39,
        razorpay_payment_id: payment_id,
        razorpay_order_id: order_id,
        status: "verified",
        verified_at: new Date().toISOString(),
        access_code: accessCode || `AC-${Date.now()}`,
      });

      return new Response(JSON.stringify({ verified: true, access_code: accessCode }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
