/**
 * ESG Datasheet Templates
 * ═══════════════════════
 * Pre-defined field structures for common ESG data collection needs.
 */
export interface ESGTemplate {
    id: string;
    name: string;
    nameZh: string;
    category: 'E' | 'S' | 'G';
    description: string;
    fields: Array<{
        name: string;
        type: string;
        property?: Record<string, unknown>;
    }>;
}
export declare const ESG_TEMPLATES: ESGTemplate[];
export declare function getTemplatesByCategory(category: 'E' | 'S' | 'G'): ESGTemplate[];
//# sourceMappingURL=templates.d.ts.map