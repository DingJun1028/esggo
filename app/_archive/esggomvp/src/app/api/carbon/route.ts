import { NextResponse } from 'next/server';
import { OmniNcbService } from '@/core/omni-ncb-service';

export async function GET() {
    try {
        const records = await OmniNcbService.listCarbonRecords();
        return NextResponse.json({ success: true, data: records });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch carbon records' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { scope, value, description } = body;

        if (scope === undefined || value === undefined) {
            return NextResponse.json({ success: false, error: 'Missing scope or value' }, { status: 400 });
        }

        const result = await OmniNcbService.saveCarbonRecord({ scope, value, description });
        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save carbon record' }, { status: 500 });
    }
}
