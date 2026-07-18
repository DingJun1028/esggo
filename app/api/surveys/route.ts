import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SurveyPayload {
  week: number;
  date: string;
  topic: string;
  instructor: string;
  studentName?: string;
  organization?: string;
  ratings: Record<string, number>;
  feedbacks: {
    valuable?: string;
    improvement?: string;
    question?: string;
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<SurveyPayload>;

    const missing = ['week', 'date', 'topic', 'instructor', 'ratings'].filter(
      (key) => typeof (payload as Record<string, unknown>)[key] === 'undefined'
    );
    if (missing.length > 0) {
      return NextResponse.json({ ok: false, message: 'Missing required fields: ' + missing.join(', ') }, { status: 400 });
    }

    if (!adminDb.collection) {
      return NextResponse.json({ ok: false, message: 'Survey storage is not configured' }, { status: 500 });
    }

    const docRef = await adminDb.collection('surveys').add({
      week: payload.week,
      date: payload.date,
      topic: payload.topic,
      instructor: payload.instructor,
      studentName: payload.studentName ?? null,
      organization: payload.organization ?? null,
      ratings: payload.ratings ?? {},
      feedbacks: {
        valuable: payload.feedbacks?.valuable ?? null,
        improvement: payload.feedbacks?.improvement ?? null,
        question: payload.feedbacks?.question ?? null,
      },
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/surveys POST error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to save survey' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!adminDb.collection) {
      return NextResponse.json({ ok: false, message: 'Survey storage is not configured' }, { status: 500 });
    }

    const snap = await adminDb.collection('surveys').orderBy('submittedAt', 'desc').limit(200).get();
    const rows = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ ok: true, rows }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/surveys GET error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to load surveys' }, { status: 500 });
  }
}
