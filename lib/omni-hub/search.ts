// lib/omni-hub/search.ts
// 萬能中心 — 記憶搜尋引擎（全文搜尋 + 關聯推薦）

import type { SharedMemoryEntry } from './types';

export interface SearchOptions {
  type?: string;
  agentId?: string;
  visibility?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

export interface SearchResult {
  entry: SharedMemoryEntry;
  score: number;
  matchedFields: string[];
}

export interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
  related: SearchResult[];
}

export class MemorySearchEngine {
  private static instance: MemorySearchEngine;

  static getInstance(): MemorySearchEngine {
    if (!MemorySearchEngine.instance) {
      MemorySearchEngine.instance = new MemorySearchEngine();
    }
    return MemorySearchEngine.instance;
  }

  search(
    memories: SharedMemoryEntry[],
    query: string,
    options: SearchOptions = {}
  ): SearchResponse {
    const lower = query.toLowerCase().trim();
    const limit = options.limit || 20;

    if (!lower) {
      return { query, total: 0, results: [], related: [] };
    }

    // 分詞（支援中文逐字 + 英文單字）
    const tokens = this.tokenize(lower);

    let filtered = memories;

    // 前置篩選
    if (options.type) filtered = filtered.filter((m) => m.type === options.type);
    if (options.agentId) filtered = filtered.filter((m) => m.agentId === options.agentId);
    if (options.visibility) filtered = filtered.filter((m) => m.visibility === options.visibility);
    if (options.tags?.length) {
      filtered = filtered.filter((m) => options.tags!.some((t) => m.tags.includes(t)));
    }
    if (options.dateFrom) {
      const from = new Date(options.dateFrom).getTime();
      filtered = filtered.filter((m) => new Date(m.createdAt).getTime() >= from);
    }
    if (options.dateTo) {
      const to = new Date(options.dateTo).getTime();
      filtered = filtered.filter((m) => new Date(m.createdAt).getTime() <= to);
    }

    // 評分
    const scored: SearchResult[] = filtered.map((entry) => {
      let score = 0;
      const matchedFields: string[] = [];

      for (const token of tokens) {
        // 標題匹配（權重最高）
        if (entry.title.toLowerCase().includes(token)) {
          score += 10;
          if (!matchedFields.includes('title')) matchedFields.push('title');
        }
        // 標籤匹配
        if (entry.tags.some((t) => t.toLowerCase().includes(token))) {
          score += 7;
          if (!matchedFields.includes('tags')) matchedFields.push('tags');
        }
        // 摘要匹配
        if (entry.summary.toLowerCase().includes(token)) {
          score += 5;
          if (!matchedFields.includes('summary')) matchedFields.push('summary');
        }
        // 內容匹配
        if (entry.content.toLowerCase().includes(token)) {
          score += 3;
          if (!matchedFields.includes('content')) matchedFields.push('content');
        }
        // 設施名稱匹配
        if (entry.agentName.toLowerCase().includes(token)) {
          score += 2;
          if (!matchedFields.includes('agentName')) matchedFields.push('agentName');
        }
      }

      // 時間衰減加成
      const ageDays = (Date.now() - new Date(entry.updatedAt).getTime()) / 86400000;
      score += Math.max(0, 5 - ageDays * 0.1);

      return { entry, score, matchedFields };
    });

    // 排序
    scored.sort((a, b) => b.score - a.score);

    // 過濾零分數
    const valid = scored.filter((s) => s.score > 0);
    const limited = valid.slice(0, limit);

    // 關聯推薦（基於第一結果的標籤/設施/引用）
    const related: SearchResult[] = [];
    if (limited.length > 0) {
      const top = limited[0].entry;
      const relatedCandidates = valid.filter((r) => r.entry.id !== top.id);
      for (const r of relatedCandidates) {
        let relScore = 0;
        // 標籤重疊
        const sharedTags = r.entry.tags.filter((t) => top.tags.includes(t));
        relScore += sharedTags.length * 5;
        // 同設施
        if (r.entry.agentId === top.agentId) relScore += 3;
        // 同類型
        if (r.entry.type === top.type) relScore += 2;
        // 互相引用
        if (top.referencedBy.includes(r.entry.id) || r.entry.referencedBy.includes(top.id)) {
          relScore += 10;
        }
        if (relScore > 0) {
          related.push({ ...r, score: relScore });
        }
      }
      related.sort((a, b) => b.score - a.score);
    }

    return {
      query,
      total: valid.length,
      results: limited,
      related: related.slice(0, 5),
    };
  }

  private tokenize(text: string): string[] {
    // 英文用空格分詞，中文逐字拆分
    const englishTokens = text.split(/\s+/).filter(Boolean);
    const chineseTokens: string[] = [];
    for (const char of text) {
      if (/[\u4e00-\u9fff]/.test(char)) {
        chineseTokens.push(char);
      }
    }
    // 也加入 bigram
    const bigrams: string[] = [];
    for (let i = 0; i < chineseTokens.length - 1; i++) {
      bigrams.push(chineseTokens[i] + chineseTokens[i + 1]);
    }
    return [...englishTokens, ...chineseTokens, ...bigrams];
  }
}

export const searchEngine = MemorySearchEngine.getInstance();
