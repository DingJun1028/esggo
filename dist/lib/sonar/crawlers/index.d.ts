import { BaseCrawler } from './base-crawler';
export declare function createCrawler(sourceId: string): BaseCrawler | null;
export declare function getRegisteredSources(): {
    id: string;
    name: string;
    type: "Regulation" | "Report" | "Standard" | "Third-Party";
    region: "Global" | "EU" | "TW" | "US";
}[];
//# sourceMappingURL=index.d.ts.map