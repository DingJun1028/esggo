import { NextRequest, NextResponse } from 'next/server';
import { runESGAnalysisFlow, ESGAnalysisInputSchema } from '@/lib/genkit-esg';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ESGAnalysisInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await runESGAnalysisFlow(parsed.data);

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}