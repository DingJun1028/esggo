// src/lib/ucc-engine/index.ts

import { createHash, randomUUID } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase/server.js';

export interface UCCData {
    uuid: string;
    timestamp: number;
    formula: string;
    impactMetric: Record<string, any>;
    hashLock: string;
    sourceOrigin: string;
    lifecycleStage: 'draft' | 'verified' | 'published' | 'archived';
    metadata?: Record<string, any>;
}

export interface SealInput {
    formula: string;
    impactMetric: Record<string, any>;
    sourceOrigin: string;
    lifecycleStage: 'draft' | 'verified' | 'published' | 'archived';
    metadata?: Record<string, any>;
}

/**
 * UCC Engine：Universal Carbon Chronicle 引擎
 * 負責封裝、驗證與溯源碳排數據
 * [5T] 🔴 Trustworthy - 不可篡改的誠信核心
 */
export class UCCEngine {
    /**
     * 封裝數據並寫入 Evidence Vault
     */
    async sealEvidence(input: SealInput): Promise<UCCData> {
        const uuid = randomUUID();
        const timestamp = Date.now();

        // 計算 Hash Lock
        const hashLock = this.computeHashLock({
            uuid,
            timestamp,
            formula: input.formula,
            impactMetric: input.impactMetric,
        });

        // 建立 UCC 數據
        const uccData: UCCData = {
            uuid,
            timestamp,
            formula: input.formula,
            impactMetric: input.impactMetric,
            hashLock,
            sourceOrigin: input.sourceOrigin,
            lifecycleStage: input.lifecycleStage,
            metadata: input.metadata || {},
        };

        // 寫入資料庫
        const { error } = await supabaseAdmin
            .from('evidence_vault')
            .insert({
                uuid: uccData.uuid,
                timestamp: uccData.timestamp,
                formula: uccData.formula,
                impact_metric: uccData.impactMetric,
                hash_lock: uccData.hashLock,
                source_origin: uccData.sourceOrigin,
                lifecycle_stage: uccData.lifecycleStage,
                metadata: uccData.metadata,
            });

        if (error) {
            throw new Error(`封裝失敗：${error.message}`);
        }

        return uccData;
    }

    /**
     * 驗證證據的 Hash Lock 完整性
     */
    async verifyEvidence(uuid: string): Promise<boolean> {
        const { data, error } = await supabaseAdmin
            .from('evidence_vault')
            .select('*')
            .eq('uuid', uuid)
            .single();

        if (error || !data) {
            throw new Error('證據不存在');
        }

        const computedHash = this.computeHashLock({
            uuid: data.uuid,
            timestamp: data.timestamp,
            formula: data.formula,
            impactMetric: data.impact_metric,
        });

        return computedHash === data.hash_lock;
    }

    /**
     * 讀取證據
     */
    async getEvidence(uuid: string): Promise<UCCData | null> {
        const { data, error } = await supabaseAdmin
            .from('evidence_vault')
            .select('*')
            .eq('uuid', uuid)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            uuid: data.uuid,
            timestamp: data.timestamp,
            formula: data.formula,
            impactMetric: data.impact_metric,
            hashLock: data.hash_lock,
            sourceOrigin: data.source_origin,
            lifecycleStage: data.lifecycle_stage,
            metadata: data.metadata,
        };
    }

    /**
     * 批次封裝多筆數據
     */
    async batchSeal(inputs: SealInput[]): Promise<UCCData[]> {
        const results: UCCData[] = [];

        for (const input of inputs) {
            const sealed = await this.sealEvidence(input);
            results.push(sealed);
        }

        return results;
    }

    /**
     * 計算 Hash Lock
     */
    private computeHashLock(data: {
        uuid: string;
        timestamp: number;
        formula: string;
        impactMetric: Record<string, any>;
    }): string {
        // 排序 Key 以確保確定性 Hashing
        const sortedData = JSON.stringify(data, Object.keys(data).sort());
        return createHash('sha256').update(sortedData).digest('hex');
    }

    /**
     * 溯源：查詢某個證據的完整歷史
     */
    async traceEvidence(uuid: string): Promise<{
        evidence: UCCData;
        isValid: boolean;
        auditTrail: any[];
    }> {
        const evidence = await this.getEvidence(uuid);
        if (!evidence) {
            throw new Error('證據不存在');
        }

        const isValid = await this.verifyEvidence(uuid);

        // 查詢審計日誌
        const { data: auditTrail } = await supabaseAdmin
            .from('audit_trail')
            .select('*')
            .eq('record_id', uuid)
            .order('created_at', { ascending: false });

        return {
            evidence,
            isValid,
            auditTrail: auditTrail || [],
        };
    }

    /**
     * 生命週期管理：更新狀態（透過新建記錄實現不可篡改）
     */
    async transitionLifecycle(
        uuid: string,
        newStage: 'draft' | 'verified' | 'published' | 'archived'
    ): Promise<UCCData> {
        const evidence = await this.getEvidence(uuid);
        if (!evidence) {
            throw new Error('證據不存在');
        }

        // 建立新版本（不修改原始記錄，符合 5T 不可篡改原則）
        const newEvidence = await this.sealEvidence({
            formula: evidence.formula,
            impactMetric: evidence.impactMetric,
            sourceOrigin: evidence.sourceOrigin,
            lifecycleStage: newStage,
            metadata: {
                ...evidence.metadata,
                previousVersion: uuid,
                transitionedAt: Date.now(),
            },
        });

        return newEvidence;
    }
}

/**
 * 單例模式匯出
 */
export const uccEngine = new UCCEngine();
