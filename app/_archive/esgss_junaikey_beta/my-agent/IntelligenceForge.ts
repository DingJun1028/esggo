import hashlib from 'crypto';

/**
 * 💡 IntelligenceForge: ESG 商業偵情中心核心
 * 負責本質提純、R_s 共鳴值計算與 5T 協議鎖定。
 */
export interface IIntelligenceArtifact {
    readonly uuid: string;         // [Traceable] 唯一識別碼
    readonly source_origin: string; // [Traceable] 來源網址
    readonly timestamp: number;    // [Trackable] 時間戳
    readonly essence: any;         // [Transparent] 提純後的數據本質
    readonly resonance_rs: number; // [Transparent] 靈魂共鳴值
    readonly hash: string;         // [Trustworthy] SHA-256 鎖定雜湊
}

export class IntelligenceForge {
    private readonly version = "v2.0.26-Alpha";

    /**
     * 計算靈魂共鳴值 (Resonance R_s)
     * @param impact 政策影響力 (0-1)
     * @param relevance 企業關聯度 (0-1)
     */
    public calculateResonance(impact: number, relevance: number): number {
        const entropyFactor = 1.05; // 熵增衰減因子
        return Math.round(((impact * relevance) / entropyFactor) * 100) / 100;
    }

    /**
     * 對內容執行本質提純並封裝為 5T 產物
     */
    public forge(site: string, content: any, impact: number = 0.5, relevance: number = 0.5): IIntelligenceArtifact {
        const uuid = `ESGss-${this.generateId(site)}`;
        const rs = this.calculateResonance(impact, relevance);
        const timestamp = Date.now();

        const artifact: any = {
            uuid,
            source_origin: site,
            timestamp,
            essence: content,
            resonance_rs: rs,
        };

        // 執行 SHA-256 雜湊鎖定 (Trustworthy)
        const hash = this.calculateHash(artifact);

        const finalArtifact: IIntelligenceArtifact = {
            ...artifact,
            hash,
        };

        // 執行 Object.freeze() 確保不可篡改
        return Object.freeze(finalArtifact);
    }

    private generateId(seed: string): string {
        return hashlib.createHash('md5').update(`${seed}-${Date.now()}`).digest('hex').slice(0, 16);
    }

    private calculateHash(data: any): string {
        return hashlib.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }
}
