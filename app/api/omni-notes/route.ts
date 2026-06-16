import { NextRequest, NextResponse } from 'next/server';
import {
  syncNotesBatch,
  syncToPersonalDB,
  getDeviceSyncStatus,
  mergeWithOmniSystem,
  generateTitle,
  generateSummary,
  extractLabels,
  SyncResult,
} from '@/lib/services/omni-notes.service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const deviceId = searchParams.get('deviceId');

  if (action === 'status' && deviceId) {
    const status = await getDeviceSyncStatus(deviceId);
    return NextResponse.json(status);
  }

  if (action === 'backlinks') {
    const noteId = searchParams.get('noteId');
    const type = searchParams.get('type') || 'knowledge';
    const { findBacklinks } = await import('@/lib/services/omni-notes.service');
    const backlinks = await findBacklinks(noteId!, type);
    return NextResponse.json({
      backlinks: backlinks.map((r) => ({
        id: r.recordId,
        title: r.fields['Title'] || r.fields['Task Title'],
        type: r.fields['Type'],
      })),
    });
  }

  return NextResponse.json({ message: 'OmniNotes API' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, note, userId, dbId } = body;

  try {
    switch (action) {
      case 'sync': {
        const notes = note.notes || [note];
        const results = await syncNotesBatch(notes);
        return NextResponse.json({ success: true, results });
      }

      case 'personal': {
        const result = await syncToPersonalDB(userId, note, dbId);
        return NextResponse.json(result);
      }

      case 'merge': {
        const result = await mergeWithOmniSystem(note.id, note.type);
        return NextResponse.json(result);
      }

      case 'generate': {
        const { type, content } = body;
        const title = type === 'title' ? await generateTitle(content) : null;
        const summary = type === 'summary' ? await generateSummary(content) : null;
        const labels = type === 'labels' ? await extractLabels(content) : null;
        return NextResponse.json({ [type]: title || summary || labels });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
