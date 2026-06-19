/**
 * 前端 API 客戶端
 * 使用共享類型確保類型安全
 */

import type {
  ApiRequest,
  ApiResponse,
  AgentConfig,
  AgentSession,
  KnowledgeIngestRequest,
  KnowledgeRetrievalRequest,
  SkillExecutionRequest,
  SkillExecutionResult,
  HealthCheckResponse,
  MemoryFragment,
  MemoryRetrievalOptions,
  OmniRequestType,
  MultimodalPart,
} from '../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * API 客戶端類別
 */
export class OmniCoreClient {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // ========== Agent 管理 ==========

  /**
   * 創建 Agent 會話
   */
  async manifestAgent(config: AgentConfig): Promise<AgentSession> {
    const response = await fetch(`${this.baseUrl}/api/manifest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_agent: config }),
    });

    if (!response.ok) {
      throw new Error('Failed to manifest agent');
    }

    const session = await response.json();
    this.sessionId = session.sessionId;
    return session;
  }

  /**
   * 處理請求
   */
  async process(
    type: OmniRequestType,
    content: string,
    context?: Record<string, unknown>,
    parts?: MultimodalPart[]
  ): Promise<ApiResponse> {
    const request: ApiRequest = {
      id: `req_${Date.now()}`,
      type,
      content,
      parts,
      context,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(`${this.baseUrl}/api/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to process request');
    }

    return response.json();
  }

  // ========== 知識庫操作 ==========

  /**
   * 注入知識
   */
  async ingestKnowledge(request: KnowledgeIngestRequest): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/knowledge/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to ingest knowledge');
    }
  }

  /**
   * 檢索知識
   */
  async retrieveKnowledge(request: KnowledgeRetrievalRequest): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/knowledge/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve knowledge');
    }

    const data = await response.json();
    return data.results;
  }

  // ========== 技能執行 ==========

  /**
   * 執行技能
   */
  async executeSkill(request: SkillExecutionRequest): Promise<SkillExecutionResult> {
    const response = await fetch(`${this.baseUrl}/api/skills/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to execute skill');
    }

    return response.json();
  }

  // ========== 記憶操作 ==========

  /**
   * 儲存記憶
   */
  async storeMemory(
    content: string,
    type: string,
    metadata?: Record<string, unknown>
  ): Promise<MemoryFragment> {
    const response = await fetch(`${this.baseUrl}/api/memory/store`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, type, metadata }),
    });

    if (!response.ok) {
      throw new Error('Failed to store memory');
    }

    return response.json();
  }

  /**
   * 檢索記憶
   */
  async retrieveMemory(query: string, options?: MemoryRetrievalOptions): Promise<MemoryFragment[]> {
    const response = await fetch(`${this.baseUrl}/api/memory/retrieve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, options }),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve memory');
    }

    const data = await response.json();
    return data.memories;
  }

  // ========== 健康檢查 ==========

  /**
   * 健康檢查
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${this.baseUrl}/api/health`);

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return response.json();
  }
}

// 導出單例
export const omniClient = new OmniCoreClient();
