import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image_base64, tone, prompt, platform = 'instagram' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!image_base64) {
      return new Response(JSON.stringify({ error: 'Image data required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Platform-specific optimization rules
    const platformRules = {
      instagram: {
        maxLength: 2200,
        hashtagCount: '20-30',
        style: 'Visual-first with line breaks, use emojis generously',
        algorithm: 'Prioritize engagement bait, use trending hashtags, include call-to-action'
      },
      linkedin: {
        maxLength: 3000,
        hashtagCount: '3-5',
        style: 'Professional with value-driven content',
        algorithm: 'Focus on industry insights, thought leadership, use fewer hashtags'
      },
      twitter: {
        maxLength: 280,
        hashtagCount: '1-2',
        style: 'Concise and punchy, thread-friendly',
        algorithm: 'Optimize for retweets, keep it short, use trending hashtags sparingly'
      },
      threads: {
        maxLength: 500,
        hashtagCount: '0-3',
        style: 'Conversational and authentic',
        algorithm: 'Focus on storytelling, minimal hashtags, encourage replies'
      }
    };

    const rules = platformRules[platform] || platformRules.instagram;

    // Generate captions with platform optimization using Lovable AI
    const systemPrompt = `You are an expert social media content creator specializing in ${platform.toUpperCase()}. Generate 3 DISTINCT caption variations optimized for ${platform}'s algorithm.

PLATFORM OPTIMIZATION FOR ${platform.toUpperCase()}:
- Maximum length: ${rules.maxLength} characters
- Style: ${rules.style}
- Algorithm optimization: ${rules.algorithm}
- Hashtag count: ${rules.hashtagCount}

VARIATION REQUIREMENTS:
- Variation A: Hook-focused (grab attention in first line)
- Variation B: Story-driven (narrative approach)
- Variation C: Direct and concise (straight to the point)

Each variation must include:
1. The caption text optimized for ${platform}
2. Suggested hashtags (${rules.hashtagCount}) on a new line starting with "HASHTAGS:"
3. Relevant keywords for discoverability on a new line starting with "KEYWORDS:"

Format each variation exactly as:
VARIATION A:
[caption text]
HASHTAGS: #tag1 #tag2 #tag3
KEYWORDS: keyword1, keyword2, keyword3

VARIATION B:
[caption text]
HASHTAGS: #tag1 #tag2 #tag3
KEYWORDS: keyword1, keyword2, keyword3

VARIATION C:
[caption text]
HASHTAGS: #tag1 #tag2 #tag3
KEYWORDS: keyword1, keyword2, keyword3`;

    const userPrompt = prompt ? `Additional context: ${prompt}\n\nAnalyze this image and generate captions with the ${tone} tone.` : `Analyze this image and generate captions with the ${tone} tone.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'user', 
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'text', text: userPrompt },
              { 
                type: 'image_url', 
                image_url: { 
                  url: `data:image/jpeg;base64,${image_base64}` 
                } 
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted. Please contact support.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorData = await response.text();
      console.error('Lovable AI error:', response.status, errorData);
      return new Response(JSON.stringify({ error: 'Failed to generate captions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    // Parse variations with hashtags and keywords
    const variations = [];
    const variationMatches = generatedText.split(/VARIATION [ABC]:/i).filter(v => v.trim());
    
    for (const variation of variationMatches.slice(0, 3)) {
      const lines = variation.split('\n').filter(l => l.trim());
      let caption = '';
      let hashtags = [];
      let keywords = [];
      
      for (const line of lines) {
        if (line.toUpperCase().startsWith('HASHTAGS:')) {
          hashtags = line.replace(/HASHTAGS:/i, '').trim().split(/\s+/).filter(h => h.startsWith('#'));
        } else if (line.toUpperCase().startsWith('KEYWORDS:')) {
          keywords = line.replace(/KEYWORDS:/i, '').trim().split(',').map(k => k.trim());
        } else if (!line.toUpperCase().startsWith('VARIATION')) {
          caption += (caption ? '\n' : '') + line;
        }
      }
      
      if (caption.trim()) {
        variations.push({
          caption: caption.trim(),
          hashtags,
          keywords,
          platform
        });
      }
    }

    return new Response(JSON.stringify({ variations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-captions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});