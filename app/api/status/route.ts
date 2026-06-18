import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'online',
    version: '2.0.0',
    mode: 'gateway',
    timestamp: new Date().toISOString()
  });
}
