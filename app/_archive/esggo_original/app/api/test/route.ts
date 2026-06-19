import { NextResponse } from 'next/server';
import { getEvidenceFiles } from '@/lib/db';

export async function GET() {
  try {
    const data = await getEvidenceFiles();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack });
  }
}
