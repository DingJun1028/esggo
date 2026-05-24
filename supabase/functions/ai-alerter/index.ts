// ============================================================
// ESG GO | AI Alerter v1.1 (Multi-Event Intelligence)
// Proactive Risk Assessment & Multi-Trigger Support
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { event, record } = await req.json()
    console.log(`[AI Alerter] Event: ${event} | Target: ${record.gri_standard || record.file_name}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let alertData = {
      company_id: record.company_id,
      severity: 'medium',
      title: 'AI 系統提示',
      description: '',
      gri_tag: record.gri_standard,
      suggested_fix: '',
      is_resolved: false
    }

    // 1. Dynamic Risk Profiling
    if (event === 'ANOMALY_DETECTED') {
      alertData.severity = record.metric_value > 10000 ? 'critical' : 'high'
      alertData.title = `數據異常飆升：${record.gri_standard}`
      alertData.description = `偵測到數值 ${record.metric_value} ${record.unit}，顯著偏離歷史基準。`
      alertData.suggested_fix = '請核對原始憑證，並執行 5T 重新校準。'
    } 
    else if (event === 'INTEGRITY_GAP') {
      alertData.severity = 'medium'
      alertData.title = `誠信鏈缺角預警`
      alertData.description = `上傳的證據檔案尚未關聯 GRI 指標，這將導致報告無法自動引用。`
      alertData.suggested_fix = '進入證據金庫，為該檔案標記對應的 GRI 揭露編號。'
    }

    // 2. Engrave the Alert
    const { error } = await supabase.from('ai_alerts').insert(alertData)
    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error(`[AI Alerter Error]: ${error.message}`)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
