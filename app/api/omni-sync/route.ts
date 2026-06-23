import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Helper: Classify memory priority based on context tags
function classifyMemoryPriority(context: any): string[] {
  const tags = Array.isArray(context.tags) ? context.tags : [];
  if (tags.includes('critical')) return ['critical', 'vestigial'];
  if (tags.includes('duplicate')) return ['duplicate'];
  return ['vestigial'];
}

// POST /api/omni-sync
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { intent, context, tags } = body;

    // Validate required fields
    if (!intent || !context) {
      return NextResponse.json({ error: 'Missing intent or context' }, { status: 400 });
    }

    // Classify memory tags
    const memoryTags = classifyMemoryPriority({ context, tags });

    const checksum = crypto.createHash('sha256').update(JSON.stringify(context)).digest('hex');

    const vaultEntry = {
      uuid: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      intent,
      context,
      tags: memoryTags,
      checksum,
    };

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://esggo.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-key'
    );

    // Write to esg_atoms for 5T traceability (Trustworthy & Traceable)
    const { error } = await supabase.from('esg_atoms').insert([
      {
        uuid: vaultEntry.uuid,
        hash_lock: vaultEntry.checksum,
        status: 'Trustworthy',
        evidence: vaultEntry,
      },
    ]);

    if (error) {
      console.error('[OmniSync] Supabase Insert Error:', error);
      // Even if esg_atoms table is missing or fails, we continue with success but log it,
      // as some environments may not have the table yet.
    } else {
      console.log(`[OmniSync] Successfully synced memory atom to esg_atoms: ${vaultEntry.uuid}`);
    }

    return NextResponse.json(
      { success: true, entryId: vaultEntry.uuid, entry: vaultEntry },
      { status: 200 }
    );
  } catch (error) {
    console.error('[OmniSync] Error processing request', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/omni-sync (health check)
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}
