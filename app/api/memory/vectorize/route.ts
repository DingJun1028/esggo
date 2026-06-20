import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase URL or Key is missing' }, { status: 500 });
  }
  try {
    const { shard_id } = await req.json();
    if (!shard_id) {
      return NextResponse.json({ error: 'shard_id is required' }, { status: 400 });
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 });
    }

    // 1. Fetch shard content
    const { data: shard, error: fetchError } = await supabase
      .from('omni_memory_shards')
      .select('title, description, content, tags')
      .eq('id', shard_id)
      .single();

    if (fetchError || !shard) {
      return NextResponse.json({ error: 'Shard not found' }, { status: 404 });
    }

    // 2. Prepare text for embedding
    const textToEmbed = `Title: ${shard.title}
Description: ${shard.description}
Tags: ${shard.tags.join(', ')}
Content: ${JSON.stringify(shard.content)}`;

    // 3. Call OpenAI Embedding API
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: textToEmbed,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Vectorize] OpenAI API Error:', errText);
      return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 });
    }

    const embedData = await response.json();
    const embedding = embedData.data[0].embedding;

    // 4. Upsert into omni_memory_vectors
    const { error: upsertError } = await supabase
      .from('omni_memory_vectors')
      .upsert({
        shard_id: shard_id,
        embedding: embedding,
      }, { onConflict: 'shard_id' });

    if (upsertError) {
      console.error('[Vectorize] DB Upsert Error:', upsertError);
      return NextResponse.json({ error: 'Failed to save vector to DB' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Vector generated and stored successfully' });

  } catch (error: any) {
    console.error('[Vectorize] General Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
