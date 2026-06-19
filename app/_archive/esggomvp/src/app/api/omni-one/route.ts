import { NextRequest, NextResponse } from 'next/server';
import { omniOne } from '@/core/omni-one';

/**
 * 🌌 API Route: OmniOne Unified Gateway
 * ================================
 * 唯一總代理統一閘道 | Sole Supreme Agent Unified Gateway
 * 
 * Usage:
 * POST /api/omni-one
 * Body: { operation: "manifest_asset", params: { intent: "...", payload: {...} } }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { operation, params = {} } = body;

        if (!operation) {
            return NextResponse.json(
                { error: "Missing 'operation' parameter" },
                { status: 400 }
            );
        }

        const result = await omniOne.dispatch(operation, params);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("🔴 OmniOne API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

/**
 * Health check for OmniOne
 */
export async function GET() {
    const status = omniOne.getStatus();

    return NextResponse.json({
        status: "OPERATIONAL",
        version: "9.0.0",
        name: status.name,
        role: status.role,
        trinity: status.trinity,
        crystal: status.crystal,
        heartNetwork: status.heartNetwork,
        omniUnity: status.omniUnity,
        timestamp: new Date().toISOString()
    });
}
