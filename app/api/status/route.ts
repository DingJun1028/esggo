import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    version: '3.0.0-TripleLayer',
    mode: 'gateway',
    governance: {
      protocol: '5T',
      status: 'Trustworthy',
      agent: 'OmniAgent Matrix'
    },
    timestamp: new Date().toISOString()
  });
}
