export interface ExportChapter {
    id: string;
    title: string;
}
export declare function useExport(): {
    exportDocx: (chapters: ExportChapter[], generatedContent: Record<string, string>, showToast: (msg: string, type: "success" | "error" | "info") => void) => Promise<void>;
    exportPdf: (chapters: ExportChapter[], generatedContent: Record<string, string>, showToast: (msg: string, type: "success" | "error" | "info") => void) => Promise<void>;
    exportMarkdown: (chapters: ExportChapter[], generatedContent: Record<string, string>, showToast: (msg: string, type: "success" | "error" | "info") => void) => Promise<void>;
};
//# sourceMappingURL=useExport.d.ts.map