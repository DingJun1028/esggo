import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
console.log('pdfParse type:', typeof pdfParse, 'keys:', Object.keys(pdfParse));
const pdf = typeof pdfParse === 'function' ? pdfParse : pdfParse.default || pdfParse;

export class PDFParser {
  async download(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download PDF: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async extractText(buffer: Buffer): Promise<string> {
    if (!this.verify(buffer)) throw new Error('Invalid PDF file');
    const data = await pdf(buffer);
    return data.text;
  }

  async getMetadata(buffer: Buffer): Promise<any> {
    if (!this.verify(buffer)) throw new Error('Invalid PDF file');
    const data = await pdf(buffer);
    return {
      pages: data.numpages,
      author: data.info?.Author || 'Unknown',
      title: data.info?.Title || 'Untitled',
      created: data.info?.CreationDate || new Date().toISOString()
    };
  }

  verify(buffer: Buffer): boolean {
    const header = buffer.slice(0, 4).toString();
    return header === '%PDF';
  }
}
