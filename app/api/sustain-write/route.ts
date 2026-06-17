import { NextRequest, NextResponse } from 'next/server';
import { generateSustainabilityReport } from '@/lib/esg/gri-expert-templates-store';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const init = searchParams.get('init');

  if (init === 'templates') {
    const { initializeGRIExpertTemplates } = await import('@/lib/esg/gri-expert-templates-store');
    await initializeGRIExpertTemplates();
    return NextResponse.json({ initialized: true, message: 'GRI templates initialized' });
  }

  return NextResponse.json({ status: 'ready', endpoints: ['/api/sustain-write/generate'] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, userId, companyName, year, data } = body;

  if (action === 'generate') {
    if (!userId || !companyName || !year) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, companyName, year' },
        { status: 400 }
      );
    }

    const result = await generateSustainabilityReport(userId, companyName, year, data || {});
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
