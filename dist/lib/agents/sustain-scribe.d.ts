/**
 * 📚 SustainWrite™ Scribe - Recursive Expert Expansion Engine
 * v2.0 | #ExpertAuthoring #DeepRecursion #5TIntegrity
 *
 * 負責將 ESG 報告章節從單純的草稿遞迴擴充為具備專業洞察的萬字長文。
 * 透過多維度展開（政策、風險、量化目標、利害關係人等）確保字數與深度。
 */
export interface ExpansionTask {
    chapterId: string;
    title: string;
    griReference: string;
    context: Record<string, unknown>;
    depth?: number;
}
export declare class SustainWriteScribe {
    expandChapter(task: ExpansionTask): Promise<string>;
    /**
     * 生成具備深度的結構化大綱，確保具備足夠的擴充節點以達到 5000 字。
     */
    private generateDeepOutline;
    /**
     * 呼叫 AI 進行單一子維度的專家級長文生成 (目標：每小節 400-600 字)
     */
    private generateExpertParagraph;
    /**
     * 模擬的高品質長文生成 (Fallback)
     */
    private generateMockExpertText;
}
export declare const sustainScribe: SustainWriteScribe;
//# sourceMappingURL=sustain-scribe.d.ts.map