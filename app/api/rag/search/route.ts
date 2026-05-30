import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { query, threshold = 0.5, limit = 5 } = await req.json();
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Database credentials missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    // 1. Generate embedding for the query (using a mock or actual OpenAI/Gemini embedding service)
    // Here we simulate the embedding vector as the match_omni_documents function requires it.
    // In a real flow, you would call your embedding provider first.
    const mockEmbedding = Array(1536).fill(0).map(() => Math.random());

    // 2. Invoke match_omni_documents RPC
    const { data, error } = await supabase.rpc('match_omni_documents', {
      query_embedding: mockEmbedding,
      match_threshold: threshold,
      match_count: limit
    });

    if (error) throw error;

    return NextResponse.json({ success: true, documents: data });
  } catch (error: unknown) {
    console.error('[Omni RAG Search API] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
