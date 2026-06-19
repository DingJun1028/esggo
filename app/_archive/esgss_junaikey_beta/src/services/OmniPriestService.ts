import { IOraculumRequest, IProvider, IPriestTransaction, SPELL_PRICES, ITrinityResponse, ITrinityState } from '@/types/omni/trinity';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { EvidenceVault } from '@/services/EvidenceVault';
import { OmniUUIDGenerator, OmniEntityPrefix } from '@/utils/OmniUUIDGenerator.js';
import { EventEmitter } from '@/utils/EventEmitter';
import { omniKeyKeeper } from './OmniKeyKeeperService';
import { omniGemini } from './OmniGeminiService';
import { trinityResonance } from './omni/TrinityResonanceService';

/**
 * ⚖️ 奧秘祭司 (OmniPriest) - 資源調度與價值轉換的中樞
 * 
 * 核心哲學：價值與成本的解耦 (Decoupling Value & Cost)
 * 作為三位一體中的「天秤 (Scale)」，協調「元鑰 (Key)」與「雙星 (Star)」。
 */
export class OmniPriestService {
    private static instance: OmniPriestService;
    private providers: IProvider[] = [];
    public events: EventEmitter = new EventEmitter();

    private constructor() {
        this.initializeProviders();
    }

    public static getInstance(): OmniPriestService {
        if (!OmniPriestService.instance) {
            OmniPriestService.instance = new OmniPriestService();
        }
        return OmniPriestService.instance;
    }

    /**
     * 初始化執行節點 (執行層) - 加入 4D 初始指標
     */
    private initializeProviders() {
        // 🆓 免費/開源節點 (e.g., Local Llama)
        this.providers.push({
            uuid: OmniUUIDGenerator.generate(OmniEntityPrefix.AVATAR),
            name: 'Aqua-Lite Core',
            type: 'free',
            cost: 0,
            metrics: { intelligence: 0.6, persistence: 0.9, security: 0.7, speed: 0.8 },
            execute: async (cmd, payload) => ({ data: `Free response to ${cmd}`, provider: 'Aqua-Lite' })
        });

        // 💎 高階付費節點 (e.g., GPT-4)
        this.providers.push({
            uuid: OmniUUIDGenerator.generate(OmniEntityPrefix.AVATAR),
            name: 'Omni-Prime Neural',
            type: 'premium',
            cost: 2,
            metrics: { intelligence: 0.95, persistence: 0.98, security: 0.9, speed: 0.6 },
            execute: async (cmd, payload) => ({ data: `Premium response to ${cmd}`, provider: 'Omni-Prime' })
        });

        // 💠 實驗性邊緣節點 (Hybrid/Edge)
        this.providers.push({
            uuid: OmniUUIDGenerator.generate(OmniEntityPrefix.AVATAR),
            name: 'CX-7 Edge Resonator',
            type: 'local',
            cost: 0.5,
            metrics: { intelligence: 0.75, persistence: 0.6, security: 0.95, speed: 0.95 },
            execute: async (cmd, payload) => ({ data: `Edge resonance for ${cmd}`, provider: 'CX-7' })
        });
    }

    /**
     * 發動符文號令 (神聖代償與超立方進化)
     */
    public async handleRequest(request: IOraculumRequest): Promise<ITrinityResponse> {
        const { command, userTier } = request;

        // 1. 估值階段 (對外定價)
        const listPrice = SPELL_PRICES[command] || 10;
        omniLogger.info(LogCategory.FINANCE as any, `Deducting ${listPrice} tokens from ${userTier} summoner for ${command}`);

        // 2. 超立方智慧路由 (Hypercube Dimensional Routing)
        const provider = this.selectBestProvider(request);
        omniLogger.info(LogCategory.SYSTEM as any, `[Protocol Phase 87] Routing ${command} to ${provider.name}`);

        try {
            // 3. 執行任務
            const startTime = Date.now();
            const result = await provider.execute(command, request.payload);
            const duration = Date.now() - startTime;

            // 💡 計算本次共鳴分 (Resonance)
            const resonance = (provider.metrics.intelligence + provider.metrics.speed) / 2;

            // 4. 結算與價值轉換 (Traceable & Transparent)
            const transaction: IPriestTransaction = {
                id: OmniUUIDGenerator.generate(OmniEntityPrefix.TRANSACTION),
                timestamp: Date.now(),
                userDebit: listPrice,
                systemCost: provider.cost,
                profit: listPrice - provider.cost,
                providerId: provider.uuid,
                command,
                resonance
            };

            const trinityState: ITrinityState = trinityResonance.getTrinityState(
                1.0,
                omniKeyKeeper.getIntegrityMetrics(),
                (await omniGemini.analyze([], 'equilibrium')).resonanceLevel
            );

            await this.logAndSealTransaction(transaction, duration);

            return {
                info_one: {
                    request_id: transaction.id,
                    status: 'completed',
                    overview: {
                        summary: `${command} executed successfully via ${provider.name}`,
                        provider: provider.name,
                        resonance
                    },
                    detail: {
                        ...result,
                        traceablePath: provider.uuid,
                        integrity: 'Trustworthy'
                    },
                    extension: {
                        evolutionaryGain: resonance * 0.1,
                        timestamp: transaction.timestamp,
                        trinity: trinityState
                    }
                }
            };
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM as any, `Invocation failed for ${command}: ${(error as Error).message}`);
            throw error;
        }
    }

    /**
     * [Phase 87] 多維度路由演算法 (Dimensional Scoring)
     */
    private selectBestProvider(req: IOraculumRequest): IProvider {
        const command = req.command;

        // 權重分配 (根據命令需求調整)
        const weights = {
            'GENERATE_REPORT': { intelligence: 0.8, speed: 0.2, security: 0.9 },
            'STRATEGIC_ADVICE': { intelligence: 0.9, speed: 0.1, security: 0.7 },
            'BATTLE_RESONANCE': { speed: 0.9, intelligence: 0.3, security: 0.5 },
            'default': { intelligence: 0.5, speed: 0.5, security: 0.5 }
        };

        const currentWeights = (weights as any)[command] || weights.default;

        // 計算各節點的「超立方得分」
        const scoredProviders = this.providers.map(p => {
            const score =
                (p.metrics.intelligence * (currentWeights.intelligence || 0.5)) +
                (p.metrics.speed * (currentWeights.speed || 0.5)) +
                (p.metrics.security * (currentWeights.security || 0.5)) -
                (p.cost * 0.1) +
                (trinityResonance.getCurrentResonance() * 0.2); // Factor in resonance

            return { provider: p, score };
        });

        // 排序並過濾
        scoredProviders.sort((a, b) => b.score - a.score);

        // 如果沒有找到任何節點（理論上不應該發生），回傳第一個節點
        if (scoredProviders.length === 0) return this.providers[0] as IProvider;

        const best = scoredProviders[0];
        if (!best || !best.provider) return this.providers[0] as IProvider;

        const bestProvider = best.provider as IProvider;

        // 如果是用戶是 Sovereign，直接取最高分
        if (req.userTier === 'Sovereign') {
            return bestProvider;
        }

        // 一般用戶在成本與品質間取平衡
        const nonPremium = scoredProviders.find(s => s.provider && s.provider.type !== 'premium');
        return (nonPremium && nonPremium.provider) ? (nonPremium.provider as IProvider) : bestProvider;
    }

    /**
     * 交易記錄與封印 (Sealing in EvidenceVault)
     */
    private async logAndSealTransaction(tx: IPriestTransaction, duration: number) {
        // [5T] Deposit into EvidenceVault to make it Trustworthy
        await EvidenceVault.deposit(
            tx,
            `transaction-${tx.id}.json`,
            'application/json',
            'OmniPriest System',
            'SHAN-XIANG-SEAL-001'
        );

        omniLogger.info(LogCategory.FINANCE as any, `Transaction ${tx.id} sealed. Profit: ${tx.profit} in ${duration}ms`);

        // Emit event for real-time UI updates (e.g., Omni-Mind)
        this.events.emit('transaction', tx);
    }
}

export const omniPriest = OmniPriestService.getInstance();
