import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  name: string;
  inquiryType: string;
  message: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { to, subject, name, inquiryType, message }: EmailRequest = await req.json();

    if (!to || !subject || !name || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, name, message' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send notification to admin
    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Ad Atelier AI <onboarding@resend.dev>',
        to: ['adnan4402business@gmail.com'],
        subject: `[${inquiryType}] ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0057D9, #007BFF); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">New Contact Form Submission</h1>
            </div>
            <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${to}</p>
              <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; color: #374151;">${message}</p>
            </div>
          </div>
        `,
      }),
    });

    if (!adminRes.ok) {
      const err = await adminRes.text();
      throw new Error(`Resend admin email failed [${adminRes.status}]: ${err}`);
    }

    // Send auto-reply to the user
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Ad Atelier AI <onboarding@resend.dev>',
        to: [to],
        subject: 'Thanks for reaching out — Ad Atelier AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0057D9, #007BFF); padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">Thank You, ${name}!</h1>
            </div>
            <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="color: #374151; line-height: 1.6;">We've received your message and our team will get back to you within 24-48 hours.</p>
              <p style="color: #6b7280; font-size: 14px;">— The Ad Atelier AI Team</p>
            </div>
          </div>
        `,
      }),
    });

    if (!userRes.ok) {
      console.error('Auto-reply failed:', await userRes.text());
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Email send error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
