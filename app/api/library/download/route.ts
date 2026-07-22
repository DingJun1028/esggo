import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { uploadToDrive } from '@/lib/services/google-drive';
import { saveDocumentMetadata } from '@/lib/services/ncbdb';

export async function POST(req: NextRequest) {
  try {
    const { title, content, articleId } = await req.json();

    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Add content (simplified for now)
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(content || "No content provided.", 170);
    doc.text(splitContent, 20, 40);
    
    const pdfOutput = doc.output('arraybuffer');
    
    // Upload to Google Drive
    const driveFile = await uploadToDrive(`${articleId}-${Date.now()}.pdf`, Buffer.from(pdfOutput));
    
    // Save metadata to NCBDB
    await saveDocumentMetadata({
      id: articleId,
      title,
      driveId: driveFile.id || '',
      webViewLink: driveFile.webViewLink || '',
      type: 'PDF',
      source: 'Sustainability Library',
    });
    
    return new NextResponse(pdfOutput, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${articleId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
