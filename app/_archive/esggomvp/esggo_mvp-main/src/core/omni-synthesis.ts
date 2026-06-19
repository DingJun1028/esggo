import { IOmniAtom } from "./omni-types";

/**
 * 🧠 OmniSynthesis Engine
 * 負責將 24 項 MECE 服務數據合成為全域 OmniScore
 */
export class OmniSynthesis {
    private static instance: OmniSynthesis;

    private constructor() { }

    public static getInstance(): OmniSynthesis {
        if (!OmniSynthesis.instance) {
            OmniSynthesis.instance = new OmniSynthesis();
        }
        return OmniSynthesis.instance;
    }

    /**
     * 計算全域 OmniScore [0-100]
     * 邏輯：(Σ 指標值 * 權重) * 共鳴修正係數
     */
    public calculateOmniScore(atoms: IOmniAtom<any>[]): number {
        if (!atoms || atoms.length === 0) return 0;

        const weights = {
            E: 0.4, // Environmental
            S: 0.3, // Social
            G: 0.3, // Governance
        };

        const categories: Record<string, { total: number; count: number }> = {
            E: { total: 0, count: 0 },
            S: { total: 0, count: 0 },
            G: { total: 0, count: 0 },
        };

        atoms.forEach((atom) => {
            const category = (atom.tags || []).find(t => ['E', 'S', 'G'].includes(t.semantic))?.semantic || 'E';
            // Type healing: use health from payload or fallback
            const payload = atom.payload as Record<string, any>;
            const value = typeof atom.payload === 'number' ? atom.payload : payload?.health || 50;

            if (categories[category]) {
                categories[category].total += value;
                categories[category].count += 1;
            }
        });

        let weightedScore = 0;
        Object.entries(categories).forEach(([cat, data]) => {
            const avg = data.count > 0 ? data.total / data.count : 0;
            weightedScore += avg * (weights[cat as keyof typeof weights] || 0);
        });

        // 🌀 熵值修正 (Entropy Correction)
        // 假設熵值越高，系統越混亂，分數略微下降
        const avgEntropy = atoms.reduce((acc, curr) => acc + (curr.hypercube?.entropy || 0), 0) / atoms.length;
        const entropyFactor = 1 - (avgEntropy * 0.2); // 最大影響 20%

        // ✨ 共鳴修正 (Harmony Boost)
        const avgHarmony = atoms.reduce((acc, curr) => acc + (curr.hypercube?.harmony || curr.sentientState?.harmony || 0), 0) / atoms.length;
        const harmonyFactor = 1 + (avgHarmony * 0.1); // 最大提升 10%

        const finalScore = Math.min(100, Math.max(0, weightedScore * entropyFactor * harmonyFactor));
        return Math.round(finalScore);
    }

    /**
     * 產生具體的感悟建議 (Karma Repair Actions)
     * 🧠 v1.1: 深度感知 5T 維度與超立方體狀態
     */
    public generateSentientActions(atoms: IOmniAtom<any>[]) {
        const actions: { id: string; type: string; message: string; severity: 'low' | 'medium' | 'high' }[] = [];

        if (!atoms || atoms.length === 0) {
            return [{
                id: 'seed-inception',
                type: 'Genesis Request',
                message: '系統尚無共鳴種子，建議投射首個「Impact Intent」開啟顯化。',
                severity: 'medium' as const
            }];
        }

        // 1. [Karma Repair] 偵測低健康度或高熵值原子
        const volatileAtoms = atoms.filter(a => 
            ((a.payload as any)?.health || 100) < 40 || 
            (a.hypercube?.entropy || 0) > 0.7
        );

        volatileAtoms.forEach(atom => {
            actions.push({
                id: `repair-${atom.uuid}`,
                type: 'Karma Repair',
                message: `偵測到原子 [${atom.uuid.slice(0,8)}] 熵值過高 (${(atom.hypercube?.entropy || 0).toFixed(2)})，建議執行「Amber Freeze」強化封印。`,
                severity: 'high' as const
            });
        });

        // 2. [Resonance Bridge] 檢查領域失衡
        const eAtoms = atoms.filter(a => a.domainRef?.includes('Carbon') || a.tags?.some(t => t.semantic === 'E'));
        const sAtoms = atoms.filter(a => a.domainRef?.includes('Impact') || a.tags?.some(t => t.semantic === 'S'));
        
        if (eAtoms.length > sAtoms.length * 2 && sAtoms.length > 0) {
            actions.push({
                id: 'bridge-es',
                type: 'Resonance Bridge',
                message: '環境數據 (E) 與社會影響 (S) 失衡，建議啟動跨領域共鳴橋接。',
                severity: 'medium' as const
            });
        }

        // 3. [Trinity Guidance] 由 Dr. Thoth 或 OmniOne 驅動的洞察
        const avgResonance = atoms.reduce((acc, curr) => acc + (curr.sentientState?.resonance || curr.hypercube?.harmony || 0), 0) / atoms.length;
        if (avgResonance > 0.8 && actions.length === 0) {
            actions.push({
                id: 'thoth-wisdom',
                type: 'Gnosis Insight',
                message: '全域共鳴度極佳。Dr. Thoth 建議：將當前狀態封存為「Sovereign Knowledge Asset」。',
                severity: 'low' as const
            });
        }

        // 4. Fallback
        if (actions.length === 0) {
            actions.push({
                id: 'standard-pulse',
                type: 'Sentient Advice',
                message: '系統運行穩定。正在優化 5T 治理路徑，維持隨機熵值平衡。',
                severity: 'low' as const
            });
        }

        return actions;
    }

    /**
     * 🏛️ 合成全域 Master Report (soul-hero-001)
     * 為 MasterReportView 提供聚合數據支援
     */
    public async synthesizeMasterReport(): Promise<Record<string, any>> {
        // 模擬從各項原子數據中提取
        const summary = "ESG GO 平台已跨越至第 12 代顯化架構 (v12.0)。我們不僅管理數據，更在修煉永續。透過 5T 協議與 Gnosis 因果引擎，每一份報告都是不可篡改的「永續資產」。";

        return {
            summary,
            score: 92,
            protocol5T: {
                tangible: { status: "Pass", value: "Verified by LiquidGlass", evidence: "soul-aura-v8" },
                traceable: { status: "Pass", value: "Chain-locked", evidence: "SHA-256 enabled" },
                trackable: { status: "Pass", value: "100% Path covered", evidence: "Lifecycle Hooks active" },
                transparent: { status: "Pass", value: "Formula public", evidence: "ISO-14064-1 standard" },
                trustworthy: { status: "Pass", value: "Asset sealed", evidence: "Eternal Vault locked" }
            },
            milestones: [
                { id: 1, title: "Foundation Layer Solidified", status: "Complete" },
                { id: 2, title: "Domain Resonance Achieved", status: "Complete" },
                { id: 3, title: "Final Manifestation v12.0", status: "Active" }
            ]
        };
    }
}

/**
 * 💡 導出為 OmniSynthesisEngine 以相容現有組件調用
 */
export const OmniSynthesisEngine = OmniSynthesis.getInstance();
