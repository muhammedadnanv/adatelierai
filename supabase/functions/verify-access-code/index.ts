import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { access_code } = await req.json();

    if (!access_code || typeof access_code !== 'string') {
      return new Response(JSON.stringify({ error: 'Access code is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const code = access_code.trim().toUpperCase();
    // Basic format guard to avoid abuse: XXXX-XXXX-XXXX-XXXX (alphanumeric)
    if (!/^[A-Z0-9-]{8,32}$/.test(code)) {
      return new Response(JSON.stringify({ error: 'Invalid access code format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabase
      .from('payments')
      .select('id, amount, currency, status, access_code, created_at, verified_at')
      .eq('access_code', code)
      .eq('status', 'verified')
      .maybeSingle();

    if (error) {
      console.error('Lookup error:', error.message);
      return new Response(JSON.stringify({ error: 'Lookup failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ payment: data || null }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('verify-access-code error:', msg);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
