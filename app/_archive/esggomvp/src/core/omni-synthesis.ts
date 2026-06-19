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
            const value = typeof atom.payload === 'number' ? atom.payload : (atom.payload as any)?.health || 50;

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
        const avgHarmony = atoms.reduce((acc, curr) => acc + (curr.hypercube?.harmony || 0), 0) / atoms.length;
        const harmonyFactor = 1 + (avgHarmony * 0.1); // 最大提升 10%

        const finalScore = Math.min(100, Math.max(0, weightedScore * entropyFactor * harmonyFactor));
        return Math.round(finalScore);
    }

    /**
     * 產生具體的感悟建議 (Karma Repair Actions)
     */
    public generateSentientActions(atoms: IOmniAtom<any>[]) {
        const actions: { id: string; type: string; message: string; severity: 'low' | 'medium' | 'high' }[] = [];

        // 1. 偵測低健康度服務
        const lowHealthServices = atoms.filter(a => ((a.payload as any)?.health || 100) < 40);
        lowHealthServices.forEach(service => {
            actions.push({
                id: `repair-${service.uuid}`,
                type: 'Karma Repair',
                message: `偵測到「${(service.payload as any)?.name || '未知服務'}」數據失調，建議啟動 5T 重新校準。`,
                severity: 'high'
            });
        });

        // 2. 隨機生成由 Dr. Thoth 驅動的洞察 (模擬)
        if (actions.length === 0) {
            actions.push({
                id: 'optimization-1',
                type: 'Sentient Advice',
                message: '全域共鳴度良好，建議執行「G8: Crisis Resilience」備份存證。',
                severity: 'low'
            });
        }

        return actions;
    }

    /**
     * 🏛️ 合成全域 Master Report (soul-hero-001)
     * 為 MasterReportView 提供聚合數據支援
     */
    public async synthesizeMasterReport(): Promise<any> {
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
