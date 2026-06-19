import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 借鑒與整合：非同步大型檔案上傳處理 (例如 TUS protocol 或透過 Signed URL 直接傳)
    // 這裡示範取得 Signed URL 來讓前端直傳，減輕 Edge Function 記憶體壓力
    const { fileName } = await req.json()

    if (!fileName) throw new Error('File name is required')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data, error } = await supabaseClient.storage
      .from('evidence_vault')
      .createSignedUploadUrl(`${Date.now()}_${fileName}`)

    if (error) throw error

    return new Response(JSON.stringify({ signedUrl: data.signedUrl, token: data.token, path: data.path }), {
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
