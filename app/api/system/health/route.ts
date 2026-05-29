import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * ⚡️ ESG GO | System Health & Composition Telemetry API
 * Provides live telemetry data for OmniMap v2.0
 */
export async function GET() {
  const start = performance.now();
  let dbStatus = 'disconnected';
  let dbLatency = 0;
  let activeAgents = 5;
  let codexEntries = 32;
  
  if (supabaseAdmin) {
    try {
      const pingStart = performance.now();
      // Execute concurrent queries to ping DB and gather swarm telemetry
      const [pingResult, agentCountResult, codexCountResult] = await Promise.all([
        supabaseAdmin.from('vault_omni_core').select('uuid').limit(1),
        supabaseAdmin.from('vault_omni_core').select('*', { count: 'exact', head: true }).eq('dimension', 'LOGIC'),
        supabaseAdmin.from('vault_omni_core').select('*', { count: 'exact', head: true }).eq('dimension', 'CORE')
      ]);

      if (!pingResult.error) {
         dbStatus = 'connected';
      }
      
      activeAgents = agentCountResult.count ?? activeAgents;
      codexEntries = codexCountResult.count ?? codexEntries;
      
      dbLatency = performance.now() - pingStart;
    } catch (e) {
      console.error('[Health] DB Ping Error:', e);
    }
  }

  const duration = performance.now() - start;
  const isHealthy = dbStatus === 'connected' && duration < 2000;
  
  const telemetry = {
    status: isHealthy ? 'operational' : 'degraded',
    integrityScore: isHealthy ? 100 : 90,
    activeAgents,
    codexEntries,
    dbLatency: Math.floor(dbLatency),
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(telemetry, { 
    status: 200, 
    headers: { 'Cache-Control': 's-maxage=5, stale-while-revalidate=10' } 
  });
}
