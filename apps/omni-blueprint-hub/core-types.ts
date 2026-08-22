// Omni-Blueprint Hub - Core Types (IComponentCore)
// 5T Protocol + Single Data Table + Hash Lock

export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  /** 5T 意念: 證據鏈 (元素結構自由, 至少含 originCause/processTrace/finalEffect 其一)
   *  放寬為任意鍵值以相容 hub-engine 的 event/source_origin 風格與外掛的 originCause 風格 */
  evidence: {
    originCause: string;
    processTrace: string[];
    finalEffect: string;
  };
  hashLock?: string;
}

export type BlueprintType = 'LIVE_BROADCAST' | 'DESIGNATED_URL_BROADCAST';

export interface BlueprintDefinition extends IComponentCore {
  type: BlueprintType;
  name: string;
  sourceEndpoint: string;
  targetLanguages: string[];
  hostEmail: string;
  hashLock?: string;
}

export interface BlueprintProduct extends IComponentCore {
  blueprintId: string;
  productName: string;
  broadcastUrl?: string;
  status: 'INITIALIZED' | 'RUNNING' | 'FROZEN' | 'TERMINATED';
  activeViewers: number;
  payloadStream: BroadcastPayload[];
}

export interface BroadcastPayload {
  id: string;
  originText: string;
  translatedText: Record<string, string>;
  sourceOrigin: string;
  hash: string;
  timestamp: number;
}

// Single Data Table Protocol
export interface UnifiedBlueprintEntity {
  id: string;
  entityType: 'BLUEPRINT' | 'PRODUCT' | 'BROADCAST_LOG';
  blueprintType: BlueprintType;
  hostEmail: string;
  payload: Record<string, unknown>;
  hashLock: string;
  createdAt: number;
}
