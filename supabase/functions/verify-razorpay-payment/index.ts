import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing payment verification parameters');
    }

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac("sha256", razorpayKeySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate unique access code
    const { data: accessCodeData, error: accessCodeError } = await supabase.rpc('generate_access_code');
    
    if (accessCodeError) {
      console.error('Error generating access code:', accessCodeError);
      throw new Error('Failed to generate access code');
    }

    const accessCode = accessCodeData;

    // Store payment record with access code
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        razorpay_payment_id,
        razorpay_order_id,
        amount: 39900,
        currency: 'INR',
        access_code: accessCode,
        status: 'completed',
        verified_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error storing payment:', paymentError);
      throw new Error('Failed to store payment record');
    }

    console.log('Payment verified and access code generated:', accessCode);

    // Payment verified successfully
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        access_code: accessCode
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
