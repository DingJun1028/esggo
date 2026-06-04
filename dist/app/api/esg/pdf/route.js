import { NextResponse } from 'next/server';
import { PDFDiffService } from '@/lib/sonar/core/pdf-diff';
export async function POST(request) {
    try {
        const { urlOld, urlNew } = await request.json();
        if (!urlOld || !urlNew) {
            return NextResponse.json({ error: 'urlOld and urlNew are required' }, { status: 400 });
        }
        const diffService = new PDFDiffService();
        const result = await diffService.comparePDFs(urlOld, urlNew);
        return NextResponse.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('PDF Diff API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to compare PDFs' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map