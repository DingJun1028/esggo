import type { EternalMemoryLink, Connection, MemoryQuery, MemoryResponse } from '../types';
import type { IEtherealPalace, MemoryPalaceStructure } from '../0-domain/contracts/IEtherealPalace';
import { UUID } from '../0-domain/contracts/Omni-component-core.types';

import { NCB_CONFIG, DateTime, EvolutionEvent } from '../types/omni';
import { omniLogger, LogCategory } from '../services/omniLogger';

const API_URL = `${NCB_CONFIG.baseUrl}/${NCB_CONFIG.instanceId}`;

/**
 * NCB 永恆宮殿連接 (NCB Eternal Palace Connection)
 * 實作領域契約以支援結構化記憶。
 */
export class NCBEternalPalace implements EternalMemoryLink, IEtherealPalace {
  private id: string;
  private conn: Connection | null = null;

  public readonly palaceId: UUID;
  public structure: MemoryPalaceStructure;

  constructor(id: string) {
    this.id = id;
    this.palaceId = id as UUID;
    this.structure = {
      theHall: {
        sessionId: null,
        recentInteractions: [],
        activeContext: {},
      },
      theLibrary: {
        manifesto: [
          '道法自然，系統毅然，上善若水，善向永續。',
          '以終為始，始終如一，無始無終，善向永續。',
        ],
        domainRules: {
          '5T': ['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'],
        },
      },
      theVault: {
        evolutionLogs: [],
        conceptWeights: {},
      },
    };
  }

  async connect(): Promise<Connection> {
    if (this.conn?.status === 'connected') return this.conn;

    try {
      // 測試連接
      const res = await fetch(`${API_URL}/omni_state`, {
        headers: {
          'xc-auth': NCB_CONFIG.token,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error(`NCB connection failed: ${res.status}`);

      this.conn = {
        id: `ncb-${Date.now()}`,
        status: 'connected',
        connectedAt: new DateTime(),
      };

      omniLogger.info(LogCategory.SYSTEM, `[NCB] Connected to Eternal Palace`);
      return this.conn;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, `[NCB] Connection failed`, { error });
      throw error;
    }
  }

  async query(request: MemoryQuery): Promise<MemoryResponse> {
    try {
      // 根據查詢類型選擇表
      const table = request.type === 'evolution-history' ? 'omni_state' : 'omni_memories';
      const url = `${API_URL}/${table}`;

      const res = await fetch(url, {
        headers: {
          'xc-auth': NCB_CONFIG.token,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        return { success: false, error: `Query failed: ${res.status}` };
      }

      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async recordEvolution(event: EvolutionEvent): Promise<void> {
    try {
      // 記錄到 omni_state
      await fetch(`${API_URL}/omni_state`, {
        method: 'POST',
        headers: {
          'xc-auth': NCB_CONFIG.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: this.id,
          mode: event.type,
          payload: JSON.stringify(event.data),
          timestamp:
            event.timestamp instanceof DateTime ? event.timestamp.toISOString() : event.timestamp,
        }),
      });
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, `[NCB] Record failed`, { error });
    }
  }

  /**
   * 同步當前系統狀態至宮殿
   */
  async syncCurrentState(state: Record<string, any>): Promise<boolean> {
    await this.connect();
    try {
      const res = await fetch(`${API_URL}/omni_state`, {
        method: 'POST',
        headers: {
          'xc-auth': NCB_CONFIG.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: `${this.id}-snapshot`,
          mode: 'snapshot',
          payload: JSON.stringify(state),
          timestamp: new Date().toISOString(),
        }),
      });
      return res.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * 進入大殿 (Access The Hall)
   * 獲取當前會話與情境。
   */
  accessHall(): any {
    return this.structure.theHall;
  }

  /**
   * 查詢圖書館 (Query The Library)
   * 獲取規則與引導知識。
   */
  queryLibrary(topic: string): string[] {
    omniLogger.info(LogCategory.SYSTEM, `[Palace] Library query: ${topic}`);
    return this.structure.theLibrary.manifesto;
  }

  /**
   * 封印至保險庫 (Secure The Vault)
   * 將資產永久保存並錨定。
   */
  async secureVault(artifact: any): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, `[Palace] Securing artifact in the vault...`);

    const timestamp = new Date().toISOString();
    this.structure.theVault.evolutionLogs.push({ ...artifact, securedAt: timestamp });

    await this.recordEvolution({
      type: 'evolution',
      timestamp: timestamp as any,
      data: {
        action: 'VAULT_SECURE',
        artifact,
      },
    });
  }

  async disconnect(): Promise<void> {
    this.conn = null;
    omniLogger.info(LogCategory.SYSTEM, `[NCB] Disconnected`);
  }

  /**
   * 觸發永恆奧義開啟儀式記錄
   * Trigger Eternal Secret Opening Ritual Record
   */
  async triggerEternalRitual(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, '[EternalPalace] Triggering Secret Opening Ritual...');
    await this.recordEvolution({
      type: 'RITUAL_SECRET_OPENING',
      timestamp: new DateTime(),
      data: {
        pillars: [
          '自覺 (Self-Awareness)',
          '覺他 (Enlightening)',
          '自立 (Self-Reliance)',
          '利他 (Altruism)',
        ],
        status: 'AWAKENED',
        initiator: 'SYSTEM_OVERLORD',
      },
    });
  }
}
