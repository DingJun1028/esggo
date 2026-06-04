import { DiffResult } from './diff-engine';
export declare class PDFDiffService {
    private pdfParser;
    constructor();
    comparePDFs(urlOld: string, urlNew: string): Promise<DiffResult>;
}
//# sourceMappingURL=pdf-diff.d.ts.map