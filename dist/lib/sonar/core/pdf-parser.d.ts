export interface PDFMetadata {
    pages: number;
    author: string;
    title: string;
    created: string;
}
export declare class PDFParser {
    private lastMetadata;
    download(url: string): Promise<Buffer>;
    extractText(buffer: Buffer): Promise<string>;
    getMetadata(buffer: Buffer): Promise<PDFMetadata>;
    verify(buffer: Buffer): boolean;
}
//# sourceMappingURL=pdf-parser.d.ts.map