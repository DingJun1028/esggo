/**
 * 💡 商業偵情中心 - 5T 協議閘口
 * Business Reconnaissance Center - 5T Protocol Gateway
 * 
 * 哲學：以神聖代碼契約鑄造永恆架構，在熵增的混沌中開闢秩序之路。
 * 將 30+ 源頭機構的原始數據，賦予「真、善、美、信」的屬性，最終冻结為不可篡改的戰略資產。
 */

import axios from 'axios';
import { ESGDataLock } from '../omni-5t-lock';

// ============== S1-S5 分類學 (Source Taxonomy) ==============
export type IntelCategory = 'S1' | 'S2' | 'S3' | 'S4' | 'S5';

/** S1-S5 分類定義 */
export const INTEL_CATEGORY_LABELS: Record<IntelCategory, { zh: string; en: string; description: string }> = {
    S1: { zh: '全球治理', en: 'Global Governance', description: 'UN, UNFCCC 等 - 法規與政策前兆' },
    S2: { zh: '揭露框架', en: 'Standards & Disclosure', description: 'ISSB, TCFD 等 - 企業必備語言' },
    S3: { zh: '全球智庫', en: 'Think Tanks & Research', description: 'WEF, MIT 等 - 系統性風險' },
    S4: { zh: '資本金融', en: 'Finance & Capital', description: 'NGFS, PRI 等 - 資本定價風險' },
    S5: { zh: '產業技術', en: 'Sector & Tech', description: 'SEMI, TSMC ESG 等 - 落地現實' }
};

// ============== 5T 協議介面 ==============
export interface IIntelNode5T {
    uuid: string;                          // 萬能永憶主體唯一識別碼
    version: string;                       // 版本號
    timestamp: number;                     // Unix Timestamp
    category: IntelCategory;                // S1-S5 分類
    impact_level: 1 | 2 | 3 | 4 | 5;      // 衝擊等級
    evidence: Record<string, any>;         // 證據左證庫
    protocol_5T: {
        tangible: boolean;                 // 🟢 可感知 (UI Rendering Ready)
        traceable: string;                 // 🟢 可溯源 (source_origin URL)
        trackable: string[];               // 🔵 可追蹤 (Lifecycle Hooks)
        transparent: string;               // 🟠 可透明 (Formula / ISO Tag)
        trustworthy: string;                // 🔴 不可篡改 (Hash Lock)
    };
    payload: {
        title: string;                      // 情報標題
        decision_ready_insight: string;    // 90天行動建議
        target_entities: string[];         // 目標實體列表
    };
}

// ============== 原始情報輸入 ==============
export interface RawIntelInput {
    source_url: string;                    // 源頭機構 URL
    source_name: string;                   // 源頭機構名稱
    title: string;                         // 情報標題
    insight: string;                       // 行動建議
    risk_score: number;                    // 風險分數 (0-100)
    affected_supply_chain: string[];        // 供應鏈影響實體
    raw_evidence: Record<string, any>;     // 原始證據
    iso_tags?: string[];                   // ISO 標準標籤
}

// ============== 5T 協議閘口核心類 ==============

/**
 * 深層 freeze 函數，確保所有巢狀物件都不可變更
 */
function deepFreeze<T>(obj: T): T {
    Object.freeze(obj);
    
    // 取得所有自有屬性
    Object.getOwnPropertyNames(obj).forEach((prop) => {
        const value = (obj as any)[prop];
        if (value && typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });
    
    return obj;
}

export class Intel5TGateway {
    private static dataLock = new ESGDataLock();

    /**
     * 產生情報節點 ID
     */
    private static generateIntelId(category: IntelCategory): string {
        return `INTEL-${category}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * 計算衝擊等級
     */
    private static calculateImpactLevel(riskScore: number): 1 | 2 | 3 | 4 | 5 {
        if (riskScore >= 80) return 5;
        if (riskScore >= 60) return 4;
        if (riskScore >= 40) return 3;
        if (riskScore >= 20) return 2;
        return 1;
    }

    /**
     * 處理商業偵情情報 - 5T 協議閘口
     * 將原始數據轉化為「決策可用內容」(Decision-Ready Content)
     */
    public static async processReconnaissanceIntel(
        rawData: RawIntelInput,
        category: IntelCategory
    ): Promise<IIntelNode5T> {
        // 1. 提取資訊熵 (Extract Quantum Essence)
        const intelId = this.generateIntelId(category);

        // 2. 產生 Hash Lock (不可篡改)
        const rawHashInput = JSON.stringify(rawData);
        const trustworthy = await this.dataLock.generateHash(rawHashInput);

        // 3. 鑄造 5T 神聖契約
        const intelNode: IIntelNode5T = {
            uuid: intelId,
            version: "2.0.0",
            timestamp: Date.now(),
            category: category,
            impact_level: this.calculateImpactLevel(rawData.risk_score),
            evidence: { ...rawData.raw_evidence },
            protocol_5T: {
                tangible: true,                                      // 標記為已準備好渲染「液態玻璃」UI
                traceable: rawData.source_url,                      // 🟢 [真] 鏈式日誌起點
                trackable: ['CREATED_AT_GATEWAY', 'MAPPED_TO_EXPOSURE'], // 🔵 [真] 流轉路徑
                transparent: rawData.iso_tags
                    ? rawData.iso_tags.join(' | ')
                    : 'SROI_Impact_Model_v2 [ISO-14064-1]',          // 🟠 [善] 零幻覺驗算標籤
                trustworthy: trustworthy                             // 🔴 [信] SHA-256 雜湊鎖
            },
            payload: {
                title: rawData.title,
                decision_ready_insight: rawData.insight,           // 90天行動建議
                target_entities: rawData.affected_supply_chain
            }
        };

        // 4. 核心禁區：寫入後即刻執行深層 Object.freeze()
        return deepFreeze(intelNode);
    }

    /**
     * 儲存情報到 NCBDB
     */
    private static readonly NCB_CONFIG = {
        instance: process.env.NCB_INSTANCE || '54686_esg_go_ncb',
        apiUrl: '/api/ncb-auth'
    };

    private static getNcbHeaders() {
        return {
            'Content-Type': 'application/json',
            'X-Database-Instance': this.NCB_CONFIG.instance
        };
    }

    public static async saveToNCB(intel: IIntelNode5T): Promise<any> {
        try {
            const url = `${this.NCB_CONFIG.apiUrl}/create/intel_reconnaissance_hub?Instance=${this.NCB_CONFIG.instance}`;
            const res = await axios.post(url, {
                uuid: intel.uuid,
                category: intel.category,
                impact_level: intel.impact_level,
                title: intel.payload.title,
                decision_ready_insight: intel.payload.decision_ready_insight,
                target_entities: intel.payload.target_entities.join(','),
                source_origin: intel.protocol_5T.traceable,
                iso_tags: intel.protocol_5T.transparent,
                hash_lock: intel.protocol_5T.trustworthy,
                frozen_payload: JSON.stringify(intel),
                version: intel.version,
                created_at: new Date(intel.timestamp).toISOString()
            }, {
                headers: this.getNcbHeaders()
            });
            return res.data;
        } catch (error) {
            console.error('Failed to save intel to NCBDB:', error);
            throw error;
        }
    }

    /**
     * 驗證情報完整性
     */
    public static async verifyIntel(originalData: RawIntelInput, storedHash: string): Promise<boolean> {
        const rawHashInput = JSON.stringify(originalData);
        const computedHash = await this.dataLock.generateHash(rawHashInput);
        return computedHash === storedHash;
    }
}

// ============== 匯出 ==============
export default Intel5TGateway;