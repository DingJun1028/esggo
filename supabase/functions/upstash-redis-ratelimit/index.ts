import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// TODO: 借鑒與整合 Upstash Redis 進行限速
// import { Redis } from "https://deno.land/x/upstash_redis/mod.ts";
// const redis = new Redis({
//   url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
//   token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
// });

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Mock rate limiting logic
    // const count = await redis.incr(`ratelimit:${ip}`)
    // if (count > 100) throw new Error('Too many requests')
    const allowed = true

    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      })
    }

    return new Response(JSON.stringify({ message: 'Request allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
