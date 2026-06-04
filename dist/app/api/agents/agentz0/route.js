export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { agentZ0Flow } from '@/lib/agents/agentz0';
export async function POST(req) {
    try {
        const body = await req.json();
        const { query, context } = body;
        if (!query) {
            return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
        }
        // execute genkit flow
        const result = await agentZ0Flow({ query, context });
        return NextResponse.json({ result });
    }
    catch (error) {
        console.error('agentZ0 error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map