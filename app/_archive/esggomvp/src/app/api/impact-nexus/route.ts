import { NextResponse } from 'next/server';
import { OmniNcbService } from '@/core/omni-ncb-service';

export async function GET() {
    try {
        const leaderboard = await OmniNcbService.listLeaderboard();
        return NextResponse.json({ success: true, data: leaderboard });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch leaderboard' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { player_name, score, wins } = body;

        if (!player_name) {
            return NextResponse.json({ success: false, error: 'Missing player_name' }, { status: 400 });
        }

        const result = await OmniNcbService.saveGameScore({ player_name, score, wins });
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save game score' }, { status: 500 });
    }
}
