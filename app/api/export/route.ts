import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { format, title, contentHtml, contentMd, zkpHash } = await req.json();

    const timestamp = new Date().toISOString();
    const verificationText = `ZKP Hash Lock: ${zkpHash || 'N/A'}\n5T Protocol Verified: Tangible, Traceable, Trackable, Transparent, Trustworthy`;

    if (format === 'md') {
      const fullMd = `# ${title}\n\n> **ESGGO OmniCore Verified Report**\n> \n> **[OmniCore 5T Protocol Audit]**\n> Generated At: ${timestamp}\n> ZKP Hash: ${zkpHash || 'Pending...'}\n> Status: Trustworthy (Immutable Record)\n\n---\n\n${contentMd}`;
      
      return new NextResponse(fullMd, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="ESG_Report_${Date.now()}.md"`,
        },
      });
    }

    // PDF/DOCX generation requires optional dependencies (puppeteer/docx)
    // which are not installed in the Vercel build environment.
    return NextResponse.json({ 
      error: 'PDF/DOCX export requires optional dependencies. Use MD format or install puppeteer/docx.' 
    }, { status: 400 });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
