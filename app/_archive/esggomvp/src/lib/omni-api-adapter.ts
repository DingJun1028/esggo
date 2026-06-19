/**
 * 🌐 OmniAPI Core Interface — ESG GO Omni Layer (Transcend Module)
 * 
 * 核心哲學：萬物互聯，生生不息。
 * 全能介面 (Omnipotent API) 的底層資料結構，允許與外部 ERP/IoT 系統對話，
 * 並在此轉換為符合 InfoOne 5T 協議的 IComponentCore 格式。
 */

import { IComponentCore } from "@/types/omni-core";
import { generateHashLock } from "@/utils/crypto/hash-lock";

export type IngestionProtocol = 'SAP_RFC' | 'MQTT' | 'RestAPI' | 'Manual_Upload';

export interface IUniversalAdapter {
    /**
     * 異質數據吞吐：吃下任何格式並轉化為 InfoOne 標準
     */
    ingest<T>(sourceData: T, meta: { originId: string, method: IngestionProtocol }): Promise<IComponentCore<T>>;

    /**
     * 知識圖譜映射 (概念介面)
     */
    mapToGraph(entityId: string, relationType: string, targetId: string): void;
}

export class OmniUniversalAdapter implements IUniversalAdapter {
    /**
     * 將外部傳入的 raw data 打包成符合 IComponentCore 真 (Truth) 協議的物件
     */
    async ingest<T>(sourceData: T, meta: { originId: string, method: IngestionProtocol }): Promise<IComponentCore<T>> {
        const timestamp = Date.now();
        // 取得來源資料快照 Hash
        const sourceHash = await generateHashLock(sourceData);
        // 使用原生 crypto 生成 UUID (Node 19+ 或新版瀏覽器支援 crypto.randomUUID)
        const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `mod-data-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const coreComponent: IComponentCore<T> = {
            uuid: uuid,
            version: "1.0.0",
            timestamp: timestamp,
            evidence: {
                origin_id: meta.originId,
                origin_hash: sourceHash,
                extraction_method: meta.method
            },
            lifecycle_events: [
                {
                    status: 'CREATED',
                    timestamp: timestamp,
                    actor: 'OmniAPI_Adapter'
                }
            ],
            data: sourceData,
            isFrozen: false // 預設未凍結，需經過後續 Truth 驗證與 Trust 鎖定
        };

        return coreComponent;
    }

    mapToGraph(entityId: string, relationType: string, targetId: string): void {
        // 實作知識圖譜的邊 (Edge) 建立邏輯
        console.log(`[Omni Graph] Mapping ${entityId} --[${relationType}]-> ${targetId}`);
    }
}

export const omniAdapter = new OmniUniversalAdapter();
