console.log('[DEBUG] OmniPromptService.ts loading...');
import { IInfoOneDNA, TruthStatus } from '../omni/InfoOneCore.js';
import omniLogger, { LogCategory } from '../../utils/omniLogger.js';
import { OmniGemini } from './OmniGemini.js';
import { v5 as uuidv5 } from 'uuid';
import { OmniCrypto } from '../../utils/crypto.js';

/**
 * 奧秘提詞 (OmniPrompt) 4元組架構
 */
export interface IPromptTuple {
    intent: string;      // I: 靈魂 (Intent)
    context: string;     // C: 域 (Context)
    constraints: string; // Ω: 律 (Constraints)
    manifestation: string; // Ψ: 形 (Manifestation)
}

/**
 * 💡 OmniPromptService: The Sacred Covenant P={I,C,Ω,Ψ}
 * --------------------------------------------------
 * This service centralizes AI prompt management and enforces
 * the 5T protocol on all AI-generated content.
 */
export class OmniPromptService {
    private gemini: OmniGemini;
    private readonly NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Default DNS namespace

    // 🟢 [律] Entropy Filter - Calibration standards
    private readonly ENTROPY_BARRIER = `
[ENTROPY FILTER - ZERO HALLUCINATION]
1. VERIFY: All data must be grounded in the provided Context (C).
2. CALIBRATE: Use [ISO-14064-1] for carbon metrics.
3. INJECT DNA: All outputs must anticipate structural tagging.
4. AUDIT: If uncertain, state "Discordance Detected" and request more data.
    `.trim();

    // 🟢 [形] W4 Ceremony Soul-Resonance Templates
    private readonly W4_TEMPLATES: Record<string, IPromptTuple> = {
        'ESG_DIAGNOSTIC': {
            intent: '企業永續健康檢查 (ESG Diagnostic)',
            context: '基於企業提供的年度報告、營運數據以及治理結構。',
            constraints: '必須遵循 GRI 與 SASB 國際標準。',
            manifestation: '呈現為液態玻璃風格的分析報告，包含風險矩陣。'
        },
        'CARBON_AUDIT': {
            intent: '碳盤存合規性稽核 (Carbon Audit)',
            context: '包含 Scope 1-3 的原始排放數據與電力補償憑證。',
            constraints: '嚴格執行 [ISO-14064-1] 算法，不得有誤差。',
            manifestation: '結構化數據表，標註 5T 誠信狀態標籤。'
        },
        'AI_AGENT_FORGE': {
            intent: 'AI 代理人鍛造 (Agent Forging)',
            context: '定義代理人的職責範圍、權限等級與知識庫邊界。',
            constraints: '必須具備「利他即利己」的王道價值觀。',
            manifestation: '技術契約風格的 JSON 配置檔，包含元資料鎖定。'
        }
    };

    constructor() {
        this.gemini = new OmniGemini();
    }

    /**
     * 合成奧秘提詞 (Synthesize OmniPrompt)
     * @param tuple The {I,C,Ω,Ψ} components
     * @returns A structured prompt string
     */
    public synthesize(tuple: IPromptTuple): string {
        return `
### [OmniPrompt Covenant]
**Intent (I)**: ${tuple.intent}
**Context (C)**: ${tuple.context}
**Constraints (Ω)**: ${tuple.constraints} \n ${this.ENTROPY_BARRIER}
**Manifestation (Ψ)**: ${tuple.manifestation}

---
[SYSTEM DIRECTIVE]
- LANGUAGE: Traditional Chinese Global (繁體中文).
- TERMS: Cyber-ESG, 5T Protocol, Entropy Reduction, InfoOne.
- STYLE: Premium, Scientific, Sentient.
        `.trim();
    }

    /**
     * 應用 W4 儀式模板 (Apply W4 Ceremony Template)
     * @param templateKey The key of the template to apply
     * @returns A DNA-wrapped response using the template
     */
    public async conductCeremony(templateKey: string, customContext?: string): Promise<IInfoOneDNA & { content: string }> {
        const template = this.W4_TEMPLATES[templateKey];
        if (!template) {
            throw new Error(`[OmniPrompt] Ceremony template not found: ${templateKey}`);
        }

        const tuple = {
            ...template,
            context: customContext || template.context
        };

        return this.summon(tuple);
    }

    /**
     * 執行共鳴召喚 (Execute Resonance Summon)
     * @param tuple The {I,C,Ω,Ψ} components
     * @returns A DNA-wrapped response
     */
    public async summon(tuple: IPromptTuple): Promise<IInfoOneDNA & { content: string }> {
        const fullPrompt = this.synthesize(tuple);
        omniLogger.info(LogCategory.AI, '[OmniPrompt] Initiating resonance summon', { intent: tuple.intent });

        const rawContent = await this.gemini.generateText(fullPrompt);

        // Generate DNA И(DNA)
        const timestamp = Date.now();
        const uuid = uuidv5(tuple.intent + timestamp, this.NAMESPACE);

        // 5T Protocol: Trustworthy (不可篡改) - Generate real SHA-256 seal
        const hash_lock = OmniCrypto.hash(rawContent);

        // 🟢 Traceable Tagging: Injecting DNA metadata into the final response
        const traceableContent = `
${rawContent}

---
[🧬 TRACEABLE TAGGING]
UUID: ${uuid}
ORIGIN: OmniPrompt:Gemini:2.0-Flash
STATUS: ${TruthStatus.TRACKABLE}
HASH_LOCK: ${hash_lock}
        `.trim();

        const dnaResponse: IInfoOneDNA = {
            uuid,
            content: rawContent, // Now including the actual content for verification
            source_origin: 'OmniPrompt:Gemini:2.0-Flash',
            timestamp,
            hash_lock,
            status: TruthStatus.TRACKABLE,
            lifecycle_history: [
                {
                    timestamp,
                    action: 'Crystallization',
                    actor: 'OmniPromptService',
                    notes: 'Resonance summon with Traceable Tagging completed.'
                }
            ]
        };

        return dnaResponse;
    }
}
