import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

// standardFontDataUrl 和 cMapUrl 用相對路徑，從 legacy/build/pdf.mjs 的位置解析
// legacy/build/ 下已有 standard_fonts/ 和 cmaps/ 目錄（建置時複製）
const standardFontDataUrl = './standard_fonts/';
const cMapUrl = './cmaps/';

export interface PDFMetadata {
  pages: number;
  author: string;
  title: string;
  created: string;
}

export class PDFParser {
  private lastMetadata: PDFMetadata | null = null;

  async download(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download PDF: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async extractText(buffer: Buffer): Promise<string> {
    if (!this.verify(buffer)) throw new Error('Invalid PDF file');

    const uint8 = new Uint8Array(buffer);
    const pdf = await getDocument({
      data: uint8,
      standardFontDataUrl,
      cMapUrl,
    }).promise;

    const textParts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      textParts.push(pageText);
    }

    return textParts.join('\n\n');
  }

  async getMetadata(buffer: Buffer): Promise<PDFMetadata> {
    if (!this.verify(buffer)) throw new Error('Invalid PDF file');

    const uint8 = new Uint8Array(buffer);
    const pdf = await getDocument({
      data: uint8,
      standardFontDataUrl,
      cMapUrl,
    }).promise;

    const metadata = await pdf.getMetadata();
    const info = metadata.info as any;

    const result: PDFMetadata = {
      pages: pdf.numPages,
      author: info?.Author || 'Unknown',
      title: info?.Title || 'Untitled',
      created: info?.CreationDate || new Date().toISOString()
    };

    this.lastMetadata = result;
    return result;
  }

  verify(buffer: Buffer): boolean {
    if (buffer.length < 4) return false;
    const header = buffer.slice(0, 4).toString('ascii');
    return header === '%PDF';
  }
}
