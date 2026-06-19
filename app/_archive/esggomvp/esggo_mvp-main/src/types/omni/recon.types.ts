import { IOmniAtom } from "../../core/omni-types";

/**
 * 💡 Business Reconnaissance Taxonomy (S1-S5)
 */
export type ReconCategory = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';

/**
 * S1 全球治理 (Global Governance)
 * S2 揭露框架 (Standards & Disclosure)
 * S3 全球智庫 (Think Tanks & Research)
 * S4 資本金融 (Finance & Capital)
 * S5 產業技術 (Sector & Tech)
 */
export const RECON_TAXONOMY: Record<ReconCategory, string> = {
    S1: 'Global Governance',
    S2: 'Standards & Disclosure',
    S3: 'Think Tanks & Research',
    S4: 'Finance & Capital',
    S5: 'Sector & Tech'
};

/**
 * 🏛️ IIntelNode5T: 商業偵情 5T 協議節點
 * 繼承自 IOmniAtom，遵循 5T 協議：Tangible, Traceable, Trackable, Transparent, Trustworthy
 */
export interface IIntelNode5T extends IOmniAtom {
    category: ReconCategory;
    impact_level: 1 | 2 | 3 | 4 | 5;
    protocol_5T: {
        tangible: boolean;      // 🟢 可感知 (UI Rendering Ready)
        traceable: string;      // 🟢 可溯源 (source_origin URL/ID)
        trackable: string[];    // 🔵 可追蹤 (Lifecycle Hooks / Audit Trail)
        transparent: string;    // 🟠 可透明 (Formula / ISO Standard Reference)
        trustworthy: string;    // 🔴 不可篡改 (SHA-256 Hash Lock)
    };
    payload: {
        title: string;
        decision_ready_insight: string; // 90天行動建議
        affected_supply_chain?: string[];
        entities?: string[];
        raw_data?: any;
    };
}
