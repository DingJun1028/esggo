import { AdkPersistenceService } from '../adk/services/AdkPersistenceService.js';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { SearchWorkflowState } from '../adk/types/AdkSearchTypes.js';

/**
 * AdkSentienceDriftService
 * 
 * 監測代理在全球熱點議題上的分析穩定性。
 * 定義「感知漂移 (Sentience Drift)」指標：當同類議題在不同時間點的分析出現矛盾時觸發警告。
 */

type DriftCallback = (data: any) => void;

/**
 * AdkSentienceDriftService
 * 
 * 監測代理在全球熱點議題上的分析穩定性。
 * 提供實時的 Drift Stream 與歷史比對功能。
 */
class AdkSentienceDriftService {
    private subscribers: DriftCallback[] = [];
    private currentScore: number = 98.2;
    private isRecalibrating: boolean = false;
    private timer: NodeJS.Timeout | null = null;

    constructor() {
        this.startSimulationLoop();
    }

    /**
     * 啟動模擬循環 (V2: 基於隨機擾動; V3: 基於真實 Agent 狀態)
     */
    private startSimulationLoop() {
        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            if (this.isRecalibrating) return;

            // 模擬自然熵增 (Entropy Increase)
            const entropy = (Math.random() - 0.48) * 0.15; // 稍微偏向下降
            this.currentScore = Math.min(100, Math.max(0, this.currentScore + entropy));

            // 廣播狀態
            this.broadcastStatus();
        }, 2000);
    }

    private broadcastStatus() {
        const driftLevel = this.calculateDriftLevel(this.currentScore);
        const event = {
            type: 'UPDATE',
            data: {
                resonanceScore: parseFloat(this.currentScore.toFixed(2)),
                activeNodes: Math.floor(Math.random() * 2) + 3, // 3-4 nodes
                status: this.isRecalibrating ? 'RECALIBRATING' : driftLevel,
                timestamp: new Date().toISOString()
            }
        };
        this.notifySubscribers(event);
    }

    private calculateDriftLevel(score: number): string {
        if (score < 80) return 'CRITICAL_FAILURE';
        if (score < 95) return 'DRIFT_DETECTED';
        return 'HARMONIC_OSCILLATION';
    }

    // --- SSE Subscription Support ---

    public subscribe(callback: DriftCallback) {
        this.subscribers.push(callback);
        // Send immediate initial state
        callback({
            type: 'INIT',
            data: {
                resonanceScore: this.currentScore,
                status: 'HARMONIC_OSCILLATION'
            }
        });
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    private notifySubscribers(data: any) {
        this.subscribers.forEach(cb => cb(data));
    }

    // --- Control Actions ---

    public async recalibrate() {
        this.isRecalibrating = true;
        this.notifySubscribers({
            type: 'UPDATE',
            data: { status: 'RECALIBRATING', resonanceScore: this.currentScore }
        });

        // 模擬校準過程
        await new Promise(resolve => setTimeout(resolve, 3000));

        this.currentScore = 99.9;
        this.isRecalibrating = false;

        this.notifySubscribers({
            type: 'LOG',
            data: {
                time: new Date().toLocaleTimeString(),
                type: 'SUCCESS',
                msg: 'AdkSentienceDriftService: Recalibration Complete. Entropy neutralized.'
            }
        });

        this.broadcastStatus();
    }

    /**
     * 檢測感知漂移 (Legacy Static Check)
     */
    public async detectDrift(currentSessionId: string, currentState: SearchWorkflowState) {
        omniLogger.info(LogCategory.SYSTEM, `[DRIFT] Starting drift detection for session: ${currentSessionId}`);

        try {
            // 1. 獲取歷史研究紀錄
            const historyResponse = await AdkPersistenceService.listHistory();

            if (!historyResponse.success || !historyResponse.data) {
                return { driftScore: 0, reason: 'Failed to fetch history' };
            }

            const history = historyResponse.data;

            // 2. 尋找語義相近的歷史主題 (目前匹配 Topic/Query)
            const similarResearch = history.filter((item: any) =>
                item.session_id !== currentSessionId &&
                this.isSimilar(item.query, currentState.query)
            );

            if (similarResearch.length === 0) {
                omniLogger.info(LogCategory.SYSTEM, `[DRIFT] No similar historical research found for: ${currentState.query}`);
                return { driftScore: 0, reason: 'Initial Research' };
            }

            // 3. 獲取最相近的一個紀錄進行比對
            const latestSimilar = similarResearch[0];
            if (!latestSimilar) {
                return { driftScore: 0, reason: 'No similar research to compare' };
            }

            const loadResponse = await AdkPersistenceService.loadResearch(latestSimilar.session_id);

            if (!loadResponse.success || !loadResponse.data) {
                return { driftScore: 0, reason: 'Historical state missing' };
            }

            const historicalData = loadResponse.data;
            const historicalState = historicalData.state as SearchWorkflowState;

            // 4. 計算漂移分數 (基於 sentientScore 的變化)
            const currentScore = currentState.sentientScore || 0;
            const historicalScore = historicalState.sentientScore || 0;
            const scoreDiff = Math.abs(currentScore - historicalScore);

            // 5. 判斷漂移程度
            let driftLevel: 'STABLE' | 'MODERATE_DRIFT' | 'CRITICAL_DRIFT' = 'STABLE';
            if (scoreDiff > 0.3) driftLevel = 'MODERATE_DRIFT';
            if (scoreDiff > 0.6) driftLevel = 'CRITICAL_DRIFT';

            omniLogger.info(LogCategory.SYSTEM, `[DRIFT] Analysis Result:`, {
                topic: currentState.query,
                currentScore,
                historicalScore,
                scoreDiff,
                driftLevel
            });

            return {
                driftScore: scoreDiff,
                driftLevel,
                historicalReference: latestSimilar.session_id,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `[DRIFT] Detection failed: ${error}`);
            return { driftScore: 0, error: String(error) };
        }
    }

    /**
     * 簡單的相似性判斷 (基於關鍵字)
     */
    private isSimilar(topic1: string, topic2: string): boolean {
        const words1 = topic1.toLowerCase().split(' ');
        const words2 = topic2.toLowerCase().split(' ');
        const intersection = words1.filter(w => words2.includes(w));
        // 如果有 50% 以上的單詞重合，認為相似
        return (intersection.length / Math.max(words1.length, words2.length)) > 0.5;
    }
}

export const adkSentienceDriftService = new AdkSentienceDriftService();
