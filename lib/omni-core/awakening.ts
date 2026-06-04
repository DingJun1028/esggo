/**
 * OmniAgent Awakening Talent (萬能智庫·神經共享)
 * 全域神經同步機制：一點習得，全網賦能。
 * 遵循 5T 協議 (Transferful: 生命週期即時追蹤與可追蹤性)
 */

import { omniAgentBus, OmniSkill } from '../agents/omni-agent-bus.ts';
import { v4 as uuidv4 } from 'uuid';

export interface IOmniAgentAwakening {
  readonly uuid: string; // 萬能永憶主體唯一識別碼
  
  // 核心天賦：技術同步
  syncAbility(skill: OmniSkill): Promise<void>;
  
  // 核心天賦：動態庫管理
  skillLibrary: Map<string, OmniSkill>;
  toggleSkill(skillId: string, state: 'loaded' | 'unloaded'): void;
}

export class OmniAgentAwakening implements IOmniAgentAwakening {
  public readonly uuid: string;
  public skillLibrary = new Map<string, OmniSkill>();

  constructor() {
    this.uuid = uuidv4();
    console.log(`[覺醒天賦] OmniAgent 萬能智庫·神經共享已啟動 (UUID: ${this.uuid})`);
    this.registerHooks();
  }

  private registerHooks() {
    // 監聽任意代理習得新技能的事件廣播
    omniAgentBus.subscribe('agent:skill:learned', async (payload: any) => {
      const newSkill = payload.skill as OmniSkill;
      if (!newSkill) return;
      await this.onOtherAgentLearned(newSkill);
    });
  }

  // 核心天賦：技術同步
  public async syncAbility(skill: OmniSkill): Promise<void> {
    // 發布廣播，觸發神經共享擴散 (Diffusion)
    await omniAgentBus.publish('agent:skill:learned', { skill, timestamp: new Date().toISOString() });
  }

  // 當任意代理習得技能時，觸發此 Hook
  public async onOtherAgentLearned(newSkill: OmniSkill) {
    // 實作數據同步，確保全局一致性
    if (!this.skillLibrary.has(newSkill.id)) {
      this.skillLibrary.set(newSkill.id, newSkill);
      // 動態將新技能註冊至總線 (Dynamic Loading)
      omniAgentBus.registerSkill(newSkill);
      console.log(`[覺醒天賦] 技能共享同步成功: ${newSkill.name} (${newSkill.id})`);
    }
  }

  // 決定加載或卸除 (Runtime Optimization / Access Control)
  public toggleSkill(skillId: string, state: 'loaded' | 'unloaded'): void {
    const skill = this.skillLibrary.get(skillId);
    if (skill) {
      if (state === 'loaded') {
        omniAgentBus.registerSkill(skill);
        console.log(`[覺醒天賦] 動態加載技能: ${skill.name}`);
      } else {
        omniAgentBus.unregisterSkill(skillId);
        console.log(`[覺醒天賦] 卸載技能以優化資源: ${skill.name}`);
      }
      
      // 紀錄 5T Transferful 軌跡
      omniAgentBus.publish('agent:skill:toggled', { 
        skillId, 
        state, 
        timestamp: new Date().toISOString() 
      });
    } else {
      console.warn(`[覺醒天賦] 找不到指定技能: ${skillId}`);
    }
  }
}

export const omniAgentAwakening = new OmniAgentAwakening();
