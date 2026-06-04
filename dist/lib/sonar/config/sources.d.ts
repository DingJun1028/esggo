/**
 * ESGSonar | Monitoring Source Configuration
 * Defines global and local ESG data sources.
 */
export interface ESGSource {
    id: string;
    name: string;
    region: 'TW' | 'EU' | 'US' | 'Global';
    type: 'Regulation' | 'Report' | 'Standard' | 'Third-Party';
    baseUrl: string;
    crawlerType: 'dynamic' | 'static';
    intervalHours: number;
    category: ('E' | 'S' | 'G')[];
}
export declare const ESG_SOURCES: ESGSource[];
export declare function getSourceById(id: string): ESGSource | undefined;
export declare function getSourcesByRegion(region: string): ESGSource[];
//# sourceMappingURL=sources.d.ts.map