import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// TODO: 借鑒與整合 OG Image 動態生成 (如 satori) 結合 CDN 快取
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Mock logic for generating OG Image
    const url = new URL(req.url)
    const title = url.searchParams.get('title') || 'ESG GO Report'

    return new Response(JSON.stringify({ message: `OG Image generated for: ${title}`, cdnUrl: "https://example.com/cdn/og.png" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
