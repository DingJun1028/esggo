export declare const convertHtmlToPdf: (htmlContent: string, filename?: string) => Promise<{
    success: boolean;
    message: string;
}>;
export declare const convertHtmlToDocx: (htmlContent: string, filename?: string) => Promise<{
    success: boolean;
    message: string;
}>;
export declare const convertHtmlToMarkdown: (htmlContent: string) => string;
export declare const convertHtmlToPlainText: (htmlContent: string) => string;
//# sourceMappingURL=documentConverters.d.ts.map