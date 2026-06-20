import { NextResponse } from 'next/server';
// lib/vault is missing, replaced with console.log for now
import crypto from 'crypto';

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

    // Dummy logging to replace missing writeToVault
    const vaultEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      intent,
      context,
      tags: memoryTags,
      checksum,
    };
    console.log('[OmniSync] writeToVault simulated:', vaultEntry);

    return NextResponse.json(
      { success: true, entryId: vaultEntry.id, entry: vaultEntry },
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
