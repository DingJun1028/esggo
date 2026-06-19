/**
 * 💎 IComponentCore: 善向永續核心介面
 * Goodward Sustainability Core - 4可1不可狀態機
 * 
 * 遵循 5T 邏輯門：
 * - Tangible 可感知
 * - Traceable 可溯源
 * - Trackable 可追蹤
 * - Transparent 可透明驗算
 * - Trustworthy 不可篡改
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * 證據佐證庫 - 包含 5T 檢驗元數據
 */
export interface IEvidence {
    /** 🟢 可感知：具體指標定義 */
    tangible_metric: string;
    /** 🟢 可溯源：原始資料路徑 */
    source_origin: string;
    /** 🟢 可追蹤：數據流轉日誌 */
    lifecycle_hooks: string[];
    /** 🟢 可透明驗算：[ISO-14064-1] 等公式來源 */
    formula_ref: string;
}

/**
 * 5T 狀態枚舉
 */
export type T5Status = 
    | 'Tangible'      // 可感知
    | 'Traceable'    // 可溯源
    | 'Trackable'    // 可追蹤
    | 'Transparent'  // 可透明驗算
    | 'Trustworthy'  // 不可篡改
    | 'Potential'    // 潛在
    | 'Active'       // 活躍
    | 'Archived';    // 已存檔

/**
 * 生命週期鉤子記錄
 */
export interface ILifecycleHook {
    id: string;
    timestamp: number;
    action: string;
    source_module: string;
    target_module?: string;
    metadata?: Record<string, any>;
}

/**
 * 萬能永憶主體 - IComponentCore 核心實作
 */
export interface IComponentCore<T = any> {
    /** 萬能永憶主體唯一識別碼 */
    readonly uuid: string;
    /** 版本號 (ESG GO 善向永續版通常為 v1.0.0+) */
    readonly version: string;
    /** 來源模組/身分 (Traceable) */
    readonly sourceOrigin?: string;
    /** 影響力指標描述 (可選) */
    readonly impactMetric?: string;
    /** 刻印時間戳 */
    readonly timestamp: number;
    /** 證據佐證庫 (5T 檢驗元數據數組) */
    evidence: any[];
    /** 數據校驗鎖 */
    hash_lock: string;
    /** 數位簽章 (SHA-256) */
    hash_signature?: string;
    /** 前一筆數據的 Hash (形成鏈結) */
    previous_hash?: string;
    /** 當前 5T 狀態 */
    status: T5Status;
    /** 實作生命週期 Hook (Trackable - 可追蹤) */
    lifecycle_events?: ILifecycleHook[];
    /** 是否已執行 Object.freeze() */
    isFrozen: boolean;
    /** 業務數據 */
    data?: T;
}

/**
 * 5T 邏輯門工廠
 */
export class T5LogicGate {
    /**
     * 執行 5T 驗證流程
     */
    static async validate(data: IComponentCore): Promise<{
        passed: boolean;
        currentGate: T5Status;
        gatesCompleted: T5Status[];
    }> {
        const gatesCompleted: T5Status[] = [];
        const evidenceMap = (data.evidence || []).reduce((acc: Record<string, any>, curr: any) => {
            if (curr && typeof curr === 'object') {
                return { ...acc, ...curr };
            }
            return acc;
        }, {} as Record<string, any>);
        
        // 1. Tangible - 檢查是否有具體指標
        if (evidenceMap.tangible_metric) {
            gatesCompleted.push('Tangible');
        }
        
        // 2. Traceable - 檢查是否有來源標註
        if (evidenceMap.source_origin) {
            gatesCompleted.push('Traceable');
        }
        
        // 3. Trackable - 檢查是否有生命週期記錄
        if (evidenceMap.lifecycle_hooks && (evidenceMap.lifecycle_hooks.length > 0 || evidenceMap.has_lifecycle)) {
            gatesCompleted.push('Trackable');
        }
        
        // 4. Transparent - 檢查是否有公式參考
        if (evidenceMap.formula_ref) {
            gatesCompleted.push('Transparent');
        }
        
        // 5. Trustworthy - 檢查是否已執行雜湊鎖定
        if (data.hash_lock && data.status === 'Trustworthy') {
            gatesCompleted.push('Trustworthy');
        }
        
        const passed = gatesCompleted.length === 5;
        const currentGate = passed ? 'Trustworthy' : (gatesCompleted[gatesCompleted.length] as T5Status || 'Tangible');
        
        return { passed, currentGate, gatesCompleted };
    }

    /**
     * 計算 5T 門徑完成度
     */
    static calculateProgress(data: IComponentCore): number {
        let completed = 0;
        const evidenceMap = (data.evidence || []).reduce((acc: Record<string, any>, curr: any) => {
            if (curr && typeof curr === 'object') {
                return { ...acc, ...curr };
            }
            return acc;
        }, {} as Record<string, any>);
        
        if (evidenceMap.tangible_metric) completed++;
        if (evidenceMap.source_origin) completed++;
        if (evidenceMap.lifecycle_hooks?.length || evidenceMap.has_lifecycle) completed++;
        if (evidenceMap.formula_ref) completed++;
        if (data.hash_lock && data.status === 'Trustworthy') completed++;
        
        return (completed / 5) * 100;
    }
}

/**
 * Dr. Thoth 數據封印服務
 */
export class DrThothSealer {
    /**
     * 生成雜湊鎖
     */
    static generateHashLock(data: any): string {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `0x${Math.abs(hash).toString(16).padStart(16, '0')}`;
    }

    /**
     * 執行數據封印動作
     */
    static sealData<T>(component: IComponentCore<T>): IComponentCore<T> {
        // 生成雜湊鎖
        const hashLock = this.generateHashLock({
            uuid: component.uuid,
            version: component.version,
            timestamp: component.timestamp,
            evidence: component.evidence,
            data: component.data
        });

        // 執行 Object.freeze() 確保不可篡改
        const sealed = Object.freeze({
            ...component,
            hash_lock: hashLock,
            status: 'Trustworthy' as T5Status
        });

        return sealed;
    }

    /**
     * 驗證數據完整性
     */
    static verifyIntegrity(component: IComponentCore): boolean {
        if (!component.hash_lock || component.status !== 'Trustworthy') {
            return false;
        }

        const currentHash = this.generateHashLock({
            uuid: component.uuid,
            version: component.version,
            timestamp: component.timestamp,
            evidence: component.evidence,
            data: component.data
        });

        return currentHash === component.hash_lock;
    }
}

/**
 * IComponentCore 工廠函數
 */
export function createComponent<T>(
    data: T,
    evidence: any[] = [],
    options?: {
        tangible_metric?: string;
        source_origin?: string;
        formula_ref?: string;
        version?: string;
    }
): IComponentCore<T> {
    const combinedEvidence = [...evidence];
    if (options?.tangible_metric) combinedEvidence.push({ tangible_metric: options.tangible_metric });
    if (options?.source_origin) combinedEvidence.push({ source_origin: options.source_origin });
    if (options?.formula_ref) combinedEvidence.push({ formula_ref: options.formula_ref });

    const component: IComponentCore<T> = {
        uuid: `atom-${uuidv4()}`,
        version: options?.version || 'v1.0.0',
        timestamp: Date.now(),
        evidence: combinedEvidence,
        hash_lock: '',
        status: 'Tangible' as T5Status,
        isFrozen: false,
        data
    };

    return component;
}

/**
 * 添加生命週期鉤子
 */
export function addLifecycleHook(
    component: IComponentCore,
    action: string,
    sourceModule: string,
    targetModule?: string,
    metadata?: Record<string, any>
): IComponentCore {
    const hook: ILifecycleHook = {
        id: `hook-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        action,
        source_module: sourceModule,
        target_module: targetModule,
        metadata
    };

    const currentEvidence = Array.isArray(component.evidence) ? component.evidence : [component.evidence];
    
    return {
        ...component,
        evidence: [
            ...currentEvidence,
            { lifecycle_hooks: [...(currentEvidence.find(e => e.lifecycle_hooks)?.lifecycle_hooks || []), hook.id] }
        ],
        // 同時記錄鉤子詳情
        data: {
            ...component.data,
            _hooks: [...((component.data as any)?._hooks || []), hook]
        } as any
    };
}

export default IComponentCore;
