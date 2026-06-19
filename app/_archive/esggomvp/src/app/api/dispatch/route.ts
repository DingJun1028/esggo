import { NextResponse } from 'next/server';

/**
 * Secure Automation Relay (Dispatch)
 * This endpoint acts as a proxy to external automation platforms (Make.com, Boost.space).
 * It prevents exposing sensitive webhook URLs to the client side.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, atomId, data } = body;

        console.log(`[Dispatch Relay] Received ${type} for Atom ${atomId}`);

        // Routing logic based on type or atom metadata
        // In a production environment, these URLs would come from process.env
        let targetUrl = '';

        if (type === 'ES_OPTIMIZATION' || type === 'GENERATE_INSIGHT') {
            targetUrl = process.env.MAKE_WEBHOOK_URL || 'https://hook.us1.make.com/mock-placeholder';
        } else if (type === 'SYNC_TO_BOOST') {
            targetUrl = process.env.BOOST_SPACE_WEBHOOK_URL || 'https://api.boost.space/v1/mock-placeholder';
        }

        if (!targetUrl || targetUrl.includes('mock-placeholder')) {
            console.warn('[Dispatch Relay] No actual webhook URL configured, returning mock success.');
            return NextResponse.json({
                success: true,
                message: 'Mock dispatch successful (No webhook configured)',
                received: { type, atomId }
            });
        }

        // Perform the actual dispatch
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...body,
                relayTimestamp: Date.now(),
                source: 'OmniEsgCell_v2'
            })
        });

        const result = await response.json().catch(() => ({}));

        return NextResponse.json({
            success: response.ok,
            status: response.status,
            data: result
        });

    } catch (error: any) {
        console.error('[Dispatch Relay] Error:', error.message);
        return NextResponse.json(
            { success: false, error: 'Internal Dispatch Error' },
            { status: 500 }
        );
    }
}
