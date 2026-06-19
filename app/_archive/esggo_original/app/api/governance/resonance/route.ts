import { NextResponse } from 'next/server';
import { governanceEngine } from '@/lib/governance-engine';
import { supabase } from '@/lib/supabase';
import { ApiResponse } from '@/types/omni-core';

export async function GET() {
  try {
    // 1. 從 Supabase 獲取真實的重大性議題 (Materiality Topics)
    const { data: topics, error: topicsError } = await supabase
      .from('materiality_topics')
      .select('*');

    if (topicsError) throw topicsError;

    // 2. 從 Supabase 獲取真實的利害關係人投票 (Governance Votes)
    const { data: votes, error: votesError } = await supabase
      .from('governance_votes')
      .select('*');

    if (votesError) throw votesError;

    // 3. 使用 GovernanceEngine 進行真實運算
    const results = governanceEngine.calculateResonance(
      topics.map(t => ({
        id: t.id,
        label: t.label,
        category: t.category,
        internalWeight: t.internal_weight
      })),
      votes.map(v => ({
        id: v.id,
        stakeholderType: v.stakeholder_type,
        topicId: v.topic_id,
        priorityScore: v.priority_score,
        timestamp: v.created_at,
        hashLock: v.hash_lock
      }))
    );

    const overall = governanceEngine.getOverallResonanceIndex(results);

    return NextResponse.json({
      id: Date.now().toString(),
      status: 'success',
      content: 'Governance resonance calculation complete using live data.',
      data: {
        overall,
        breakdown: results
      },
      timestamp: Date.now(),
    } as ApiResponse);
  } catch (error: any) {
    console.error('[Resonance API] Failed to fetch live data:', error);
    return NextResponse.json(
      {
        id: Date.now().toString(),
        status: 'error',
        content: error.message || 'Resonance calculation failed',
        timestamp: Date.now(),
      } as ApiResponse,
      { status: 500 }
    );
  }
}
