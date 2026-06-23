export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@supabase/supabase-js');
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const OAK = process.env.OPENROUTER_API_KEY || '';
    if (!OAK) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured' }, { status: 500 });
    }

    const { shard_id } = await req.json();
    if (!shard_id) {
      return NextResponse.json({ error: 'shard_id is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const { data: shard, error: fetchError } = await supabase
      .from('omni_memory_shards')
      .select('title, description, content, tags')
      .eq('id', shard_id)
      .single();

    if (fetchError || !shard) {
      return NextResponse.json({ error: 'Shard not found' }, { status: 404 });
    }

    const textToEmbed =
      'Title: ' +
      shard.title +
      '\nDescription: ' +
      shard.description +
      '\nTags: ' +
      shard.tags.join(', ') +
      '\nContent: ' +
      JSON.stringify(shard.content);

    const embedRes = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + OAK,
        'HTTP-Referer': 'https://esggo.vercel.app',
        'X-Title': 'ESGGO Memory Vectorize',
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small',
        input: textToEmbed,
      }),
    });

    if (!embedRes.ok) {
      const errText = await embedRes.text();
      return NextResponse.json(
        { error: 'Failed to generate embedding: ' + errText },
        { status: 500 }
      );
    }

    const embedData = await embedRes.json();
    const embedding = embedData.data[0].embedding;

    const { error: upsertError } = await supabase
      .from('omni_memory_vectors')
      .upsert({ shard_id: shard_id, embedding: embedding }, { onConflict: 'shard_id' });

    if (upsertError) {
      return NextResponse.json({ error: 'Failed to save vector to DB' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Vector generated and stored successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
