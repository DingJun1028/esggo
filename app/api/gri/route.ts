import { NextRequest, NextResponse } from 'next/server';
import {
  getGRIStandards,
  getGRIByCategory,
  getGRIStandard,
  initializeGRITable,
} from '@/lib/esg/gri-standards-store';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const category = searchParams.get('category');
  const init = searchParams.get('init');

  if (init === 'true') {
    const success = await initializeGRITable();
    return NextResponse.json({ initialized: success });
  }

  if (code) {
    const standard = await getGRIStandard(code);
    return NextResponse.json({ standard });
  }

  if (category) {
    const standards = await getGRIByCategory(category as 'Environmental' | 'Social' | 'Governance');
    return NextResponse.json({ standards });
  }

  const standards = await getGRIStandards();
  return NextResponse.json({ standards, count: standards.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, standard } = body;

  if (action === 'initialize') {
    const success = await initializeGRITable();
    return NextResponse.json({ initialized: success });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
