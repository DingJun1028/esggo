import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    if (!payload.type || !payload.payload) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const instance = "54686_esg_go_ncb";
    
    // Write to NCB telemetry_events
    const response = await fetch(`https://app.nocodebackend.com/api/data/create/telemetry_events?Instance=${instance}`, {
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
      const evidenceResponse = await fetch(`https://app.nocodebackend.com/api/data/create/esg_evidence?Instance=${instance}`, {
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
  } catch (error) {
    console.error('Telemetry Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
