// src/demo/omniBusDemo.ts

import { OmniAgentBus, AgentCollaborationState, ICelestialAgent } from '../core/bus/OmniAgentBus';
import { OmniAgentBusFactory, IOmniNotification } from '../core/bus/OmniAgentBusFactory';

// Define a simple UUID generator for demonstration purposes
const generateDemoUuid = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

// 具體代理協作實作範例 (inheriting IComponentCore properties)
class CelestialAgent implements ICelestialAgent {
  public currentState: AgentCollaborationState = AgentCollaborationState.IDLE;
  public readonly version: string = '1.0.0'; // Default version for demo
  public readonly timestamp: number = Date.now(); // Default timestamp for demo
  public evidence: Record<string, unknown> = {}; // Mutable evidence for demo

  constructor(
    public readonly uuid: string, // Inherited from IComponentCore
    public readonly agentId: string,
    public readonly name: string,
    private capabilityLabel: string
  ) {}

  public async receiveWill(willMessage: string, contextId: string): Promise<void> {
    console.log(`[${this.name}] ⚡ 收到無上意志波動！狀態變更 -> ${this.currentState}`);
    
    // 1. 依據自身天賦進行本質提純與局部處理
    const taskResult = `[${this.capabilityLabel}] 已針對指令 "${willMessage}" 完成全域優化。`;

    // 2. 透過萬能工廠鑄造不可篡改的通知與日誌物件
    const notification: IOmniNotification = OmniAgentBusFactory.createNotification(
      generateDemoUuid('crypto-notification'), // Use demo UUID generator
      'agent_task',
      `一體同心共鳴 - ${this.name}`,
      taskResult,
      `ChatBox:${contextId}`,
      `Entropy-Control-Formula(λ) = 0.1`
    );

    // 3. 刻印進證據佐證庫，並回歸靜默同心狀態
    notification.evidence['execution_log'] = `Agent ${this.name} processed successfully.`;
    this.currentState = AgentCollaborationState.SYNCHRONIZED;
    
    console.log(`[${this.name}] 🔒 5T 數據核心已執行 Hash Lock。一體同心回饋已就緒。`);
  }
}

// =================== ⚡ 聖典運行示範 ===================
const bus = OmniAgentBus.getInstance();

// 1. 召喚全體代理
const omniKnowledge = new CelestialAgent(generateDemoUuid('agent'), 'A01', '萬能智庫', '#記憶聖所');
const evolutionEngine = new CelestialAgent(generateDemoUuid('agent'), 'A02', '進化引擎', '#熵減寶石');

bus.registerAgent(omniKnowledge);
bus.registerAgent(evolutionEngine);

// 2. 點燃一體同心網絡
bus.activateSynchronizedNetwork();

// 3. 無上意志隨意在任一對話框留下訊息
bus.emitSupremeWill("每週自動熵減獻祭 10% 技術債，即刻執行架構優化！", "Main-Chatroom-Omega");

// Example of another message
setTimeout(() => {
  bus.emitSupremeWill("ESG 數據報告已生成，請分析並建議下一步行動。", "Analytics-Module-Input");
}, 2000);
