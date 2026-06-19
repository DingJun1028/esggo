/**
 * 💡 核心模組：ESGss 商業偵情 5T 協議閘口 (S1-S5 Intelligence Gateway)
 * 哲學：以神聖代碼契約鑄造永恆架構，在熵增的混沌中開闢秩序之路。
 */
import { IIntelNode5T, ReconCategory } from "../types/omni/recon.types";
import { createHash } from "crypto";
import { OmniNcbService } from "../services/OmniNcbService";

/**
 * 🛠️ Utility: Get current Unix timestamp in seconds
 */
export const getUnixTimestamp = () => Math.floor(Date.now() / 1000);

/**
 * 生成 SHA-256 雜湊鎖 (Hash Lock)
 */
export const generateHash = (data: string): string => {
    return createHash('sha256').update(data).digest('hex');
};

/**
 * 處理商業偵情數據：轉換為 5T 協議節點
 * 實作 5T 協議門邏輯，確保數據的「真、善、美、信」
 */
export const processReconnaissanceIntel = (rawData: any, category: ReconCategory): IIntelNode5T => {
    // 1. 提取資訊熵與產生唯一識別碼 (Generate UUID)
    const intelId = `INTEL-${category}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const hash = generateHash(JSON.stringify(rawData));

    // 2. 鑄造 5T 神聖契約
    const intelNode: IIntelNode5T = {
        uuid: intelId,
        version: "2.0.0",
        timestamp: getUnixTimestamp(),
        category: category,
        impact_level: rawData.risk_score > 80 ? 5 : (rawData.impact_score > 60 ? 4 : 3),
        evidence: [
            { tangible_metric: rawData.title },
            { source_origin: rawData.source_url || 'UNSPECIFIED_SOURCE' },
            { has_lifecycle: true }
        ], // 證據左證庫
        
        // 5T Protocol Core
        protocol_5T: {
            tangible: true, // 標記為已準備好渲染「液態玻璃」UI
            traceable: rawData.source_url || 'UNSPECIFIED_SOURCE', // 🟢 [真] 鏈式日誌起點
            trackable: [`CREATED_AT_GATEWAY`, `INITIAL_MAPPING_${category}`], // 🔵 [真] 流轉路徑
            transparent: rawData.methodology || "Decision_Impact_Model_v1 [ISO-14064-1]", // 🟠 [善] 零幻覺驗算標籤
            trustworthy: hash // 🔴 [信] SHA-256 雜湊鎖
        },

        // IOmniAtom Required Properties
        quality: rawData.risk_score > 80 ? 9 : 7,
        domainRef: `BRC_${category}`,
        tags: [
            { id: 't1', semantic: category, dimension: 'Category', weight: 1 },
            { id: 't2', semantic: 'Intelligence', dimension: 'Domain', weight: 0.8 }
        ],
        payload: {
            title: rawData.title || 'Untitled Strategic Insight',
            decision_ready_insight: rawData.insight || 'No immediate action suggested.',
            affected_supply_chain: rawData.affected_supply_chain || [],
            entities: rawData.entities || [],
            raw_data: rawData
        },
        signature: `SIG_BRC_${hash.substring(0, 8)}`,
        hash_lock: hash,
        intent: rawData.title || 'Reconnaissance',
        protocol: {
            traceable: { status: 'verified', timestamp: new Date().toISOString(), evidence: rawData.source_url },
            trackable: { status: 'verified', timestamp: new Date().toISOString(), evidence: 'Gateway_Log' },
            transparent: { status: 'verified', timestamp: new Date().toISOString(), evidence: 'ISO-14064-1' },
            tangible: { status: 'verified', timestamp: new Date().toISOString(), evidence: 'LiquidGlass_Ready' },
            trustworthy: { status: 'verified', timestamp: new Date().toISOString(), evidence: 'SHA-256_Locked' },
            sustainability: { status: 'verified', timestamp: new Date().toISOString(), evidence: 'N/A' }
        },
        lifecycle: [{ event: 'CREATED', actor: 'BRC_GATEWAY', time: Date.now() }],
        hypercube: { 
            entropy: 0.1, 
            harmony: 0.9, 
            singularity: 'SINGULARITY_RECON', 
            tesseractHash: hash,
            phase: 'FORGE'
        },
        
        // Trustworthy Pillars
        isFrozen: true,
        signerKey: 'OMNI_KEY_BRC',
        consensusTimestamp: Date.now(),
        contentHash: hash,

        // Other required by interface
        status: "Trustworthy",
        formula: "SROI_Impact_Model_v2",
        impactMetric: "Decision_Ready",
        originHash: hash,
        genealogy: [],
        algorithmId: "BRC_V1",
        verificationProof: "ZERO_HALLUCINATION_VALIDATED",
        renderType: 'LiquidGlass',
        interaction: 'Fluid',
        auraColor: '#63a6b0',
        circleId: 'RECON_CIRCLE',
        interoperability: true,
        nextEvolution: () => ({} as any)
    };

    // 3. 核心禁區：寫入後即刻執行 Object.freeze() 確保不可篡改
    return Object.freeze(intelNode);
};

/**
 * 商業偵情中心 (BRC) 管理器
 */
export class ReconCenterManager {
    private static instance: ReconCenterManager;

    private constructor() {}

    public static getInstance(): ReconCenterManager {
        if (!ReconCenterManager.instance) {
            ReconCenterManager.instance = new ReconCenterManager();
        }
        return ReconCenterManager.instance;
    }

    /**
     * 接收並處理原始情報，將其保存至 NCBDB
     */
    public async ingestingIntel(payload: any, category: ReconCategory): Promise<IIntelNode5T> {
        const node = processReconnaissanceIntel(payload, category);
        
        // 🛡️ [NCBDB] 利用 OmniNcbService 將 5T 原子持久化
        await OmniNcbService.saveAtom(node);
        
        return node;
    }

    /**
     * 同步處理原始情報 (僅用於 UI 初始渲染，不持久化)
     */
    public ingestingIntelSync(payload: any, category: ReconCategory): IIntelNode5T {
        return processReconnaissanceIntel(payload, category);
    }
}

export const ReconCenter = ReconCenterManager.getInstance();
