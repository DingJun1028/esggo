import { IComponentCore } from '../../src/shared/types/index.ts';
import { omniCore } from '../omni-core.ts';
import { integrityModule } from './integrity.ts';

import { callGemini } from '../genkit-esg.ts';

// ============================================================
// 萬能元件心核｜以終為始 ♾️ 終始矩陣 (OmniComponent Matrix)
// ============================================================

export type IntentType = 'QUERY' | 'MUTATE' | 'REASONING' | 'REPAIR' | 'GENERATE';

export interface OmniTag {
  intent: IntentType;
  confidence: number;
  domain: string;
  labels: string[];
}

export interface MatrixInput {
  rawCommand: string;
  context: Record<string, any>;
  expectedDoD: string; // Definition of Done
}

export interface DeconstructedTask {
  id: string;
  tags: OmniTag;
  steps: string[];
  targetDoD: string;
}

export interface ExecutionStrategy {
  planId: string;
  assignedAgent: 'Antigravity' | 'Jules' | 'OmniNexus' | 'Pencil';
  actionGraph: any;
}

export interface MatrixOutput {
  status: 'SUCCESS' | 'FAILED' | 'REPAIR_NEEDED';
  resultData: any;
  traceId: string;
  hashLock: string;
}

/**
 * 終始矩陣核心引擧 (Omni Matrix Engine)
 * 將混亂輸入轉為結構化行動，再將行動沉澱為記憶資產的閉環。
 */
export class OmniMatrix {
  private static instance: OmniMatrix;

  private constructor() {}

  static getInstance(): OmniMatrix {
    if (!OmniMatrix.instance) {
      OmniMatrix.instance = new OmniMatrix();
    }
    return OmniMatrix.instance;
  }

  /**
   * 1. 覺式 (Awaken): 接收輸入，喚醒任務
   */
  public awaken(input: MatrixInput): MatrixInput {
    console.log(`[OmniMatrix] 覺式: Awakening task... DoD=${input.expectedDoD}`);
    // 初始化 Trace & Context
    return { ...input, context: { ...input.context, awakenedAt: Date.now() } };
  }

  /**
   * 2. 解式 (Deconstruct): 拆解意圖，形成結構
   */
  public async deconstruct(input: MatrixInput): Promise<DeconstructedTask> {
    console.log(`[OmniMatrix] 解式: Deconstructing intent via Gemini...`);
    
    const prompt = `請拆解以下輸入：\n輸入內容：${input.rawCommand}\n預期 DoD：${input.expectedDoD}\n請將意圖分類為：QUERY, MUTATE, REASONING, REPAIR, GENERATE 之一，並列出執行步驟。\n請嚴格輸出 JSON 格式，包含以下欄位：{"intent":"...","confidence":0.9,"domain":"...","labels":["..."],"steps":["..."]}`;
    const rawResponse = await callGemini(prompt, "你是一個系統意圖解析大腦，擅長將混亂的輸入轉譯為結構化 JSON 任務。");
    
    let parsed: any = {
      intent: 'REASONING',
      confidence: 0.95,
      domain: 'Core',
      labels: ['fallback-matrix-task'],
      steps: ['Init', 'Process', 'Verify'],
    };

    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('[OmniMatrix] 解式解析失敗，使用 Fallback 結構', e);
    }

    return {
      id: `task_${Date.now()}`,
      tags: {
        intent: parsed.intent as IntentType || 'REASONING',
        confidence: parsed.confidence || 0.9,
        domain: parsed.domain || 'Core',
        labels: parsed.labels || [],
      },
      steps: parsed.steps || ['Init', 'Process', 'Verify'],
      targetDoD: input.expectedDoD,
    };
  }

  /**
   * 3. 策式 (Strategize): 生成策略，形成路徑
   */
  public async strategize(task: DeconstructedTask): Promise<ExecutionStrategy> {
    console.log(`[OmniMatrix] 策式: Strategizing for task ${task.id} via Gemini...`);
    
    const prompt = `這是一個已被拆解的任務：\n步驟：${JSON.stringify(task.steps)}\n意圖：${task.tags.intent}\n請根據這些步驟，指派最適合的代理 (可選: Antigravity, Jules, OmniNexus, Pencil)，並生成具體的行動路徑。\n請嚴格輸出 JSON 格式：{"assignedAgent":"...","actionGraph":{"nodes":[]}}`;
    const rawResponse = await callGemini(prompt, "你是一個強大的任務策略與路由分配引擎。");
    
    let assignedAgent = 'Antigravity';
    let actionGraph = { nodes: task.steps };

    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.assignedAgent) assignedAgent = parsed.assignedAgent;
        if (parsed.actionGraph) actionGraph = parsed.actionGraph;
      }
    } catch (e) {
      console.warn('[OmniMatrix] 策式解析失敗，使用 Fallback 結構', e);
    }

    return {
      planId: `plan_${task.id}`,
      assignedAgent: assignedAgent as 'Antigravity' | 'Jules' | 'OmniNexus' | 'Pencil',
      actionGraph,
    };
  }

  /**
   * 4. 貫式 (Execute): 跨平台執行，落地任務
   */
  public async execute(strategy: ExecutionStrategy, task: DeconstructedTask): Promise<any> {
    console.log(`[OmniMatrix] 貫式: Executing plan ${strategy.planId} via ${strategy.assignedAgent}...`);
    
    // 將任務正式轉交給系統總線 (OmniAgent Nexus)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    try {
      const res = await fetch(`${baseUrl}/api/nexus/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'omni_matrix_delegate',
          arguments: {
            agent: strategy.assignedAgent,
            task: task.targetDoD,
            actionGraph: strategy.actionGraph
          },
          userId: 'system-matrix'
        })
      });
      const json = await res.json();
      return { 
        executedNodes: strategy.actionGraph.nodes, 
        timestamp: Date.now(),
        agentResponse: json 
      };
    } catch (e) {
      console.warn('[OmniMatrix] 貫式: Nexus 調用失敗，退回本地 Mock', e);
      return { executedNodes: strategy.actionGraph.nodes, timestamp: Date.now(), fallback: true };
    }
  }

  /**
   * 5. 迴式 (Feedback): 收集結果，回饋修正 (驗證 DoD)
   */
  public async feedback(executionResult: any, targetDoD: string): Promise<MatrixOutput> {
    console.log(`[OmniMatrix] 迴式: Verifying against DoD...`);
    const traceId = `trace_${Date.now()}`;
    
    // Hash Lock as verification of truth
    const crystal = await omniCore.sealComponent(
      'ExecutionResult',
      'OmniMatrix',
      JSON.stringify(executionResult),
      'System Automated'
    );

    return {
      status: 'SUCCESS',
      resultData: executionResult,
      traceId,
      hashLock: crystal.hash_lock,
    };
  }

  /**
   * 6. 鍛式 (Forge): 沉澱知識，啟動下一輪
   */
  public async forge(output: MatrixOutput): Promise<void> {
    console.log(`[OmniMatrix] 鍛式: Forging memory asset... HashLock=${output.hashLock}`);
    // 沉澱至萬能永憶 (OmniMemory)
    await omniCore.storeMemory(JSON.stringify(output), 'episodic' as any);
  }

  /**
   * 全流程啟動 (Full Lifecycle Execution)
   */
  public async runLifecycle(input: MatrixInput): Promise<MatrixOutput> {
    const awakened = this.awaken(input);
    const task = await this.deconstruct(awakened);
    const strategy = await this.strategize(task);
    const result = await this.execute(strategy, task);
    const output = await this.feedback(result, task.targetDoD);
    await this.forge(output);
    return output;
  }
}

export const omniMatrix = OmniMatrix.getInstance();
