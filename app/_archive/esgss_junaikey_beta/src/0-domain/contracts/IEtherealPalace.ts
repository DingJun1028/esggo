/**
 * 🏛️ 永恆宮殿契約 (IEtherealPalace) & 奧秘永憶 (IOmniMemory)
 * --------------------------------------------------
 * [系列] 奧秘永憶 (Omni Memory)
 * [功能] 定義記憶宮殿的存儲、檢索與權威化規範。
 */

import { UUID } from './Omni-component-core.types';

export interface MemoryPalaceStructure {
  theHall: {
    sessionId: string | null;
    recentInteractions: any[];
    activeContext: Record<string, any>;
  };
  theLibrary: {
    manifesto: string[];
    domainRules: Record<string, string[]>;
  };
  theVault: {
    evolutionLogs: any[];
    conceptWeights: Record<string, number>;
  };
}

export interface IEtherealPalace {
  readonly palaceId: UUID;
  readonly structure: MemoryPalaceStructure;

  accessHall(): any;
  queryLibrary(topic: string): string[];
  secureVault(artifact: any): Promise<void>;
}

export interface IOmniMemory {
  palace: MemoryPalaceStructure;
  lastSync: number;

  remember(key: string, value: any): void;
  recall(key: string): any;
  synchronize(): Promise<void>;
}
