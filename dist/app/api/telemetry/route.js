import { NextResponse } from 'next/server';
import { telemetryService } from '@/lib/telemetry/service';
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const agent = searchParams.get('agent');
    if (agent) {
        return NextResponse.json({
            events: telemetryService.getEventsByAgent(agent),
            metrics: telemetryService.getMetrics().find(m => m.agent === agent)
        });
    }
    return NextResponse.json({
        events: telemetryService.getEvents(),
        metrics: telemetryService.getMetrics()
    });
}
export async function POST(req) {
    try {
        const payload = await req.json();
        if (!payload.type || !payload.payload) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }
        const instance = process.env.NCB_INSTANCE || "54686_esggo";
        const dataApiUrl = process.env.NCB_DATA_API_URL || "https://app.nocodebackend.com/api/data";
        // Write to NCB telemetry_events
        const response = await fetch(`${dataApiUrl}/create/telemetry_events?Instance=${instance}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NCBDB_API_TOKEN}`,
            },
            body: JSON.stringify({
                uuid: payload.id || crypto.randomUUID(),
                event_type: payload.type,
                payload: payload.payload,
                timestamp: payload.timestamp || new Date().toISOString(),
                user_email: payload.user_email || 'System',
                integrity_hash: payload.integrity_hash || '0xSYSTEM'
            })
        });
        if (!response.ok) {
            const err = await response.text();
            console.error('Failed to log telemetry to NCB:', err);
        }
        // If SEAL, also create esg_evidence
        if (payload.type === 'SEAL') {
            const evidenceResponse = await fetch(`${dataApiUrl}/create/esg_evidence?Instance=${instance}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NCBDB_API_TOKEN}`,
                },
                body: JSON.stringify({
                    uuid: crypto.randomUUID(),
                    metric_id: 1, // Default or parsed from payload
                    evidence_url: 'https://omnispace.esg.go/evidence/' + (payload.id || crypto.randomUUID()),
                    hash_lock: payload.integrity_hash || '0xSEAL',
                    status: 'VERIFIED',
                    user_id: payload.user_email || 'System'
                })
            });
            if (!evidenceResponse.ok) {
                console.error('Failed to log evidence to NCB:', await evidenceResponse.text());
            }
        }
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('Telemetry Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map