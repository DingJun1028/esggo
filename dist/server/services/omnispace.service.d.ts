/**
 * OmniSpace Service
 * 萬能空間核心服務層：真理狀態重建、卡牌自癒調和、ZKP 封印作業
 */
import { OmniCard } from '@/src/shared/types';
export declare class OmniSpaceService {
    /**
     * 取得指定卡牌的真理狀態
     * @param uuid 卡牌唯一溯源 ID
     */
    getTruthState(uuid: string): unknown;
    /**
     * 觸發全域自癒引擎進行卡牌狀態調和
     * @param card OmniCard 卡牌快照
     */
    healCard(card: OmniCard): Promise<import("../../../lib/omni-space/global-healing").HealingResult>;
    /**
     * 呼叫底層 CLI 進行 ZKP 封印
     * @param documentId 證據文件 ID
     */
    sealDocument(documentId: string): Promise<{
        success: boolean;
        stdout?: string;
        stderr?: string;
        error?: string;
    }>;
    /**
     * 驗證文件 ID 格式，防止命令注入
     */
    private validateDocumentId;
}
export declare const omniSpaceService: OmniSpaceService;
//# sourceMappingURL=omnispace.service.d.ts.map