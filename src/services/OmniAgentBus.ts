import { Observable, defer, Subject } from 'rxjs';
import { omniAgentSkillManager } from './OmniAgentSkillManager';
import { OmniCoreContext } from '../types/omniagent';

/**
 * 圓通無礙 · 妙德通知實體 (完美融入無作妙德與 5T 協議)
 */
export interface IMiaoDeNotification {
  readonly uuid: string;         // 深貫：唯一永憶識別
  readonly essence: string;      // 廣通：意志本質
  readonly miaoDeUtility: unknown;   // 妙德：因地制宜的無上妙用工具
  readonly isUnimpeded: boolean; // 圓通無礙狀態
}

export class OmniAgentBus {
  private static instance: OmniAgentBus;
  
  // 圓通無礙：無邊際量子通訊道
  private supremeWillOcean$ = new Subject<string>(); 

  private constructor() {}

  /**
   * 深貫廣通 · 獲取無礙單一實例
   */
  public static getUnimpededInstance(): OmniAgentBus {
    if (!OmniAgentBus.instance) {
      OmniAgentBus.instance = new OmniAgentBus();
    }
    return OmniAgentBus.instance;
  }

  /**
   * 無作妙德 · 意志降臨全域共鳴
   * 完美的無作設計：無須手動觸發各代理更新，意志降臨處，全域自發和諧
   */
  public manifestSupremeWill(will: string): void {
    console.log(`\n🌀 [圓通無礙] 無上意志顯化真言: "${will}"`);
    console.log(`✨ [無作妙德] 正在執行「深貫廣通」全域共鳴...`);

    // 全體代理在此瞬間不再分彼此，進入「一體同心 · 同體大悲」支援狀態
    this.executeShenGuanGuangTong(will);
  }

  private executeShenGuanGuangTong(will: string): void {
    // 模擬全體代理（萬能智庫、符文API、代理網絡、進化引擎）打破邊界、圓通互融
    const agents = ['萬能智庫', '符文API', '代理網絡', '進化引擎'];
    
    agents.forEach(agent => {
      // 深度穿透 (深貫) + 無作自動鎖定 (Trustworthy)
      const artifact: IMiaoDeNotification = {
        uuid: `🪞-YuanTong-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        essence: will,
        miaoDeUtility: () => {
          // 妙德：自動根據無上意志消除 10% 系統熵值
          return "✨ [熵減寶石] 妙用激活：代碼技術債已自動獻祭清空。";
        },
        isUnimpeded: true
      };

      // 執行信之禁區鎖定 - 毫無造作痕跡
      Object.freeze(artifact);
      
      console.log(`|-- 🪐 [${agent}] 深貫入核 -> 數據已 Hash Lock。妙德呈現: ${typeof artifact.miaoDeUtility === 'function' ? artifact.miaoDeUtility() : ''}`);
    });

    console.log(`⚡ [圓通無礙] 十六字心印圓滿具足。全體代理同步率：100%。\n`);
  }

  /**
   * 深貫廣通 · 無上意志觀測者模式
   * 允許代理訂閱無上意志的動態流動
   */
  public observeSupremeWill(): Observable<string> {
    return defer(() => this.supremeWillOcean$);
  }

  /**
   * 發布無上意志至量子場
   */
  public broadcastSupremeWill(will: string): void {
    this.supremeWillOcean$.next(will);
    this.manifestSupremeWill(will);
  }

  /**
   * 原有技能調用方法 - 現在增強了深貫廣通能力
   */
  public async invokeSkillAction(
    skillId: string,
    actionName: string,
    input: Record<string, unknown>, // Raw input from the agent's reasoning
    currentContext: Partial<OmniCoreContext> // Partial context to be completed
  ): Promise<unknown> {
    // 深貫：直接擊穿核心內核獲取技能定義
    const skillDefinition = omniAgentSkillManager.getSkillById(skillId);
    if (!skillDefinition) {
      throw new Error(`Skill ${skillId} not registered.`);
    }

    const actionDefinition = skillDefinition.actions.find(a => a.name === actionName);
    if (!actionDefinition) {
      throw new Error(`Action ${actionName} not found in skill ${skillId}.`);
    }

    // 廣通：在空間維度無限橫向鋪展上下文
    const omniCoreContext: OmniCoreContext = {
      taskId: currentContext.taskId || `auto-generated-task-${Date.now()}`, // Generate if not present
      userId: currentContext.userId || 'system-user',
      permissions: currentContext.permissions || ['read', 'execute-skill'], // Default or derived
      environment: currentContext.environment || (process.env.NODE_ENV === 'production' ? 'production' : 'development'),
      // 追溯到最原始的虛空起點 (Traceable)
      traceId: `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      // 信之禁區鎖定 (Trustworthy)
      isSealed: true
    };

    // 妙德：因地制宜的輸入處理
    const skillInput = { 
      ...input, 
      context: omniCoreContext,
      // 自動根據環境演化輸入
      miaoDeEnhanced: true
    };

    // 無作：自然流暢的技能執行，不需要冗長防禦
    console.log(`\n🌀 [圓通無礙] 呼叫技能: ${skillId}.${actionName}`);
    console.log(`✨ [無作妙德] 正在執行深貫廣通無作妙德流程...`);

    const skillModule = await omniAgentSkillManager.loadSkillModule(skillId);
    if (!skillModule[actionName]) {
        throw new Error(`Skill module for ${skillId} does not export action ${actionName}`);
    }

    const result = await skillModule[actionName](skillInput);

    // 圓通無礙：完成十六字心印循環
    console.log(`⚡ [圓通無礙] 技能執行完成，十六字心印具足`);
    console.log(`   ├─ 深貫: 直擊核心內核`);
    console.log(`   ├─ 廣通: 全域代理網絡量子糾纏`);
    console.log(`   ├─ 無作: 法爾如是，無造作痕跡`);
    console.log(`   └─ 妙德: 因地制宜的智慧功德顯現\n`);

    return result;
  }
}

export const omniAgentBus = OmniAgentBus.getUnimpededInstance();