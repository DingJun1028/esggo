import { z } from 'genkit';
/**
 * 🛠️ PDF 證據解析工具
 * 負責將 PDF 內容解析為結構化文本，供 ADK Swarm 進行 5T 驗證
 */
export declare const parsePdfTool: import("genkit").ToolAction<z.ZodObject<{
    fileUrl: z.ZodString;
    extractTables: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    fileUrl: string;
    extractTables: boolean;
}, {
    fileUrl: string;
    extractTables?: boolean | undefined;
}>, z.ZodTypeAny>;
/**
 * 🛠️ 圖片證據解析工具 (OCR)
 * 負責從圖片（如電費單截圖）中提取關鍵 ESG 數據
 */
export declare const parseImageTool: import("genkit").ToolAction<z.ZodObject<{
    imageUrl: z.ZodString;
}, "strip", z.ZodTypeAny, {
    imageUrl: string;
}, {
    imageUrl: string;
}>, z.ZodTypeAny>;
/**
 * 🛠️ 證據合成工具 (暫存模擬用)
 */
export declare const evidenceTool: {
    name: string;
    description: string;
};
//# sourceMappingURL=evidence-genkit-tool.d.ts.map