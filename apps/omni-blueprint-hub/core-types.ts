// Omni-Blueprint Hub - Core Types (IComponentCore)
// 5T Protocol + Single Data Table + Hash Lock

export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: string;
  evidence: {
    originCause: string;
    processTrace: string[];
    finalEffect: string;
    [key: string]: any;
  };
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
  timestamp: string;
}

// Single Data Table Protocol
export interface UnifiedBlueprintEntity {
  id: string;
  entityType: 'BLUEPRINT' | 'PRODUCT' | 'BROADCAST_LOG';
  blueprintType: BlueprintType;
  hostEmail: string;
  payload: Record<string, unknown>;
  hashLock: string;
  createdAt: string;
}
