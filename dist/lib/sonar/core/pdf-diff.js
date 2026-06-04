import { PDFParser } from './pdf-parser';
import { DiffEngine } from './diff-engine';
export class PDFDiffService {
    constructor() {
        this.pdfParser = new PDFParser();
    }
    async comparePDFs(urlOld, urlNew) {
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
//# sourceMappingURL=pdf-diff.js.map