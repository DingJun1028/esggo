// ============================================================
// ESG GO | Data Alchemy Furnace (授權數據煉金爐)
// Scenario B: Frontend-called logic with identity inheritance
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS for frontend integration
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Extract the "Sacred Sigil" (User's JWT)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    // 3. Initialize Scoped Client (Inherit Identity)
    // Using ANON_KEY but injecting the user's JWT to trigger RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: authHeader } 
        } 
      }
    )

    // 4. Extract Request Data
    const { action, params } = await req.json()

    // 5. Perform "Alchemy" (Complex Business Logic)
    // Example: Aggregating emission intensity with RLS safety
    let result = null

    if (action === 'calculate_intensity') {
      const { year } = params
      
      // This query is AUTOMATICALLY scoped to the user's company_id by RLS
      const { data, error } = await supabase
        .from('environmental_data')
        .select('metric_value, unit')
        .eq('year', year)
        .eq('category', 'GHG')

      if (error) throw error

      // Alchemy calculation: Summing values across RLS-authorized rows
      const totalEmissions = data.reduce((sum, item) => sum + (Number(item.metric_value) || 0), 0)
      
      result = {
        year,
        total_emissions: totalEmissions,
        status: 'ALCHEMY_SUCCESS',
        timestamp: new Date().toISOString(),
        verified_by: 'Edge_Alchemy_Furnace'
      }
    } else {
      throw new Error('Unknown alchemy action requested')
    }

    // 6. Return the Transmuted Data
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error(`[Data Alchemy Error]: ${error.message}`)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
