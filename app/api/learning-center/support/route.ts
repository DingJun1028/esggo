import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

function asLoadableCollection(path: string) {
  const ref = (adminDb as any).collection(path);
  if (!ref) {
    throw new Error('Learning center storage is not configured');
  }
  return ref;
}

export async function GET() {
  try {
    const snapshot = await asLoadableCollection('OmniData')
      .where('type', '==', 'support_ticket')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const rows = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ ok: true, rows }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/learning-center/support GET error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to load support tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const docRef = await asLoadableCollection('OmniData').add({
      type: 'support_ticket',
      ...payload,
      status: payload.status || 'open',
      priority: payload.priority || 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as never);

    return NextResponse.json({ ok: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('[API] /api/learning-center/support POST error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to create support ticket' }, { status: 500 });
  }
}
