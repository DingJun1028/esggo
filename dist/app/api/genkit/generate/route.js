export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { runGRIContentFlow, scanGreenwashing, GRIContentInputSchema } from '@/lib/genkit-esg';
export async function POST(request) {
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
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map