declare module 'pdf-parse' {
  export interface PDFPage {
    pageNumber: number;
    text: string;
    textContent?: Record<string, unknown>;
    transform?: Record<string, unknown>;
    fontName?: string;
    width?: number;
    height?: number;
  }

  export interface PDFInfo {
    PDFFormatVersion?: string;
    IsAcroFormPresent?: boolean;
    IsXFAPresent?: boolean;
    Organizer?: string;
    Size?: number;
    PageCount?: number;
    [key: string]: unknown;
  }

  export interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    text: string;
    pages: PDFPage[];
  }

  export interface PDFParserInstance {
    getText(): Promise<PDFParseResult>;
  }

  export class PDFParse {
    constructor(options: { data: Buffer } | Buffer);
    getText(): Promise<PDFParseResult>;
  }

  const PDFParseFn: {
    (buffer: Buffer, options?: unknown): Promise<PDFParseResult>;
    PDFParse: typeof PDFParse;
  };
  export default PDFParseFn;
}