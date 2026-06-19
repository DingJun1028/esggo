#!/usr/bin/env node
/**
 * Omni 筆記 MCP 服務器
 * Omni Notes MCP Server
 *
 * 這是一個基於 Model Context Protocol (MCP) 的服務器，
 * 提供 Omni 筆記系統的核心功能接口。
 *
 * @module omni-notes-mcp
 * @version 1.0.0
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// ============================================================================
// 類型定義
// ============================================================================

/**
 * 筆記類別
 */
type NoteCategory = 'INSIGHT' | 'ESG' | 'TECHNICAL' | 'BUSINESS' | 'PERSONAL';

/**
 * 同步平台
 */
type SyncPlatform = 'omni_space' | 'boost_space' | 'ai_table' | 'omni_note' | 'omni_table';

/**
 * 報告類型
 */
type ReportType = 'usage' | 'analytics' | 'performance';

/**
 * 時間範圍
 */
type TimePeriod = 'day' | 'week' | 'month' | 'year';

/**
 * 輸出格式
 */
type ExportFormat = 'pdf' | 'html' | 'json';

/**
 * 筆記條目
 */
interface NoteEntry {
  id: string;
  title: string;
  content: string;
  category: NoteCategory;
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata: Record<string, any>;
}

/**
 * 同步結果
 */
interface SyncResult {
  success: boolean;
  noteId: string;
  platform: SyncPlatform;
  timestamp: Date;
  error?: string;
}

/**
 * 系統狀態
 */
interface SystemStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime: number;
  services: Record<string, 'healthy' | 'degraded' | 'unhealthy'>;
  lastCheck: Date;
}

// ============================================================================
// 內存存儲（生產環境應使用數據庫）
// ============================================================================

class MemoryStorage {
  private notes: Map<string, NoteEntry> = new Map();
  private noteCounter: number = 0;

  createNote(note: Omit<NoteEntry, 'id' | 'createdAt' | 'updatedAt' | 'version'>): NoteEntry {
    const id = `note_${++this.noteCounter}`;
    const now = new Date();
    const newNote: NoteEntry = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };
    this.notes.set(id, newNote);
    return newNote;
  }

  getNote(id: string): NoteEntry | undefined {
    return this.notes.get(id);
  }

  updateNote(id: string, updates: Partial<Omit<NoteEntry, 'id' | 'createdAt' | 'version'>>): NoteEntry | undefined {
    const note = this.notes.get(id);
    if (!note) return undefined;

    const updatedNote: NoteEntry = {
      ...note,
      ...updates,
      updatedAt: new Date(),
      version: note.version + 1,
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  deleteNote(id: string): boolean {
    return this.notes.delete(id);
  }

  searchNotes(query: string, category?: NoteCategory, tags?: string[]): NoteEntry[] {
    const results: NoteEntry[] = [];

    for (const note of this.notes.values()) {
      // 類別過濾
      if (category && note.category !== category) continue;

      // 標籤過濾
      if (tags && tags.length > 0) {
        const hasAllTags = tags.every(tag => note.tags.includes(tag));
        if (!hasAllTags) continue;
      }

      // 文本搜索
      const searchText = `${note.title} ${note.content}`.toLowerCase();
      if (searchText.includes(query.toLowerCase())) {
        results.push(note);
      }
    }

    return results;
  }

  getRelatedNotes(noteId: string, limit: number = 5): NoteEntry[] {
    const note = this.notes.get(noteId);
    if (!note) return [];

    const related: Array<{ note: NoteEntry; score: number }> = [];

    for (const [id, otherNote] of this.notes.entries()) {
      if (id === noteId) continue;

      let score = 0;

      // 相同類別
      if (otherNote.category === note.category) score += 2;

      // 共同標籤
      const commonTags = note.tags.filter(tag => otherNote.tags.includes(tag));
      score += commonTags.length * 3;

      // 標題相似度
      const titleWords = note.title.toLowerCase().split(/\s+/);
      const otherTitleWords = otherNote.title.toLowerCase().split(/\s+/);
      const commonWords = titleWords.filter(word => otherTitleWords.includes(word));
      score += commonWords.length;

      if (score > 0) {
        related.push({ note: otherNote, score });
      }
    }

    return related
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(r => r.note);
  }

  getAllNotes(): NoteEntry[] {
    return Array.from(this.notes.values());
  }
}

// ============================================================================
// 工具處理器
// ============================================================================

const storage = new MemoryStorage();

/**
 * 創建筆記
 */
async function handleCreateNote(args: any): Promise<any> {
  const { title, content, category, tags = [] } = args;

  if (!title || !content || !category) {
    throw new Error('缺少必要參數: title, content, category');
  }

  const note = storage.createNote({
    title,
    content,
    category,
    tags,
    authorId: 'system',
    metadata: {},
  });

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          note,
          message: `筆記 "${title}" 創建成功`,
        }, null, 2),
      },
    ],
  };
}

/**
 * 搜索筆記
 */
async function handleSearchNotes(args: any): Promise<any> {
  const { query, category = 'ALL', tags, limit = 10 } = args;

  if (!query) {
    throw new Error('缺少必要參數: query');
  }

  const results = storage.searchNotes(
    query,
    category !== 'ALL' ? category as NoteCategory : undefined,
    tags
  ).slice(0, limit);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          query,
          count: results.length,
          notes: results,
        }, null, 2),
      },
    ],
  };
}

/**
 * 同步筆記
 */
async function handleSyncNote(args: any): Promise<any> {
  const { noteId, platform } = args;

  if (!noteId || !platform) {
    throw new Error('缺少必要參數: noteId, platform');
  }

  const note = storage.getNote(noteId);
  if (!note) {
    throw new Error(`筆記 ${noteId} 不存在`);
  }

  // 模擬同步過程
  const syncResult: SyncResult = {
    success: true,
    noteId,
    platform,
    timestamp: new Date(),
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          syncResult,
          message: `筆記 "${note.title}" 已同步到 ${platform}`,
        }, null, 2),
      },
    ],
  };
}

/**
 * 獲取筆記
 */
async function handleGetNote(args: any): Promise<any> {
  const { noteId } = args;

  if (!noteId) {
    throw new Error('缺少必要參數: noteId');
  }

  const note = storage.getNote(noteId);
  if (!note) {
    throw new Error(`筆記 ${noteId} 不存在`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          note,
        }, null, 2),
      },
    ],
  };
}

/**
 * 更新筆記
 */
async function handleUpdateNote(args: any): Promise<any> {
  const { noteId, title, content, tags } = args;

  if (!noteId) {
    throw new Error('缺少必要參數: noteId');
  }

  const updatedNote = storage.updateNote(noteId, {
    title,
    content,
    tags,
  });

  if (!updatedNote) {
    throw new Error(`筆記 ${noteId} 不存在`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          note: updatedNote,
          message: `筆記 "${updatedNote.title}" 更新成功`,
        }, null, 2),
      },
    ],
  };
}

/**
 * 刪除筆記
 */
async function handleDeleteNote(args: any): Promise<any> {
  const { noteId } = args;

  if (!noteId) {
    throw new Error('缺少必要參數: noteId');
  }

  const deleted = storage.deleteNote(noteId);
  if (!deleted) {
    throw new Error(`筆記 ${noteId} 不存在`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          message: `筆記 ${noteId} 刪除成功`,
        }, null, 2),
      },
    ],
  };
}

/**
 * 獲取相關筆記
 */
async function handleGetRelatedNotes(args: any): Promise<any> {
  const { noteId, limit = 5 } = args;

  if (!noteId) {
    throw new Error('缺少必要參數: noteId');
  }

  const relatedNotes = storage.getRelatedNotes(noteId, limit);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          noteId,
          count: relatedNotes.length,
          notes: relatedNotes,
        }, null, 2),
      },
    ],
  };
}

/**
 * 向 AI 助手提問
 */
async function handleAskAI(args: any): Promise<any> {
  const { question, context } = args;

  if (!question) {
    throw new Error('缺少必要參數: question');
  }

  // 模擬 AI 回應
  const response = {
    question,
    answer: `這是對問題 "${question}" 的模擬 AI 回應。在生產環境中，這將連接到實際的 AI 模型（如 OpenAI GPT、Anthropic Claude 等）來生成智能回應。`,
    context: context || '無上下文',
    timestamp: new Date(),
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          response,
        }, null, 2),
      },
    ],
  };
}

/**
 * 生成報告
 */
async function handleGenerateReport(args: any): Promise<any> {
  const { reportType, period, format } = args;

  if (!reportType || !period || !format) {
    throw new Error('缺少必要參數: reportType, period, format');
  }

  // 模擬報告生成
  const report = {
    type: reportType,
    period,
    format,
    generatedAt: new Date(),
    data: {
      totalNotes: storage.getAllNotes().length,
      notesByCategory: {
        INSIGHT: 0,
        ESG: 0,
        TECHNICAL: 0,
        BUSINESS: 0,
        PERSONAL: 0,
      },
      topTags: [],
    },
  };

  // 統計數據
  for (const note of storage.getAllNotes()) {
    report.data.notesByCategory[note.category]++;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          report,
          message: `${reportType} 報告生成成功`,
        }, null, 2),
      },
    ],
  };
}

/**
 * 獲取系統狀態
 */
async function handleGetSystemStatus(args: any): Promise<any> {
  const status: SystemStatus = {
    status: 'healthy',
    version: '1.0.0',
    uptime: process.uptime(),
    services: {
      knowledgeBase: 'healthy',
      syncService: 'healthy',
      aiAssistant: 'healthy',
      security: 'healthy',
      monitoring: 'healthy',
    },
    lastCheck: new Date(),
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          status,
        }, null, 2),
      },
    ],
  };
}

// ============================================================================
// MCP 服務器設置
// ============================================================================

// 創建 MCP 服務器
const server = new Server(
  {
    name: 'omni-notes',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 註冊工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    {
      name: 'create_note',
      description: '創建新的筆記。支持多種類別（INSIGHT、ESG、TECHNICAL、BUSINESS、PERSONAL）和標籤系統。',
      inputSchema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: '筆記標題',
          },
          content: {
            type: 'string',
            description: '筆記內容，支持 Markdown 格式',
          },
          category: {
            type: 'string',
            enum: ['INSIGHT', 'ESG', 'TECHNICAL', 'BUSINESS', 'PERSONAL'],
            description: '筆記類別',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '標籤列表，用於分類和搜索',
          },
        },
        required: ['title', 'content', 'category'],
      },
    },
    {
      name: 'search_notes',
      description: '搜索筆記。支持全文搜索、類別過濾和標籤過濾。',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '搜索查詢，支持關鍵詞搜索',
          },
          category: {
            type: 'string',
            enum: ['INSIGHT', 'ESG', 'TECHNICAL', 'BUSINESS', 'PERSONAL', 'ALL'],
            description: '類別過濾，默認為 ALL',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '標籤過濾，只返回包含所有指定標籤的筆記',
          },
          limit: {
            type: 'number',
            description: '返回數量限制，默認為 10',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'sync_note',
      description: '同步筆記到外部平台。支持 OmniSpace、Boost.Space、AITable、OmniNote、OmniTable 等平台。',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: '筆記 ID',
          },
          platform: {
            type: 'string',
            enum: ['omni_space', 'boost_space', 'ai_table', 'omni_note', 'omni_table'],
            description: '目標平台',
          },
        },
        required: ['noteId', 'platform'],
      },
    },
    {
      name: 'get_note',
      description: '獲取筆記詳情，包括完整的內容、標籤和元數據。',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: '筆記 ID',
          },
        },
        required: ['noteId'],
      },
    },
    {
      name: 'update_note',
      description: '更新現有筆記的標題、內容或標籤。',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: '筆記 ID',
          },
          title: {
            type: 'string',
            description: '新的筆記標題',
          },
          content: {
            type: 'string',
            description: '新的筆記內容',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: '新的標籤列表',
          },
        },
        required: ['noteId'],
      },
    },
    {
      name: 'delete_note',
      description: '刪除指定的筆記。此操作不可逆，請謹慎使用。',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: '筆記 ID',
          },
        },
        required: ['noteId'],
      },
    },
    {
      name: 'get_related_notes',
      description: '獲取與指定筆記相關的其他筆記。基於類別、標籤和內容相似度進行推薦。',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: '筆記 ID',
          },
          limit: {
            type: 'number',
            description: '返回數量限制，默認為 5',
          },
        },
        required: ['noteId'],
      },
    },
    {
      name: 'ask_ai',
      description: '向 AI 智能助手提問。AI 助手可以幫助您分析內容、生成建議、回答問題等。',
      inputSchema: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
            description: '您的問題',
          },
          context: {
            type: 'string',
            description: '可選的上下文信息，幫助 AI 更好地理解您的問題',
          },
        },
        required: ['question'],
      },
    },
    {
      name: 'generate_report',
      description: '生成各種類型的報告，包括使用報告、分析報告和性能報告。',
      inputSchema: {
        type: 'object',
        properties: {
          reportType: {
            type: 'string',
            enum: ['usage', 'analytics', 'performance'],
            description: '報告類型',
          },
          period: {
            type: 'string',
            enum: ['day', 'week', 'month', 'year'],
            description: '時間範圍',
          },
          format: {
            type: 'string',
            enum: ['pdf', 'html', 'json'],
            description: '輸出格式',
          },
        },
        required: ['reportType', 'period', 'format'],
      },
    },
    {
      name: 'get_system_status',
      description: '獲取 Omni 筆記系統的當前狀態，包括各個服務的健康狀況和系統信息。',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ];

  return { tools };
});

// 處理工具調用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_note':
        return await handleCreateNote(args);
      case 'search_notes':
        return await handleSearchNotes(args);
      case 'sync_note':
        return await handleSyncNote(args);
      case 'get_note':
        return await handleGetNote(args);
      case 'update_note':
        return await handleUpdateNote(args);
      case 'delete_note':
        return await handleDeleteNote(args);
      case 'get_related_notes':
        return await handleGetRelatedNotes(args);
      case 'ask_ai':
        return await handleAskAI(args);
      case 'generate_report':
        return await handleGenerateReport(args);
      case 'get_system_status':
        return await handleGetSystemStatus(args);
      default:
        throw new Error(`未知工具: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : String(error),
          }, null, 2),
        },
      ],
    };
  }
});

// ============================================================================
// 啟動服務器
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Omni 筆記 MCP 服務器已啟動 (Omni Notes MCP Server running on stdio)');
  console.error('版本: 1.0.0');
  console.error('可用工具: 10 個');
}

main().catch((error) => {
  console.error('服務器啟動失敗 (Fatal error in main()):', error);
  process.exit(1);
});
