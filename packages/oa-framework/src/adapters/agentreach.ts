/**
 * Agent Reach Adapter — Panniantong/agent-reach
 * 定位: AI Agent 的本地端「聯網能力層」(Capability Layer), 零 API 費用/金鑰
 * 核心: 透過本地 CLI + 上游開源爬蟲 (yt-dlp/gh/bili-cli...) 直連網際網路
 * 能力: 13+ 渠道觸及 / agent-reach doctor 自我診斷 / 原生 Agent Skill 整合
 *
 * 設計哲學對齊 ESG GO: 去中心化模組化(MECE) + 高透明度可追溯 + 5T 合規
 *
 * 注意: CLI 精確子命令以官方 README 為準。本適配器以 graceful 降級方式
 *       呼叫 `agent-reach` 進程; 未安裝時 health=down + scaffold 輸出。
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { ISubFrameAdapter, OAFrameConfig, OATask, SubFrameId } from '../core/types.js';

const execFileP = promisify(execFile);

/** Agent-Reach 支援的觸達渠道 (用戶提供規格) */
export type AgentReachChannel =
  | 'youtube'      // 字幕/內容提取 (yt-dlp)
  | 'github'       // 倉庫檢視/管理 (gh)
  | 'bilibili'     // 無登入搜尋 (bili-cli)
  | 'twitter'      // X / Twitter
  | 'reddit'       // Reddit
  | 'xiaohongshu'  // 小紅書
  | 'facebook'     // Facebook
  | 'instagram'    // Instagram
  | 'xiaoyuzhou'   // 小宇宙播客
  | 'exa'          // 網頁語意搜尋
  | 'jina'         // Jina Reader 內容解析
  | 'rss';         // RSS 訂閱解析

export class AgentReachAdapter implements ISubFrameAdapter {
  readonly id: SubFrameId = 'agentreach';
  readonly label = 'Agent Reach (Panniantong/agent-reach)';
  readonly runtime = 'ts' as const;
  private cli = 'agent-reach';

  constructor(private config: OAFrameConfig) {}

  /** 啟動: 探測 agent-reach CLI 是否可用 */
  async bootstrap(): Promise<{ ok: boolean; endpoint?: string; error?: string }> {
    try {
      await execFileP(this.cli, ['--version'], { timeout: 5000 });
      return { ok: true, endpoint: 'local-cli' };
    } catch {
      return {
        ok: false,
        endpoint: 'local-cli',
        error: 'agent-reach CLI 未安裝 (見 Panniantong/agent-reach) — scaffold 模式',
      };
    }
  }

  /** 自我診斷: agent-reach doctor (用戶規格: 探測各工具後端健康 + 修復處方) */
  async doctor(): Promise<{ ok: boolean; report?: string }> {
    try {
      const { stdout } = await execFileP(this.cli, ['doctor'], { timeout: 15000 });
      return { ok: true, report: stdout };
    } catch (e: any) {
      return { ok: false, report: e?.message ?? 'doctor failed' };
    }
  }

  /**
   * 提交聯網任務 — 路由到對應渠道 CLI。
   * 精確子命令以官方 README 為準 (本輪無網路額度驗證, 留 @ts-ignore 動態組合)。
   * 預設 fallback: 將 prompt 視為搜尋意圖, 交給 exa/jina 語意搜尋。
   */
  async dispatch(task: OATask): Promise<{ output: string }> {
    try {
      // 嘗試 doctor 自診以確保聯網眼睛不瞎
      const diag = await this.doctor();
      const channel: AgentReachChannel = this.route(task.prompt);
      const { stdout, stderr } = await execFileP(
        this.cli,
        [channel, 'search', task.prompt],
        { timeout: 30000 }
      );
      const body = stdout.trim() || stderr.trim();
      return {
        output: `[AgentReach:${channel}] ${body || '(no output)'} | doctor=${diag.ok ? 'ok' : 'degraded'}`,
      };
    } catch (e: any) {
      return {
        output: `[AgentReach] ${task.prompt} (scaffold: ${e?.message ?? 'cli unreachable'})`,
      };
    }
  }

  /** 依 prompt 關鍵字路由渠道 (MECE 模組化路由) */
  private route(prompt: string): AgentReachChannel {
    const p = prompt.toLowerCase();
    if (p.includes('youtube') || p.includes('影片')) return 'youtube';
    if (p.includes('github') || p.includes('repo')) return 'github';
    if (p.includes('bilibili') || p.includes('b站')) return 'bilibili';
    if (p.includes('twitter') || p.includes('x ')) return 'twitter';
    if (p.includes('reddit')) return 'reddit';
    if (p.includes('小紅書') || p.includes('xiaohongshu')) return 'xiaohongshu';
    if (p.includes('facebook')) return 'facebook';
    if (p.includes('instagram')) return 'instagram';
    if (p.includes('小宇宙') || p.includes('podcast')) return 'xiaoyuzhou';
    if (p.includes('rss')) return 'rss';
    if (p.includes('jina') || p.includes('reader')) return 'jina';
    return 'exa'; // 預設語意搜尋
  }

  async health() {
    try {
      await execFileP(this.cli, ['--version'], { timeout: 5000 });
      return { status: 'ok' as const, detail: 'local-cli ready' };
    } catch {
      return { status: 'down' as const, detail: 'scaffold (agent-reach CLI 未安裝)' };
    }
  }
}
