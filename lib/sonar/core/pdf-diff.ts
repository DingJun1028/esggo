import { PDFParser } from './pdf-parser';
import { DiffEngine, DiffResult } from './diff-engine';

export class PDFDiffService {
  private pdfParser: PDFParser;

  constructor() {
    this.pdfParser = new PDFParser();
  }

  async comparePDFs(urlOld: string, urlNew: string): Promise<DiffResult> {
    // Download both PDFs
    const bufferOld = await this.pdfParser.download(urlOld);
    const bufferNew = await this.pdfParser.download(urlNew);

    // Extract text
    const textOld = await this.pdfParser.extractText(bufferOld);
    const textNew = await this.pdfParser.extractText(bufferNew);

    // Compare lines
    return DiffEngine.compareLines(textOld, textNew);
  }
}
