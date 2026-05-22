import { NextRequest, NextResponse } from 'next/server';
import { runGRIContentFlow, scanGreenwashing, GRIContentInputSchema } from '@/lib/genkit-esg';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...rest } = body;

    if (action === 'scan-greenwashing') {
      const result = await scanGreenwashing(rest.text ?? '');
      return NextResponse.json({ success: true, data: result });
    }

    const parsed = GRIContentInputSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const result = await runGRIContentFlow(parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}