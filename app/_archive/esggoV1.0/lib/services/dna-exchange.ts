import { v7 as uuidv7 } from "uuid";

/**
 * DNAExchangeService (DNA 交換協議)
 * 負責在不同工作區 (Workspace) 之間遷移代理狀態與 ESG 指標數據。
 */
export class DNAExchangeService {
    private static instance: DNAExchangeService;

    private constructor() { }

    public static getInstance(): DNAExchangeService {
        if (!DNAExchangeService.instance) {
            DNAExchangeService.instance = new DNAExchangeService();
        }
        return DNAExchangeService.instance;
    }

    /**
     * 導出 DNA 封裝包 (DNA Encapsulation)
     */
    public exportDNA(agentId: string, state: any): string {
        const dnaBundle = {
            id: `DNA-${uuidv7()}`,
            origin: agentId,
            timestamp: new Date().toISOString(),
            payload: state,
            integritySeal: Buffer.from(JSON.stringify(state)).toString("base64").substring(0, 32)
        };

        console.log(`[DNA] Encapsulated state for agent ${agentId}.`);
        return JSON.stringify(dnaBundle);
    }

    /**
     * 導入 DNA 封裝包 (DNA Assimilation)
     */
    public importDNA(dnaJson: string) {
        try {
            const bundle = JSON.parse(dnaJson);
            console.log(`[DNA] Assimilating DNA bundle from ${bundle.origin}...`);
            return bundle.payload;
        } catch (error) {
            throw new Error("DNA 損毀，無法進行跨空間解析。");
        }
    }
}

export const dnaExchange = DNAExchangeService.getInstance();
