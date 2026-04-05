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
    const { action, payment_id, order_id, signature, amount, email, name } = await req.json();

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

      const finalAccessCode = accessCode || `AC-${Date.now()}`;

      await supabase.from("payments").insert({
        amount: amount || 39,
        razorpay_payment_id: payment_id,
        razorpay_order_id: order_id,
        status: "verified",
        verified_at: new Date().toISOString(),
        access_code: finalAccessCode,
      });

      // Send email receipt via Resend (best-effort)
      if (email) {
        try {
          const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
          if (RESEND_API_KEY) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from: "Ad Atelier AI <onboarding@resend.dev>",
                to: [email],
                subject: "Payment Receipt — Ad Atelier AI",
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #0057D9, #007BFF); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 22px;">Payment Receipt</h1>
                    </div>
                    <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                      <p style="color: #374151;">Hi ${name || "there"},</p>
                      <p style="color: #374151;">Thank you for your payment! Here are the details:</p>
                      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                        <tr><td style="padding: 8px 0; color: #6b7280;">Amount</td><td style="padding: 8px 0; font-weight: bold; color: #374151; text-align: right;">₹${amount || 39}</td></tr>
                        <tr><td style="padding: 8px 0; color: #6b7280;">Payment ID</td><td style="padding: 8px 0; font-family: monospace; color: #374151; text-align: right; font-size: 12px;">${payment_id}</td></tr>
                        <tr><td style="padding: 8px 0; color: #6b7280;">Order ID</td><td style="padding: 8px 0; font-family: monospace; color: #374151; text-align: right; font-size: 12px;">${order_id}</td></tr>
                        <tr style="border-top: 1px solid #e5e7eb;"><td style="padding: 12px 0; color: #6b7280;">Access Code</td><td style="padding: 12px 0; font-weight: bold; color: #0057D9; text-align: right; font-size: 16px; letter-spacing: 2px;">${finalAccessCode}</td></tr>
                      </table>
                      <p style="color: #6b7280; font-size: 13px;">Keep this email for your records. Your access code is your key to premium features.</p>
                      <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">— The Ad Atelier AI Team</p>
                    </div>
                  </div>
                `,
              }),
            });
          }
        } catch (emailErr) {
          console.warn("Receipt email failed:", emailErr);
        }
      }

      return new Response(JSON.stringify({ verified: true, access_code: finalAccessCode }), {
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
