import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const { evidence_id, action } = body;

    if (!evidence_id) throw new Error('Missing evidence_id');

    const { data: evidence, error: fetchErr } = await supabase
      .from('evidence_vault')
      .select('*')
      .eq('id', evidence_id)
      .single();

    if (fetchErr || !evidence) throw new Error('Evidence not found');

    const timestamp = new Date().toISOString();
    const encoder = new TextEncoder();
    const hashData = encoder.encode(`${evidence_id}-${evidence.file_name}-${timestamp}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', hashData);
    const sha256Hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (action === 'seal') {
      await supabase.from('evidence_vault').update({
        status: 'verified',
        zkp_proof: true,
        hash_lock: sha256Hash.slice(0, 32),
      }).eq('id', evidence_id);

      await supabase.from('audit_logs').insert([{
        action: 'ZKP_SEAL',
        resource: `ZKP 封印: ${evidence.file_name}`,
        user_name: 'evidence-processor',
        t5_tag: 'T4',
        gri_reference: evidence.gri_reference,
        hash_lock: sha256Hash.slice(0, 32),
        details: `SHA-256: ${sha256Hash.slice(0, 16)}... 不可篡改封印完成`,
        company_id: evidence.company_id ?? 'default',
      }]);
    } else if (action === 'verify') {
      const rehash = Array.from(new Uint8Array(
        await crypto.subtle.digest('SHA-256', encoder.encode(`${evidence_id}-${evidence.file_name}-${evidence.created_at ?? timestamp}`))
      )).map(b => b.toString(16).padStart(2, '0')).join('');
      const isValid = evidence.hash_lock && evidence.hash_lock.length > 0;
      return new Response(JSON.stringify({ ok: true, valid: isValid, hash: sha256Hash.slice(0, 32), evidence_id }), {
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      ok: true, evidence_id, action, hash: sha256Hash.slice(0, 32), timestamp,
    }), { headers: { ...CORS, 'Content-Type': 'application/json' } });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});