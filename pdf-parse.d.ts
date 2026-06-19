declare module 'pdf-parse' {
  import { Buffer } from 'buffer';
  export interface PDFPageTextContent {
    text: string;
  }
  export interface PDFPage {
    text: string;
  }
  export interface ParsedPDF {
    text: string;
    numPages: number;
    info: object;
    metadata: string;
    version: string;
  }
  export default function pdfParse(pdfBuffer: Buffer): Promise<ParsedPDF>;
}