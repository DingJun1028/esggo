import { NextRequest, NextResponse } from 'next/server';
import { pushBusEvent } from '../stream/events';

/**
 * HITL (Human-In-The-Loop) Review API
 * ────────────────────────────────────
 * Persists 5T seal review decisions into the vault_omni_core table.
 * This is the "審查聖殿" (Sanctuary of Review) — where human judgment
 * meets automated AI sealing.
 *
 * POST /api/omni-agent-api/hitl-review
 * Body: { sealId, gate, resource, hash, decision: 'approved' | 'rejected', reviewer?, notes? }
 */

interface HITLReviewPayload {
  sealId: string;
  gate: string;
  resource: string;
  hash: string;
  decision: 'approved' | 'rejected';
  reviewer?: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HITLReviewPayload;
    const { sealId, gate, resource, hash, decision, reviewer, notes } = body;

    if (!sealId || !gate || !hash || !decision) {
      return NextResponse.json(
        { error: 'Missing required fields: sealId, gate, hash, decision' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(decision)) {
      return NextResponse.json(
        { error: 'Decision must be "approved" or "rejected"' },
        { status: 400 }
      );
    }

    const reviewRecord = {
      seal_id: sealId,
      gate,
      resource: resource || 'unknown',
      hash,
      decision,
      reviewer: reviewer || 'anonymous',
      notes: notes || '',
      reviewed_at: new Date().toISOString(),
    };

    // Persist to Supabase vault_omni_core
    try {
      const { supabase } = await import('@/lib/db/supabase');
      const { error: dbError } = await supabase
        .from('vault_omni_core')
        .upsert({
          id: `hitl_${sealId}_${Date.now()}`,
          type: 'hitl_review',
          data: reviewRecord,
          integrity_hash: hash,
          status: decision,
          created_at: reviewRecord.reviewed_at,
          updated_at: reviewRecord.reviewed_at,
        });

      if (dbError) {
        console.warn('[HITL API] Supabase write warning:', dbError.message);
      }
    } catch (dbErr) {
      console.warn('[HITL API] Supabase persistence skipped:', dbErr);
    }

    // Also persist to NCBDB if available
    try {
      if (process.env.NCBDB_API_TOKEN) {
        const { ncbClient } = await import('@/lib/ncbdb');
        await ncbClient.upsertRecord('hitl_reviews', reviewRecord);
      }
    } catch {
      // NCBDB not configured — skip
    }

    // Broadcast review decision to SSE stream
    pushBusEvent('HITL_REVIEW', {
      sealId,
      gate,
      resource,
      decision,
      reviewer: reviewRecord.reviewer,
      reviewedAt: reviewRecord.reviewed_at,
    });

    // If approved, broadcast a final seal confirmation
    if (decision === 'approved') {
      pushBusEvent('5T_SEAL_CONFIRMED', {
        gate,
        resource,
        hash,
        confirmedBy: reviewRecord.reviewer,
        confirmedAt: reviewRecord.reviewed_at,
      });
    }

    return NextResponse.json({
      success: true,
      review: reviewRecord,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[HITL API Error]', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * GET /api/omni-agent-api/hitl-review
 * Returns recent HITL review history from Supabase.
 */
export async function GET() {
  try {
    const { supabase } = await import('@/lib/db/supabase');
    const { data, error } = await supabase
      .from('vault_omni_core')
      .select('*')
      .eq('type', 'hitl_review')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      reviews: data || [],
      total: data?.length || 0,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
