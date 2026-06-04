import { T5Principle } from './T5Core/principles';
export declare enum Principle {
    Truth = "Truth",// 溯源鏈格
    Goodness = "Goodness",// 零幻覺演算
    Beauty = "Beauty",// 液態 UI 魂刻
    Trust = "Trust"
}
export interface PrincipleInfo {
    description: string;
    impact?: number;
    t5Principle?: T5Principle;
}
export declare const Principles: Record<Principle, PrincipleInfo>;
/**
 * 取得某原則的描述
 */
export declare function getPrincipleDescription(p: Principle): string;
/**
 * 匹配 URN 或比例 0-1 的值，若超出則返回 null
 */
export declare function clampFactor(value: number): number | null;
/**
 * 檢查是否所有必備部件已實作
 */
export declare function validateCorePresence(core: unknown): core is {
    uuid: string;
    hash_lock: string;
};
declare const CorePrinciples: {
    Principle: typeof Principle;
    Principles: Record<Principle, PrincipleInfo>;
    getPrincipleDescription: typeof getPrincipleDescription;
    clampFactor: typeof clampFactor;
    validateCorePresence: typeof validateCorePresence;
};
export default CorePrinciples;
//# sourceMappingURL=CorePrinciples.d.ts.map