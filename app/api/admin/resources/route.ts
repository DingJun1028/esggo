import { getAdminApp } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const runtime = 'nodejs';

type ResourceRow = {
  id?: string;
  title: string;
  category: 'shared_resource' | 'assignment' | 'replay' | 'consulting' | 'question' | 'survey' | 'other';
  url?: string;
  week?: number;
  createdBy?: string;
  createdAt?: string;
};

const memoryStore: ResourceRow[] = [];
let memoryId = 1;

function addMemoryRow(row: ResourceRow): ResourceRow {
  const record = { ...row, id: String(memoryId++) };
  memoryStore.push(record);
  return record;
}

function getMemoryRows(): ResourceRow[] {
  return memoryStore.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 200);
}

function findMemoryRow(id: string): ResourceRow | undefined {
  return memoryStore.find((item) => item.id === id);
}

function deleteMemoryRow(id: string): boolean {
  const index = memoryStore.findIndex((item) => item.id === id);
  if (index < 0) return false;
  memoryStore.splice(index, 1);
  return true;
}

export async function GET() {
  try {
    const adminDb = (await import('@/lib/firebase-admin')).adminDb;
    const collection = adminDb.collection('resources');
    if (!collection) {
      return NextResponse.json({ ok: true, rows: getMemoryRows() }, { status: 200 });
    }
    const snap = await collection.orderBy('createdAt', 'desc').limit(200).get();
    const rows = snap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ ok: true, rows }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/admin/resources GET error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to load resources' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ResourceRow>;
    const title = typeof payload.title === 'string' ? payload.title.trim() : '';
    const category = typeof payload.category === 'string' ? payload.category : 'other';
    if (!title) {
      return NextResponse.json({ ok: false, message: 'Missing title' }, { status: 400 });
    }
    const adminDb = (await import('@/lib/firebase-admin')).adminDb;
    const collection = adminDb.collection('resources');
    if (!collection) {
      const row = addMemoryRow({
        title,
        category,
        url: typeof payload.url === 'string' ? payload.url.trim() : '',
        week: typeof payload.week === 'number' ? payload.week : undefined,
        createdBy: typeof payload.createdBy === 'string' ? payload.createdBy : undefined,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, row }, { status: 200 });
    }
    const docRef = await collection.add({
      title,
      category,
      url: typeof payload.url === 'string' ? payload.url.trim() : '',
      week: typeof payload.week === 'number' ? payload.week : null,
      createdBy: typeof payload.createdBy === 'string' ? payload.createdBy : null,
      createdAt: new Date().toISOString(),
    });
    const row: ResourceRow = {
      id: docRef.id,
      title,
      category,
      url: typeof payload.url === 'string' ? payload.url.trim() : '',
      week: typeof payload.week === 'number' ? payload.week : undefined,
      createdBy: typeof payload.createdBy === 'string' ? payload.createdBy : undefined,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ ok: true, row }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/admin/resources POST error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to save resource' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });
    }
    const adminDb = (await import('@/lib/firebase-admin')).adminDb;
    const docRef = adminDb.doc('resources/' + id);
    if (!docRef) {
      const deleted = deleteMemoryRow(id);
      return NextResponse.json({ ok: deleted }, { status: deleted ? 200 : 404 });
    }
    await docRef.delete();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/admin/resources DELETE error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to delete resource' }, { status: 500 });
  }
}
