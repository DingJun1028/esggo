import { NextResponse } from 'next/server';
import { omniAgent } from '@/lib/agents/adk-swarm';
export async function POST(request) {
    try {
        const body = await request.json();
        const { task, context } = body;
        if (!task) {
            return NextResponse.json({ error: 'Task is required' }, { status: 400 });
        }
        const result = await omniAgent.command(task, context);
        return NextResponse.json(result);
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map