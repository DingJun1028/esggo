import { getAdminApp } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

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
      return NextResponse.json({ ok: false, message: 'Resource storage is not configured' }, { status: 500 });
    }
    await docRef.delete();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/admin/resources DELETE error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to delete resource' }, { status: 500 });
  }
}
