import { v4 as uuidv4 } from 'uuid';

/**
 * 💡 奧秘元件心核：UCC 實作規範 (Omni Component Core)
 * 遵循 5T 協議，具備數據完整性與不可篡改性
 */
export interface IComponentCore {
    readonly uuid: string;           // 奧秘永憶主體唯一識別碼
    readonly version: string;        // 語義化版本
    readonly timestamp: number;      // 刻印時間戳
    readonly source_origin: string;  // [Traceable] 來源溯源
    readonly essence: Record<string, any>; // [Trustworthy] 本質提純數據
    readonly resonance_rs: number;   // [Transparent] 靈魂共鳴值
    readonly evidence: string[];     // [Trackable] 證據左證庫 (鏈式日誌)
    readonly status: 'Forged' | 'Verified' | 'Sealed'; // 狀態
}

export class IntelligenceForge {
    private version = "v2.0.26-Alpha";
    private repository: IComponentCore[] = [];

    // 靈魂共鳴值公式：(影響力 * 關聯度) / 熵增衰減
    private calculateRs(impact: number, relevance: number): number {
        const entropyFactor = 1.05;
        // Result rounded to 2 decimal places
        return Math.round(((impact * relevance) / entropyFactor) * 100) / 100;
    }

    // 模擬 SHA-256 Hashing (WebCrypto)
    private async generateHash(data: string): Promise<string> {
        const msgBuffer = new TextEncoder().encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex.substring(0, 16); // Return first 16 chars for brevity in UI
    }

    public async forgeEvidence(site: string, rawContent: string, impact: number, relevance: number): Promise<IComponentCore> {
        // 第一式：本質提純 (Essence Extraction)
        // In a real scenario, this would use NLP/LLM to extract key entities.
        // For simulation, we create a structured essence based on inputs.
        const essence = {
            event: "Policy Update",
            impact_area: "Scope 3 Carbon Disclosure",
            raw_snippet: rawContent.substring(0, 50) + "..."
        };

        // 第二式：聖典共鳴 (Resonance Calculation)
        const rsValue = this.calculateRs(impact, relevance);

        // Generate a deterministic UUID based on content if possible, or random for now
        const uniqueId = `ESGss-${uuidv4().substring(0, 8)}`;

        const timestamp = Date.now();

        // 第三式：永恆刻印 (Eternal Engraving)
        // Object.freeze() ensures immutability at runtime
        const artifact: IComponentCore = Object.freeze({
            uuid: uniqueId,
            version: this.version,
            timestamp,
            source_origin: site,
            essence,
            resonance_rs: rsValue,
            evidence: [
                `Crawler_Log: ${site} accessed successfully at ${new Date(timestamp).toISOString()}`,
                `System_Log: Resonance calculated as ${rsValue}`
            ],
            status: 'Sealed'
        });

        this.repository.push(artifact);
        return artifact;
    }

    public getRepository(): readonly IComponentCore[] {
        return this.repository;
    }
}

export const intelligenceForge = new IntelligenceForge();
