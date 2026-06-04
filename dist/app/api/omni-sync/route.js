import { NextResponse } from 'next/server';
import { globalOmniMemorySync } from '@/src/server/memory/OmniMemorySync';
export async function POST() {
    try {
        const result = await globalOmniMemorySync.replayDLQ();
        return NextResponse.json({
            success: true,
            message: `DLQ Replay complete. Processed: ${result.processed}, Succeeded: ${result.succeeded}, Failed: ${result.failed}`,
            ...result
        });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map