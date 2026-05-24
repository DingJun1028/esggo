// ============================================================
// ESG GO | Audit Guardian (異步審計守護者)
// 5T Integrity Protocol - Asynchronous Verification Logic
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()

    console.log(`[Audit Guardian] Processing record: ${record.id} for action: ${record.action}`)

    // 1. Initialize System Client (Internal verification)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Perform "Zero-Hallucination" Verification
    // Re-calculating the hash locally in the Edge Function to verify DB trigger consistency
    const payloadToVerify = JSON.stringify(record.details)
    const encoder = new TextEncoder()
    const data = encoder.encode(payloadToVerify)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const verifiedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    const isConsistent = verifiedHash === record.hash_lock

    // 3. Log the Verification Result to a Sacred Meta-Registry (optional external sync)
    console.log(`[Audit Guardian] Hash Consistency: ${isConsistent ? '✅ VERIFIED' : '❌ FAILED'}`)

    // 4. Update the audit_log with verification metadata if needed
    // (This demonstrates the "Trackable" lifecycle)
    if (isConsistent) {
       await supabase
         .from('audit_logs')
         .update({ 
           details: JSON.stringify({ 
             ...JSON.parse(record.details || '{}'), 
             edge_verified: true, 
             verified_at: new Date().toISOString() 
           }) 
         })
         .eq('id', record.id)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Audit sequence verified by Guardian', 
        consistent: isConsistent 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error(`[Audit Guardian Error]: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
