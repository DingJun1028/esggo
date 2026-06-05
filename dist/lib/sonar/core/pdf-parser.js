import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';
// 在 Node.js 環境中，必須提供絕對路徑才能正確載入 CMap (用於解析中日韓字體)
// 注意：路徑結尾必須要有斜線 (Trailing slash)
const cMapUrl = path.join(process.cwd(), 'node_modules/pdfjs-dist/cmaps').replace(/\\/g, '/') + '/';
const standardFontDataUrl = path.join(process.cwd(), 'node_modules/pdfjs-dist/standard_fonts').replace(/\\/g, '/') + '/';
export class PDFParser {
    constructor() {
        this.lastMetadata = null;
    }
    async download(url) {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error(`Failed to download PDF: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    async extractText(buffer) {
        if (!this.verify(buffer))
            throw new Error('Invalid PDF file');
        const uint8 = new Uint8Array(buffer);
        const pdf = await getDocument({
            data: uint8,
            standardFontDataUrl,
            cMapUrl,
            cMapPacked: true, // 非常重要：啟用壓縮的 CMap 檔案支援
        }).promise;
        const textParts = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(' ');
            textParts.push(pageText);
        }
        return textParts.join('\n\n');
    }
    async getMetadata(buffer) {
        if (!this.verify(buffer))
            throw new Error('Invalid PDF file');
        const uint8 = new Uint8Array(buffer);
        const pdf = await getDocument({
            data: uint8,
            standardFontDataUrl,
            cMapUrl,
            cMapPacked: true,
        }).promise;
        const metadata = await pdf.getMetadata();
        const info = metadata.info;
        const result = {
            pages: pdf.numPages,
            author: info?.Author || 'Unknown',
            title: info?.Title || 'Untitled',
            created: info?.CreationDate || new Date().toISOString()
        };
        this.lastMetadata = result;
        return result;
    }
    verify(buffer) {
        if (buffer.length < 4)
            return false;
        const header = buffer.slice(0, 4).toString('ascii');
        return header === '%PDF';
    }
}
//# sourceMappingURL=pdf-parser.js.map