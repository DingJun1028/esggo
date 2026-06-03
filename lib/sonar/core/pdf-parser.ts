import { getDocument } from 'pdf-parse';

export class PDFParser {
  async download(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download PDF: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  async extractText(buffer: Buffer): Promise<string> {
    if (!this.verify(buffer)) throw new Error('Invalid PDF file');
    const data = await getDocument(buffer).promise;
    const texts: string[] = [];
    for (let i = 1; i <= data.numPages; i++) {
      const page = await data.getPage(i);
      const content = await page.getTextContent();
      texts.push(content.items.map((item: any) => item.str).join(' '));
    }
    return texts.join('\n');
  }

  async getMetadata(buffer: Buffer): Promise<any> {
    if (!this.verify(buffer)) throw new Error('Invalid PDF file');
    const data = await getDocument(buffer).promise;
    return {
      pages: data.numPages,
      author: data.info?.author || 'Unknown',
      title: data.info?.title || 'Untitled',
      created: data.info?.CreationDate || new Date().toISOString()
    };
  }

  verify(buffer: Buffer): boolean {
    const header = buffer.slice(0, 4).toString();
    return header === '%PDF';
  }
}
