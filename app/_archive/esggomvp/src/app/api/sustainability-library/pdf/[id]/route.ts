import { NextRequest, NextResponse } from 'next/server';
import { SUSTAINABILITY_LIBRARY_DB, ISustainabilityResource } from '@/data/sustainability-library-db';
import { generateResourcePdfHtml } from '@/lib/pdf-generator';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const resource = SUSTAINABILITY_LIBRARY_DB.find((r: ISustainabilityResource) => r.id === id);

    if (!resource) {
        return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    // preview mode: no autoprint so user can read before printing
    const html = generateResourcePdfHtml(resource, { autoprint: false });

    return new NextResponse(html, {
        headers: {
            'Content-Type': 'text/html;charset=utf-8',
            'Cache-Control': 'no-store',
        },
    });
}
