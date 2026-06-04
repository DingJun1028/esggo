/**
 * Official GRI Master Chapters for ESG GO
 * Used by SustainWrite Editor and OmniAgent Swarm
 */
export interface Chapter {
    id: string;
    num: string;
    title: string;
    gri: string;
    category: 'env' | 'soc' | 'gov';
    order: number;
    fields?: {
        id: string;
        label: string;
        unit: string;
        gri: string;
    }[];
}
export declare const GRI_CHAPTERS: Chapter[];
//# sourceMappingURL=chapters.d.ts.map