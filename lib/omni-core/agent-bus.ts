/**
 * OmniAgentBus (萬能代理總線)
 * 作為所有 OmniAgents (Antigravity, Jules, Nexus, Pencil) 溝通的中樞。
 */

import { meceEngine, OmniMECEKey } from './omni-mece-engine';

export type AgentEvent = 'HEAL' | 'DESTRUCT' | 'STRATEGIZE' | 'EXECUTE' | 'OBSERVE';

export interface BusMessage {
  id: string;
  type: AgentEvent;
  source: string;
  payload: any;
  timestamp: number;
}

type Subscriber = (message: BusMessage) => void;

class OmniAgentBus {
  private static instance: OmniAgentBus;
  private subscribers: Map<AgentEvent, Subscriber[]> = new Map();
  private vpsEndpoint: string | null = null;
  private localEndpoint: string | null = null;
  private isBoundToVPS: boolean = false;

  private constructor() {}

  public static getInstance(): OmniAgentBus {
    if (!OmniAgentBus.instance) {
      OmniAgentBus.instance = new OmniAgentBus();
    }
    return OmniAgentBus.instance;
  }

  public subscribe(event: AgentEvent, callback: Subscriber) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)?.push(callback);
  }

  /**
   * 萬能元件心核：雙向綁定 (Bidirectional Binding)
   * 將心核的一端釘死在 VPS，另一端點釘死在 Local IP，建立完整的終始矩陣 (End-to-Start Matrix)
   */
  public bindToVPS(vpsIpAddress: string, localIpAddress: string = '127.0.0.1', vpsPort: number = 8642, localPort: number = 3001) {
    this.vpsEndpoint = `http://${vpsIpAddress}:${vpsPort}`;
    this.localEndpoint = `http://${localIpAddress}:${localPort}`;
    this.isBoundToVPS = true;
    
    console.log(`[OmniAgentBus] 🌐 萬能元件心核已雙向綁定 (Bidirectional Matrix Sync)`);
    console.log(`                 [終] VPS 節點: ${this.vpsEndpoint}`);
    console.log(`                 [始] Local 節點: ${this.localEndpoint}`);
    
    // 觸發全域廣播，宣佈雙向綁定完成
    this.publish('OBSERVE', 'OmniAgentBus', { 
      message: 'MATRIX_BIDIRECTIONAL_BOUND', 
      vpsEndpoint: this.vpsEndpoint,
      localEndpoint: this.localEndpoint 
    });
  }

  /**
   * 解綁雙向連線
   */
  public unbindVPS() {
    console.log(`[OmniAgentBus] 🛑 已解除萬能元件心核的雙向綁定 ([終] ${this.vpsEndpoint} ↔ [始] ${this.localEndpoint})`);
    this.vpsEndpoint = null;
    this.localEndpoint = null;
    this.isBoundToVPS = false;
  }

  public publish(event: AgentEvent, source: string, payload: any) {
    const message: BusMessage = {
      id: crypto.randomUUID(),
      type: event,
      source,
      payload,
      timestamp: Date.now(),
    };
    
    console.log(`[OmniAgentBus] 📡 廣播事件 [${event}] from ${source}`);
    
    // 如果已綁定 VPS，非同步將事件推送至遠端網關進行迭代成長
    if (this.isBoundToVPS && this.vpsEndpoint && source !== 'VPS_Gateway') {
      this.syncWithVPS(message);
    }
    
    // 自動 MECE 審核橋接 (無限循環、同體一心)
    let appliedPrinciples: OmniMECEKey[] = ['infinite', 'synergy'];
    if (event === 'HEAL') appliedPrinciples.push('order2chaos', 'sustain');
    if (event === 'STRATEGIZE') appliedPrinciples.push('innovate', 'optimize');
    if (event === 'EXECUTE') appliedPrinciples.push('seamless', 'bridge');
    if (event === 'OBSERVE') appliedPrinciples.push('unify', 'codex');
    
    meceEngine.checkAndRecord(`AgentBus [${event}] from ${source}`, payload, appliedPrinciples);

    
    const subs = this.subscribers.get(event) || [];
    subs.forEach(sub => {
      try {
        sub(message);
      } catch (e) {
        console.error(`[OmniAgentBus] ⚠️ 訂閱者處理異常:`, e);
      }
    });
  }

  private async syncWithVPS(message: BusMessage) {
    if (!this.vpsEndpoint) return;
    try {
      await fetch(`${this.vpsEndpoint}/api/sync/bus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      }).catch(() => { /* 靜默失敗，不阻塞本地執行 */ });
    } catch (e) {
      // Ignore sync errors
    }
  }
}

export const omniAgentBus = OmniAgentBus.getInstance();
