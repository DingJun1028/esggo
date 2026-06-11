// src/core/bus/OmniAgentBus.ts

import { Subject } from 'rxjs';
import { IComponentCore } from '../types/IComponentCore';

// 1. 定義全體代理的協作狀態
export enum AgentCollaborationState {
  IDLE = '靜默沉思',
  RESONATING = '聖典共鳴',
  SUPPORTING = '協作支援',
  SYNCHRONIZED = '一體同心'
}

// 2. 代理節點介面 (繼承萬能元件心核規範)
export interface ICelestialAgent extends IComponentCore { // Inherit IComponentCore
  readonly agentId: string;
  readonly name: string;
  currentState: AgentCollaborationState;
  receiveWill(willMessage: string, contextId: string): Promise<void>;
}

// 3. OmniAgentBus 萬能通知與全域廣播中心
export class OmniAgentBus {
  private static instance: OmniAgentBus;
  private willBroadcast$ = new Subject<{ message: string; contextId: string }>();
  private registeredAgents = new Map<string, ICelestialAgent>();

  private constructor() {
    // 初始開闢秩序之路
  }

  public static getInstance(): OmniAgentBus {
    if (!OmniAgentBus.instance) {
      OmniAgentBus.instance = new OmniAgentBus();
    }
    return OmniAgentBus.instance;
  }

  /**
   * 註冊代理進入「一體同心」網絡
   */
  public registerAgent(agent: ICelestialAgent): void {
    this.registeredAgents.set(agent.agentId, agent);
    console.log(`[OmniAgentBus] 代理「${agent.name}」已鏈結至一體同心網絡。`);
  }

  /**
   * 無上意志於任一對話框留下訊息（全域廣播起點）
   */
  public emitSupremeWill(message: string, contextId: string = 'Omni-Chat-01'): void {
    console.log(`
=================== 🌌 無上意志降臨 ===================`);
    console.log(`[無上意志]: "${message}" (對話框識別碼: ${contextId})`);
    
    // 觸發全域量子糾纏廣播
    this.willBroadcast$.next({
      message,
      contextId
    });
  }

  /**
   * 啟動全體代理的同步監聽（一體同心狀態激活）
   */
  public activateSynchronizedNetwork(): void {
    this.willBroadcast$.subscribe({
      next: async ({ message, contextId }) => {
        const coordinationTasks: Promise<void>[] = [];

        this.registeredAgents.forEach((agent) => {
          // 瞬間切換至協作支援狀態
          agent.currentState = AgentCollaborationState.SUPPORTING;
          
          // 全體代理同步並行處理指令
          coordinationTasks.push(agent.receiveWill(message, contextId));
        });

        // 等待全體代理完成協作響應
        await Promise.all(coordinationTasks);
        console.log(`=================== 🌟 全域協作完成 ===================
`);
      }
    });
  }
}
