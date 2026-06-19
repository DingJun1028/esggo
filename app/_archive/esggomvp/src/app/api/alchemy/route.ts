import { NextResponse } from 'next/server';
import { OmniNcbService } from '@/core/omni-ncb-service';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
        }

        const progress = await OmniNcbService.getAlchemyProgress(userId);
        return NextResponse.json({ success: true, data: progress });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch alchemy progress' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user_id, level, points, rank } = body;

        if (!user_id) {
            return NextResponse.json({ success: false, error: 'Missing user_id' }, { status: 400 });
        }

        const result = await OmniNcbService.saveAlchemyProgress({ user_id, level, points, rank });
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save alchemy progress' }, { status: 500 });
    }
}
