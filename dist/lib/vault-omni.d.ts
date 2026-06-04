/**
 * ESG GO | vault_omni_core — 萬能聖碑刻印引擎
 * Single Table Architecture · 5T Integrity Protocol · Semantic Governance
 */
import type { IComponentCore } from '../src/shared/types/index.ts';
export type VaultDimension = 'IDENTITY' | 'LOGIC' | 'TRACE' | 'CORE';
export interface VaultOmniRecord {
    uuid: string;
    dimension: VaultDimension;
    hash_lock: string;
    payload: string;
    metadata: string;
    timestamp: number;
    created_at?: string;
}
/**
 * @function computeHashLock
 * @description 數據真理哈希鎖生成器。使用確定性 JSON 序列化與 Salt 增強安全性。
 */
export declare function computeHashLock(data: unknown): string;
/**
 * @function buildComponent
 * @description 建立萬能元件心核 - 依循「英標繁博」規範。
 */
export declare function buildComponent(params: {
    uuid?: string;
    sourceOrigin: string;
    lifecyclePath?: string[];
    version?: string;
    formula?: string;
    impactMetric?: string;
    evidenceData?: unknown;
    status?: unknown;
    griReference?: string;
}): IComponentCore;
/**
 * @function flattenToRecord
 * @description 將心核結構扁平化以利聖碑存儲。
 */
export declare function flattenToRecord(component: IComponentCore, dimension?: VaultDimension): VaultOmniRecord;
/**
 * @function readFromVault
 * @description 從聖碑讀取指定 UUID 的心核數據。
 */
export declare function readFromVault(uuid: string): Promise<IComponentCore | null>;
/**
 * @function readFromVaultByHashLock
 * @description 從聖碑讀取指定雜湊鎖的心核數據。
 */
export declare function readFromVaultByHashLock(hashLock: string): Promise<IComponentCore | null>;
/**
 * @function verifyRecord
 * @description 驗證聖碑紀錄的雜湊完整性。
 */
export declare function verifyRecord(uuid: string): Promise<boolean>;
/**
 * @function engraveToSingleTable
 * @description 聖碑刻印：完成 5T 誠信封印與 Vault 寫入。
 */
export declare function engraveToSingleTable(component: IComponentCore): Promise<{
    success: boolean;
    id?: string;
    error?: string;
}>;
//# sourceMappingURL=vault-omni.d.ts.map