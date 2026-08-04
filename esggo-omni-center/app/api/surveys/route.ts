import { NextResponse } from 'next/server';

type SurveyRow = {
  id?: string;
  week: number;
  date: string;
  topic: string;
  instructor: string;
  studentName?: string | null;
  organization?: string | null;
  ratings: Record<string, number>;
  feedbacks: {
    valuable?: string | null;
    improvement?: string | null;
    question?: string | null;
  };
  submittedAt?: string;
};

const memoryStore: SurveyRow[] = [];
let memoryId = 1;

function isMemoryBackend(): boolean {
  const backend = (process.env.SURVEY_BACKEND || '').trim().toLowerCase();
  return backend === '' || backend === 'memory' || backend === 'local';
}

function addMemoryRow(row: SurveyRow): SurveyRow {
  const record = { ...row, id: String(memoryId++) };
  memoryStore.push(record);
  return record;
}

function getMemoryRows(): SurveyRow[] {
  return memoryStore.slice().sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || '')).slice(0, 200);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<SurveyRow>;

    const missing = ['week', 'date', 'topic', 'instructor', 'ratings'].filter(
      (key) => typeof (payload as Record<string, unknown>)[key] === 'undefined'
    );
    if (missing.length > 0) {
      return NextResponse.json({ ok: false, message: 'Missing required fields: ' + missing.join(', ') }, { status: 400 });
    }

    const backend = (process.env.SURVEY_BACKEND || '').trim().toLowerCase();

    if (backend === 'firebase') {
      const { adminDb } = await import('@/lib/firebase-admin');
      if (!adminDb?.collection) {
        return NextResponse.json({ ok: false, message: 'Survey storage is not configured' }, { status: 500 });
      }
      const docRef = await adminDb.collection('surveys')?.add({
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
      if (!docRef) {
        return NextResponse.json({ ok: false, message: 'Survey storage is not configured' }, { status: 500 });
      }
      return NextResponse.json({ ok: true, id: docRef.id }, { status: 200 });
    }

    const row = addMemoryRow({
      week: payload.week as number,
      date: payload.date as string,
      topic: payload.topic as string,
      instructor: payload.instructor as string,
      studentName: payload.studentName ?? null,
      organization: payload.organization ?? null,
      ratings: (payload.ratings as SurveyRow['ratings']) ?? {},
      feedbacks: {
        valuable: payload.feedbacks?.valuable ?? null,
        improvement: payload.feedbacks?.improvement ?? null,
        question: payload.feedbacks?.question ?? null,
      },
      submittedAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, id: row.id }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/surveys POST error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to save survey' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const backend = (process.env.SURVEY_BACKEND || '').trim().toLowerCase();
    if (backend === 'firebase') {
      const { adminDb } = await import('@/lib/firebase-admin');
      if (!adminDb?.collection) {
        return NextResponse.json({ ok: false, message: 'Survey storage is not configured' }, { status: 500 });
      }
      const snap = await adminDb.collection('surveys')?.orderBy('submittedAt', 'desc').limit(200).get();
      if (!snap) {
        return NextResponse.json({ ok: false, message: 'Survey storage is not configured' }, { status: 500 });
      }
      const rows = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ ok: true, rows }, { status: 200 });
    }
    return NextResponse.json({ ok: true, rows: getMemoryRows() }, { status: 200 });
  } catch (error) {
    console.error('[API] /api/surveys GET error:', error);
    return NextResponse.json({ ok: false, message: 'Failed to load surveys' }, { status: 500 });
  }
}
