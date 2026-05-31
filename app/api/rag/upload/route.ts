import { NextRequest, NextResponse } from 'next/server';
import { processPDFAndIngest } from '@/lib/agent/rag-engine';
import { buildComponent, engraveToSingleTable } from '@/lib/vault-omni';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Memory Core & Nexus: Parse PDF and ingest to OmniVector Store
    const chunksCount = await processPDFAndIngest(buffer, file.name);

    // Nexus: Sync to Omni Vault (Audit Chain)
    try {
      const component = buildComponent({
        sourceOrigin: 'KnowledgeHub-Ingest',
        evidenceData: { fileName: file.name, chunksCount },
        impactMetric: 'Vector Data',
        formula: 'IngestPDF',
      });
      await engraveToSingleTable(component);
    } catch (dbErr) {
      console.warn('[Nexus] Audit log write failed:', dbErr);
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      chunksCount: chunksCount
    });

  } catch (error: any) {
    console.error('[Upload API] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
