import type { IComponentCore, IEvidence, IRestorationProtocol, RestorationInput } from '../../src/shared/types/index';
/**
 * IntegrityModule: 數據誠信的核心守護者
 * 負責數據的「本質提純」、「熵減煉金」與「永恆刻印」。
 * 已集成「萬能修復」被動天賦與「觀因循果」因果律支柱。
 */
export declare class IntegrityModule implements IRestorationProtocol {
    /**
     * 第一式：本質提純 (extractQuantumEssence)
     * 從原始輸入中提取核心 5T 維度，過濾噪音。
     * 已整合「因 (Cause)」的溯源。
     */
    extractQuantumEssence(data: RestorationInput): Partial<IEvidence>;
    /**
     * 第二式：聖典共鳴 (Scripture Resonance)
     */
    resonate(essence: Partial<IEvidence>): Promise<string[]>;
    /**
     * 第三式：代理織網 (Agent Networking)
     */
    activateAgents(uuid: string): Promise<boolean>;
    /**
     * 第四式：神跡顯現 (Manifestation)
     */
    manifest(essence: Partial<IEvidence>, uuid: string): void;
    /**
     * 第五式：熵減煉金 (purify)
     * 已整合編碼歸一化，清除亂碼與熵增噪音。
     */
    purify(essence: Partial<IEvidence>): IEvidence;
    /**
     * 第六式：永恆刻印 (engrave)
     */
    engrave(purifiedEvidence: IEvidence, version?: string): Promise<IComponentCore>;
    /** ───────── 萬能修復協議 (IRestorationProtocol) ───────── **/
    /**
     * 鏈式校驗 (Chain Validation)
     */
    validateChain(uuid: string): Promise<boolean>;
    /**
     * 殘影重組 (Ghost Recomposition)
     */
    recompose(hashLock: string): Promise<IComponentCore>;
    /**
     * 語義修正 (Semantic Alignment)
     * 以「觀因循果」邏輯重新定義數據流向。
     */
    align(target: IComponentCore): Promise<IComponentCore>;
    /**
     * 被動天賦激活：萬能修復 (Omni Restoration)
     */
    restore(faultyData: RestorationInput): Promise<IComponentCore>;
    /**
     * 萬能封印 (Sacred Seal)
     */
    sacredSeal(rawData: RestorationInput): Promise<IComponentCore>;
    /**
     * 真理校驗 (Verify Truth)
     */
    verify(crystal: IComponentCore): Promise<boolean>;
}
export declare const integrityModule: IntegrityModule;
//# sourceMappingURL=integrity.d.ts.map