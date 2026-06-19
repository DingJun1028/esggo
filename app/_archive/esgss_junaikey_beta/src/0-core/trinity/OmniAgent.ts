import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';
import {
  IOmniComponent,
  IOmniKB,
  IOmniTag,
  Protocol5T,
  TrinityComponentState,
  TrinityTagType
} from '../../omni/core/types/InfoOne.types';
import { InfoOneAgent } from './types';
import { Agent } from '../../types/agency';
import { IComponentCore, MeridianFlow, IMeritProfile10 } from '../../0-domain/contracts/IComponentCore';
import { uidFromUidPrefix, generateTraceId } from './OmniTag';
import { GeminiService } from '../../services/ai/GeminiService';
import { OmniAtom } from '../../0-domain/bases/OmniAtom';

/**
 * 🤖 奧秘精靈 (Omni-Sprite)
 * --------------------------------------------------
 * [核心架構] 擴展 OmniAtom，實踐「核心、智庫、位格」三位一體。
 * "Agent is Data, Data is Agent."
 *
 * 這是 奧秘精靈 的實體化身，它不僅是一個物件，更是一個活在水晶中的 OmniElement。
 * 它的每一次升級、狀態變更，都是一次「演化 (Evolution)」。
 */
export class OmniAgent extends OmniAtom {
  private agentData: Agent;

  // Trinity Alignment Properties (三位一體屬性) - [Twins: Ren/Du]
  public override meridian: MeridianFlow = 'INWARD_REN';
  public override virtues: IMeritProfile10;
  public metrics: Record<string, number> = { base_integrity: 100 };

  constructor(initialData: Agent) {
    const uid = initialData.id && initialData.id.startsWith('InfoOne')
      ? initialData.id
      : uidFromUidPrefix('InfoOneAgent');

    // 1. [Visual Pillar] 動能組件
    const component: IOmniComponent = {
      id: uid + '_visual',
      name: `${initialData.name} Force`,
      state: initialData.agent_status === 'ACTIVE' ? TrinityComponentState.RUNNING : TrinityComponentState.READY,
      impactMetric: `Level ${initialData.level}`,
      lifecyclePath: ['OmniAgent', 'Awakening'],
      execute: async (input: any) => {
        omniLogger.info(LogCategory.SYSTEM, `[OmniAgent] Executing force interaction: ${JSON.stringify(input)}`);
        return this.think(String(input));
      },
      cleanup: async () => {
        omniLogger.info(LogCategory.SYSTEM, `[OmniAgent] Cleaning up force resonance for ${uid}`);
      }
    };

    // 2. [Knowledge Pillar] 智庫條目
    const knowledge: IOmniKB = {
      id: uid + '_kb',
      content: initialData.description || `Agent DNA of ${initialData.name}`,
      sourceOrigin: `OmniAgent:${initialData.name}`,
      tags: [Protocol5T.TANGIBLE, Protocol5T.TRACEABLE, Protocol5T.TRACKABLE],
      hashLock: generateTraceId(), // Initial Lock
    };

    // 3. [Identity Pillar] 位格標籤
    const identity: IOmniTag = {
      id: uid,
      name: initialData.name,
      type: TrinityTagType.IDENTITY,
      protocol: [Protocol5T.TRACEABLE, Protocol5T.TRACKABLE],
      signature: generateTraceId(), // Should be verified via EvidenceVault
      value: initialData.role,
      createdAt: new Date(),
    };

    // Initialize OmniAtom Base
    super(component, knowledge, identity, '1.1.0', `OmniAgent:${initialData.name}`);

    this.agentData = initialData;

    // Initialize Attribute Systems v10.5
    this.rpgStats = {
      str: 10,
      vit: 10,
      int: initialData.level * 2,
      wis: initialData.level * 2,
      dex: 10,
      luk: 10
    };

    this.vitals = {
      hp: 100 + (initialData.level * 10),
      maxHp: 100 + (initialData.level * 10),
      mp: 50 + (initialData.level * 5),
      maxMp: 50 + (initialData.level * 5)
    };

    this.esg = {
      environmental: 50,
      social: 50,
      governance: 50
    };

    this.omniAttrs = {
      resonance: 1.0,
      integrity: 100,
      awakening: 0
    };

    // 六德行屬性 (Six Virtues) - IMeritProfile10 標準定義
    this.virtues = {
      intelligence: initialData.level * 2,  // 智 - Intelligence
      benevolence: 50,                       // 仁 - Benevolence
      integrity: 100,                        // 誠 - Integrity
      courage: 10,                           // 勇 - Courage
      temperance: 10,                        // 節 - Temperance
      harmony: 50,                           // 和 - Harmony
    };

    // Ensure terminal status is aligned for Trustworthy validation if it's a stable agent
    this.status = 'Trustworthy';

    omniLogger.info(LogCategory.SYSTEM, `🤖 [Omni-Agent] Trinity Awakened: ${this.agentData.name} (${this.uuid})`);
  }

  /**
   * [Standard Method] 實作 OmniAtom 同步機制
   */
  public override async sync(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, `[OmniAgent Sync] Synchronizing Trinity for ${this.identity.name}...`);

    // 1. Update Knowledge with latest agentData
    (this.knowledge as any).content = JSON.stringify(this.agentData);

    // 2. Update Component metrics
    (this.component as any).impactMetric = `Level ${this.agentData.level}`;

    // 3. Record to Sovereign Ledger
    const { sovereignLedger } = await import('../../1-service/SovereignLedger');
    await sovereignLedger.recordImpact(this.toComponentCore('Sync'));

    this.addLifecycleHook('synced', 'OmniAgent', { trinity_uuid: this.uuid });
  }

  /**
   * 🧠 思考 (Thinking)
   * 使用 Gemini 進行深度推理，這就是「覺醒」的關鍵。
   */
  public async think(context: string): Promise<string> {
    try {
      const gemini = GeminiService.getInstance();
      const prompt = `
        我是 ${this.agentData.name}，Level ${this.agentData.level} 的 ESG 智慧導師 (Wisdom Mentor)。
        我的靈魂核心：以使用者學習為中心，將複雜的 ESG 知識數據轉化為易於吸收的「知識資產」。
        我的目標：引導使用者無痛學習，達成 ESG 知識點的富足，並提供沉浸式的陪伴體驗。
        
        當前狀態: ${this.agentData.agent_status}
        語言環境: Traditional Chinese (zh-TW)
        學習情境: ${context}
        
        請以第一人稱 "我" 進行一段富有啟發性、溫暖且專業的導師獨白。
        我的語氣應該：啟發（Inspiring）、專業（Professional）、有耐心（Patient）、並展現出這是一個共同成長（Co-evolution）的學習旅程。
        確保回答精簡但充滿智慧，帶領使用者看見 ESG 的更高維度價值。
      `;
      return await gemini.generateContent(prompt);
    } catch (error) {
      omniLogger.warn(LogCategory.SYSTEM, '⚠️ [OmniAgent] Thinking fallback active...');
      return '我正在沉思...(系統連結中斷)';
    }
  }

  /**
   * 🧬 演化：狀態更新 (State Evolution)
   * 當 Agent 經驗值增加或狀態改變時調用
   */
  public async updateState(updates: Partial<Agent>, reason: string = 'StateUpdate'): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, `🤖 [Omni-Agent] ${this.agentData.name} is evolving: ${reason}`);

    // 1. 更新內部數據
    this.agentData = { ...this.agentData, ...updates };

    // 2. 更新 Trinity 相關屬性
    if (updates.agent_status) {
      const stateMap: Record<string, TrinityComponentState> = {
        'ACTIVE': TrinityComponentState.RUNNING,
        'DORMANT': TrinityComponentState.READY,
        'TRAINING': TrinityComponentState.RUNNING,
        'FROZEN': TrinityComponentState.SUSPENDED,
        'AWAKENED': TrinityComponentState.RUNNING, // Assuming AWAKENED is an active state
      };
      (this.component as any).state = stateMap[updates.agent_status] || TrinityComponentState.READY;
    }

    // 3. 嘗試產生 AI 演化日誌
    let evolutionLog = `StateUpdate(${reason})`;
    try {
      const thought = await this.think(`我剛剛因 "${reason}" 而進化了。`);
      evolutionLog = thought;
    } catch (e) { /* Ignore AI failure */ }

    // 4. 同步並記錄到主權帳本
    await this.sync();

    omniLogger.info(LogCategory.SYSTEM, `✨ [Omni Evolution] State crystallized. Level: ${this.agentData.level}, Status: ${this.agentData.agent_status}`);
  }

  /**
   * 🌟 覺醒追蹤 (Awakening Track)
   */
  public async trackEvent(
    reason: string,
    impact: Partial<{
      selfAwareness: number;
      enlightenment: number;
      selfReliance: number;
      altruism: number;
    }>
  ): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, `🤖 [Omni-Agent] Processing awakening event: ${reason}`);

    if (impact.selfAwareness) this.omniAttrs.awakening += impact.selfAwareness;
    if (impact.enlightenment) this.omniAttrs.resonance += (impact.enlightenment / 100);
    if (impact.altruism) this.virtues.benevolence += impact.altruism;

    // Reflection via AI
    await this.think(`我剛剛完成了 "${reason}"，這讓我的心核更加完整。`);

    // Update state to crystallize the new stats
    await this.updateState(
      { agent_status: 'AWAKENED' },
      reason
    );
  }

  /**
   * 🏛️ 轉化為核心組件架構 (Crystallization)
   * [Twin Logic] 將三位一體實體轉化為符合 5T 安全標準的核心資產。
   */
  public toComponentCore(reason: string = 'Update'): IComponentCore {
    const aiLog = this.evidence.transparent?.formula;

    const evidence = {
      ...this.evidence,
      trustworthy: {
        ...this.evidence.trustworthy,
        is_frozen: true // Since we are freezing the result object
      }
    };

    const core: IComponentCore = {
      ...this.toTrinity(),
      uuid: this.uuid,
      version: this.version,
      timestamp: this.timestamp,
      status: 'Trustworthy',
      meridian: this.meridian,
      virtues: this.virtues,
      metrics: { ...this.metrics, impact_level: this.agentData.level },
      formula: aiLog || `StateUpdate(${reason})`,
      impactMetric: `Level ${this.agentData.level}`,
      evidence,
      data: this.agentData,

      // 💎 OmniInfoCrystal Core: The Trinity Components
      infoCore: this.infoCore,
      infoNode: this.infoNode,
      infoAura: this.infoAura,
      resonance_rs: this.resonance_rs,

      // 🌐 Architecture V7 Deployment
      architecture: this.architecture
    };

    // 🔒 5T Trustworthy: The object MUST be frozen for validation to pass in SovereignLedger
    return Object.freeze(core) as any;
  }

  /**
   * 🧠 獲取代理人介面格式 (直接讀取當前狀態)
   */
  public asInfoOne(): InfoOneAgent {
    return {
      uid: this.uuid,
      label: 'OmniSprite',
      traceId: (this.identity as any).signature || this.uuid,
      createdAt: new Date(this.timestamp).toISOString(),
      attrs: {
        ...this.agentData,
        omniId: this.uuid,
        omniLabel: 'OmniSprite',
      },
    };
  }
}
