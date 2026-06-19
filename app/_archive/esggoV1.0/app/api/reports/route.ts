import { NextResponse } from 'next/server';
import { saveDocumentMetadata } from '@/lib/services/ncbdb';

export async function POST(request: Request) {
    const data = await request.json();
    await saveDocumentMetadata(data);
    return NextResponse.json({ success: true });
}
