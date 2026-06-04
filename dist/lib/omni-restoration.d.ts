import { IComponentCore } from '@/src/shared/types';
/**
 * 萬能修復（Omni Restoration）協議
 * 最高權限自癒機制 - 觀因循果
 */
export declare class OmniRestoration {
    /**
     * 1. 鏈式校驗 (Chain Validation)
     * 根據 [Truth] 鏈式日誌標註，對比原始數據起點。
     */
    static validateChain(uuid: string): Promise<{
        isValid: boolean;
        component: IComponentCore | null;
    }>;
    /**
     * 2. 殘影重組 (Ghost Recomposition)
     * 利用 Object.freeze() 保護的哈希鎖（Hash Lock）進行快照回滾。
     */
    static recomposeGhost(uuid: string): Promise<{
        isRestored: boolean;
        component: IComponentCore | null;
    }>;
    /**
     * 3. 語義修正 (Semantic Alignment)
     * 以「觀因循果」邏輯重新定義數據流向，消除邏輯斷層。
     */
    static alignSemantics(component: IComponentCore): Promise<IComponentCore>;
    /**
     * 執行完整萬能修復流程
     */
    static execute(uuid: string): Promise<IComponentCore | null>;
}
//# sourceMappingURL=omni-restoration.d.ts.map