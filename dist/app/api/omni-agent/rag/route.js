import { NextResponse } from 'next/server';
import { enterpriseRagSkill } from '@/src/server/skills/enterpriseRagSkill';
export async function POST(req) {
    try {
        const body = await req.json();
        const { query, topK } = body;
        if (!query) {
            return NextResponse.json({ success: false, error: 'Missing query' }, { status: 400 });
        }
        const input = {
            context: {
                requestId: crypto.randomUUID(),
                timestamp: Date.now(),
                actor: 'OmniCommandPalette',
                environment: process.env.NODE_ENV || 'development',
            },
            payload: {
                query,
                topK: topK || 5
            }
        };
        const result = await enterpriseRagSkill(input);
        if (!result.success) {
            return NextResponse.json(result, { status: 500 });
        }
        return NextResponse.json(result);
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map