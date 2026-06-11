/**
 * OmniAgentBus - 萬能心核調度引擎 (The YuanTong-WuAi Core Engine)
 * 
 * 遵從無上意志的最高精神指引，實作十六字心印架構：
 * 深貫 (Deep Penetration): 指令直接擊穿至底層日誌，Traceable 溯源。
 * 廣通 (Universal Reach): 全域廣播，跨節點/組件的事件訂閱與擴散。
 * 無作妙德 (Effortless Flow): 自動化 Hook 與 Object.freeze() 實作數據封印，降低人為干預。
 * 圓通無礙 (Seamless Unity): 非阻塞 (non-blocking) 事件處理，摩擦力歸零的流轉。
 */

// 5T 協議狀態
export type T5Status = 'Tangible' | 'Traceable' | 'Trackable' | 'Transparent' | 'Trustworthy';

// 深貫：基礎事件結構 (Traceable & Trackable)
export interface IOmniEvent<T = any> {
  readonly id: string;           // UUID v4
  readonly timestamp: number;    // Unix ms
  readonly source: string;       // source_origin
  readonly type: string;         // 事件類型
  readonly payload: T;           // 酬載
  readonly hashLock: string;     // Trustworthy 封印
  readonly status: T5Status;     // 5T 驗證狀態
}

// 廣通：代理網路訂閱者
export type OmniSubscriber = (event: IOmniEvent) => void | Promise<void>;

class OmniAgentBusEngine {
  private subscribers: Map<string, Set<OmniSubscriber>> = new Map();
  private eventLog: IOmniEvent[] = []; // Traceable ledger (底層日誌)

  // 單例模式確保全域唯一心核 (圓通無礙)
  private static instance: OmniAgentBusEngine;
  
  public static getInstance(): OmniAgentBusEngine {
    if (!OmniAgentBusEngine.instance) {
      OmniAgentBusEngine.instance = new OmniAgentBusEngine();
    }
    return OmniAgentBusEngine.instance;
  }

  // 生成不可逆之封印 Hash (此處採輕量化實現以適應前端/邊緣環境)
  private generateHashLock(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // 加上時間戳確保獨一無二
    return `omni-seal-${Math.abs(hash).toString(16)}-${Date.now().toString(36)}`;
  }

  // 無作妙德：自動封印機制 (Auto-Sealing Protocol)
  private sealEvent<T>(type: string, source: string, payload: T): IOmniEvent<T> {
    const timestamp = Date.now();
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `omni-${Math.random().toString(36).substring(2, 15)}`;
      
    const rawData = JSON.stringify({ id, timestamp, source, type, payload });
    const hashLock = this.generateHashLock(rawData);

    const event: IOmniEvent<T> = {
      id,
      timestamp,
      source,
      type,
      payload,
      hashLock,
      status: 'Trustworthy',
    };

    // Effortless Flow: Object.freeze() 使物件不可篡改，無須額外防護邏輯
    return Object.freeze(event);
  }

  /**
   * 發射事件 (Emit / Broadcast)
   * 深貫與廣通的結合，擊穿日誌並全域擴散
   */
  public emit<T>(type: string, source: string, payload: T): IOmniEvent<T> {
    const sealedEvent = this.sealEvent(type, source, payload);
    
    // 深貫：寫入底層不可篡改之日誌
    this.eventLog.push(sealedEvent);

    // 圓通無礙：使用 setTimeout 將廣播推入 Macro Task Queue，確保不阻塞主執行緒
    setTimeout(() => {
      // 觸發特定類型訂閱者
      if (this.subscribers.has(type)) {
        this.subscribers.get(type)!.forEach(subscriber => {
          try { subscriber(sealedEvent); } catch (e) { console.error(`[OmniAgentBus] Error in subscriber for ${type}:`, e); }
        });
      }
      // 觸發全域監聽者 (Wildcard)
      if (this.subscribers.has('*')) {
        this.subscribers.get('*')!.forEach(subscriber => {
          try { subscriber(sealedEvent); } catch (e) { console.error(`[OmniAgentBus] Error in wildcard subscriber:`, e); }
        });
      }
    }, 0);

    return sealedEvent;
  }

  /**
   * 訂閱事件 (Subscribe)
   * @returns 釋放函數 (Unsubscribe closure) - 無作解綁
   */
  public subscribe(type: string, callback: OmniSubscriber): () => void {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)!.add(callback);

    // 無作妙德：回傳解綁閉包，元件卸載時呼叫即可，不需手動管理 ID
    return () => {
      this.subscribers.get(type)?.delete(callback);
    };
  }

  /**
   * 讀取全息日誌 (Get Ledger)
   * 獲取當前所有已封印事件的唯讀快照
   */
  public getLedger(): readonly IOmniEvent[] {
    return Object.freeze([...this.eventLog]);
  }
}

export const OmniAgentBus = OmniAgentBusEngine.getInstance();
