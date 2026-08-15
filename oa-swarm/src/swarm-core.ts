/**
 * 萬能蜂群調度核心 (Swarm Orchestrator)
 * 實作: 靈魂執行鏈 (§三) — 本質提純 → 蜂群協同 → 5T 驗算與 Hash Lock
 * 背景模式: 熵減循環 + SSE 串流 + HTTP API
 */
import { purify, verifyZeroHallucination, FeedbackCollector, SoulArtifact } from './protocol-5t.js';
import { SOUL_MATRIX, SoulAgent } from './soul-matrix.js';
import { callLLM } from './llm.js';

export interface SwarmState {
  entropy: number;       // 熵值 (目標 < 0.1)
  tasksDone: number;
  lastPurified: SoulArtifact | null;
  agents: SoulAgent[];
  startedAt: number;
  uptimeSec: number;
}

export class SwarmCore {
  private entropy = 0.08;
  private tasksDone = 0;
  private lastPurified: SoulArtifact | null = null;
  private feedback = new FeedbackCollector();
  private startedAt = Date.now();
  private listeners = new Set<(s: SwarmState) => void>();

  getState(): SwarmState {
    return {
      entropy: this.entropy,
      tasksDone: this.tasksDone,
      lastPurified: this.lastPurified,
      agents: SOUL_MATRIX,
      startedAt: this.startedAt,
      uptimeSec: Math.floor((Date.now() - this.startedAt) / 1000),
    };
  }

  subscribe(fn: (s: SwarmState) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    const s = this.getState();
    this.listeners.forEach((l) => l(s));
  }

  /** 熵減循環: 每週 -3% (§十 進化框架) */
  tickEntropyReduction() {
    this.entropy = Math.max(0.01, this.entropy * 0.97);
    this.emit();
  }

  /** 靈魂執行鏈: 提交任務 → 蜂群協同 → 5T 驗算凍結 */
  async executeSwarmTask(task: string, clientId = 'cli'): Promise<SoulArtifact> {
    // 1. 本質提純 (Queen Bee)
    const queen = SOUL_MATRIX[0];
    const brief = `任務由 ${clientId} 提交。蜂后提純本質：${task}`;

    // 2. 蜂群協同 (30 Agents 並行摘要)
    const picks = this.dispatch(task);
    const summary = picks.map((a) => `【${a.title}】${a.task}`).join('\n');

    // 3. 5T 驗算與 Hash Lock 刻印
    const llm = await callLLM(`${brief}\n協作名單:\n${summary}\n請以蜂后口吻回應 50 字內。`);
    const artifact = purify(`client:${clientId}`, queen.title, {
      task,
      collaborators: picks.map((p) => p.id),
      llmEcho: llm.text,
      llmSource: llm.source,
    });
    if (!verifyZeroHallucination(artifact)) {
      throw new Error('5T 驗算失敗: 產物被竄改');
    }
    this.lastPurified = artifact;
    this.tasksDone++;
    this.emit();
    return artifact;
  }

  /** 依任務關鍵字派遣相關蜂 (簡易路由) */
  private dispatch(task: string): SoulAgent[] {
    const kw: Record<string, number[]> = {
      碼: [7, 8, 9, 10, 11],
      設計: [12, 13, 14, 15],
      市場: [17, 19, 20, 23],
      安全: [27, 28, 29],
      數據: [3, 10, 21, 24],
      風險: [5, 25, 26],
    };
    let ids = new Set<number>([1]); // 蜂后必在
    for (const [k, arr] of Object.entries(kw)) {
      if (task.includes(k)) arr.forEach((i) => ids.add(i));
    }
    if (ids.size === 1) [2, 4, 6, 22, 30].forEach((i) => ids.add(i)); // 預設泛用組
    return [...ids].map((i) => SOUL_MATRIX[i - 1]);
  }

  submitFeedback(uuid: string, rating: number, note: string) {
    this.feedback.submit(uuid, rating, note);
  }
}
