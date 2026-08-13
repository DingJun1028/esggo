import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

function cleanCoursePayload(doc: FirebaseFirestore.QueryDocumentSnapshot) {
  const data = doc.data() as Record<string, unknown>;
  const plain = { ...data } as Record<string, unknown>;

  delete (plain as { __METHOD__?: unknown }).__METHOD__;
  delete (plain as { __CALLBACKS__?: unknown }).__CALLBACKS__;

  return plain;
}

function asLoadableCollection(path: string) {
  const ref = adminDb.collection(path);
  if (!ref) {
    throw new Error('Learning center storage is not configured');
  }
  return ref;
}

export async function GET() {
  try {
    const collectionRef = asLoadableCollection('OmniData');

    const coursesSnapshot = await collectionRef
      .where('type', '==', 'course')
      .where('status', '==', 'published')
      .orderBy('updatedAt', 'desc')
      .get();

    const courses = coursesSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...cleanCoursePayload(doc),
    }));

    return NextResponse.json({ ok: true, data: courses }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/learning-center GET error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to load learning center data' }, { status: 500 });
  }
}
