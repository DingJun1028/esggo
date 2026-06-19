/**
 * ESGSonar Diff Engine
 * 
 * 版本差異比對引擎，用於：
 * - 偵測法規文字變更
 * - 比較報告書版本差異
 * - 產生結構化差異報告
 */

import { diffWords, diffLines, diffChars, Change } from 'diff';

// 類型別名
export type DiffChangeType = 'added' | 'removed' | 'unchanged';

// 簡化的 Change 介面，避免依賴 @types/diff
interface SimpleChange {
  added?: boolean;
  removed?: boolean;
  value: string;
}

// ============================================
// 類型定義
// ============================================

export interface DiffOptions {
  mode: 'words' | 'lines' | 'chars';
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  trimLines: boolean;
}

export interface DiffResult {
  hasChanges: boolean;
  changes: DiffChange[];
  summary: DiffSummary;
  oldVersion: number;
  newVersion: number;
}

export interface DiffChange {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  lineNumber?: {
    old?: number;
    new?: number;
  };
}

export interface DiffSummary {
  addedLines: number;
  removedLines: number;
  unchangedLines: number;
  totalChanges: number;
  changePercentage: number;
  addedWords: number;
  removedWords: number;
}

export interface SectionDiff {
  sectionName: string;
  changes: DiffChange[];
  changeType: 'major' | 'minor' | 'none';
}

export interface VersionComparison {
  oldReportId: string;
  newReportId: string;
  oldVersion: number;
  newVersion: number;
  sectionDiffs: SectionDiff[];
  overallDiff: DiffResult;
  keyChanges: KeyChange[];
}

export interface KeyChange {
  category: 'environmental' | 'social' | 'governance' | 'other';
  type: 'added' | 'removed' | 'modified';
  description: string;
  significance: 'high' | 'medium' | 'low';
  location?: string;
}

export interface RegulationDiff {
  regulationId: string;
  regulationName: string;
  oldContent: string;
  newContent: string;
  effectiveDate?: Date;
  previousVersion: number;
  newVersion: number;
  diff: DiffResult;
  keyAmendments: Amendment[];
}

export interface Amendment {
  article?: string;
  type: 'added' | 'removed' | 'modified';
  description: string;
  oldText?: string;
  newText?: string;
  significance: 'high' | 'medium' | 'low';
}

// ============================================
// 預設配置
// ============================================

const DEFAULT_DIFF_OPTIONS: DiffOptions = {
  mode: 'words',
  ignoreWhitespace: false,
  ignoreCase: false,
  trimLines: true,
};

// ============================================
// Diff Engine 類別
// ============================================

export class DiffEngine {
  private options: DiffOptions;
  
  constructor(options: Partial<DiffOptions> = {}) {
    this.options = { ...DEFAULT_DIFF_OPTIONS, ...options };
  }

  /**
   * 比較兩個版本
   */
  compare(oldText: string, newText: string, oldVersion = 1, newVersion = 2): DiffResult {
    // 前處理文字
    const processedOld = this.preprocessText(oldText);
    const processedNew = this.preprocessText(newText);
    
    // 執行差異比較
    let diffChanges: Change[];
    switch (this.options.mode) {
      case 'lines':
        diffChanges = diffLines(processedOld, processedNew);
        break;
      case 'chars':
        diffChanges = diffChars(processedOld, processedNew);
        break;
      case 'words':
      default:
        diffChanges = diffWords(processedOld, processedNew);
        break;
    }
    
    // 轉換為 DiffChange 陣列
    const changes = this.convertChanges(diffChanges);
    
    // 計算摘要
    const summary = this.calculateSummary(changes, processedOld, processedNew);
    
    return {
      hasChanges: summary.totalChanges > 0,
      changes,
      summary,
      oldVersion,
      newVersion,
    };
  }

  /**
   * 比較多個版本
   */
  compareVersions(
    versions: Array<{ version: number; content: string }>
  ): DiffResult[] {
    const results: DiffResult[] = [];
    
    // 按版本排序
    const sortedVersions = [...versions].sort((a, b) => a.version - b.version);
    
    // 兩兩比較
    for (let i = 1; i < sortedVersions.length; i++) {
      const result = this.compare(
        sortedVersions[i - 1].content,
        sortedVersions[i].content,
        sortedVersions[i - 1].version,
        sortedVersions[i].version
      );
      results.push(result);
    }
    
    return results;
  }

  /**
   * 比較結構化內容 (如 JSON)
   */
  compareStructured(
    oldData: Record<string, unknown>,
    newData: Record<string, unknown>,
    path = ''
  ): DiffResult {
    const oldText = JSON.stringify(oldData, null, 2);
    const newText = JSON.stringify(newData, null, 2);
    
    return this.compare(oldText, newText);
  }

  /**
   * 產生法規差異報告
   */
  generateRegulationDiff(
    regulationId: string,
    regulationName: string,
    oldContent: string,
    newContent: string,
    previousVersion: number,
    newVersion: number
  ): RegulationDiff {
    const diff = this.compare(oldContent, newContent, previousVersion, newVersion);
    
    // 偵測關鍵修訂
    const keyAmendments = this.detectKeyAmendments(diff);
    
    return {
      regulationId,
      regulationName,
      oldContent,
      newContent,
      previousVersion,
      newVersion,
      diff,
      keyAmendments,
    };
  }

  /**
   * 產生章節差異
   */
  generateSectionDiff(
    sections: Array<{
      name: string;
      oldContent?: string;
      newContent?: string;
    }>
  ): SectionDiff[] {
    return sections.map(section => {
      const oldContent = section.oldContent || '';
      const newContent = section.newContent || '';
      
      const diff = this.compare(oldContent, newContent);
      
      let changeType: 'major' | 'minor' | 'none' = 'none';
      if (diff.hasChanges) {
        changeType = diff.summary.changePercentage > 30 ? 'major' : 'minor';
      }
      
      return {
        sectionName: section.name,
        changes: diff.changes,
        changeType,
      };
    });
  }

  /**
   * 偵測 ESG 關鍵變更
   */
  detectESGKeyChanges(
    oldContent: string,
    newContent: string,
    category: 'environmental' | 'social' | 'governance'
  ): KeyChange[] {
    const keyChanges: KeyChange[] = [];
    const diff = this.compare(oldContent, newContent);
    
    // 定義關鍵詞彙
    const categoryKeywords = {
      environmental: [
        '碳排放', '碳中和', '溫室氣體', '碳足跡', '能源效率',
        '廢棄物', '再生能源', '碳權', '碳交易', '氣候變遷',
        'carbon', 'emission', 'net zero', 'climate'
      ],
      social: [
        '員工', '勞工', '人權', '多元', 'DEI', '供應鏈',
        '社區', '公益', 'CSR', 'Stakeholder',
        'employee', 'labor', 'human rights', 'diversity'
      ],
      governance: [
        '公司治理', '董事', '監察人', '獨立董事', '薪資',
        '資訊揭露', '內控', '稽核', '風險管理',
        'governance', 'board', 'disclosure', 'audit', 'risk'
      ],
    };
    
    // 檢查新增的內容
    const addedContent = diff.changes
      .filter(c => c.type === 'added')
      .map(c => c.value)
      .join(' ');
    
    // 檢查移除的內容
    const removedContent = diff.changes
      .filter(c => c.type === 'removed')
      .map(c => c.value)
      .join(' ');
    
    const keywords = categoryKeywords[category as keyof typeof categoryKeywords] || [];
    
    // 偵測新增關鍵詞
    for (const keyword of keywords) {
      if (addedContent.toLowerCase().includes(keyword.toLowerCase())) {
        keyChanges.push({
          category,
          type: 'added',
          description: `新增${keyword}相關內容`,
          significance: this.determineSignificance(keyword, category),
        });
      }
      
      if (removedContent.toLowerCase().includes(keyword.toLowerCase())) {
        keyChanges.push({
          category,
          type: 'removed',
          description: `移除${keyword}相關內容`,
          significance: this.determineSignificance(keyword, category),
        });
      }
    }
    
    return keyChanges;
  }

  /**
   * 產生統一的差異格式 (Unified Diff)
   */
  generateUnifiedDiff(
    oldText: string,
    newText: string,
    oldHeader: string,
    newHeader: string,
    context = 3
  ): string {
    const lines = diffLines(oldText, newText);
    const result: string[] = [
      `--- ${oldHeader}`,
      `+++ ${newHeader}`,
    ];
    
    let oldLineNum = 1;
    let newLineNum = 1;
    
    for (const change of lines) {
      const prefix = change.added ? '+' : change.removed ? '-' : ' ';
      const lineNums = change.added
        ? `@@ -${oldLineNum} +${newLineNum} @@`
        : change.removed
          ? `@@ -${oldLineNum} +${newLineNum} @@`
          : '';
      
      if (lineNums) {
        result.push(lineNums);
      }
      
      for (const line of change.value.split('\n')) {
        if (line) {
          result.push(prefix + line);
          if (change.added) newLineNum++;
          else if (change.removed) oldLineNum++;
          else {
            oldLineNum++;
            newLineNum++;
          }
        }
      }
    }
    
    return result.join('\n');
  }

  /**
   * 前處理文字
   */
  private preprocessText(text: string): string {
    let processed = text;
    
    if (this.options.trimLines) {
      processed = processed
        .split('\n')
        .map(line => line.trim())
        .join('\n');
    }
    
    if (this.options.ignoreCase) {
      processed = processed.toLowerCase();
    }
    
    if (this.options.ignoreWhitespace) {
      processed = processed.replace(/\s+/g, ' ').trim();
    }
    
    return processed;
  }

  /**
   * 轉換 Change 陣列為 DiffChange
   */
  private convertChanges(changes: Change[]): DiffChange[] {
    return changes.map(change => ({
      type: change.added ? 'added' : change.removed ? 'removed' : 'unchanged',
      value: change.value,
    }));
  }

  /**
   * 計算摘要
   */
  private calculateSummary(
    changes: DiffChange[],
    oldText: string,
    newText: string
  ): DiffSummary {
    let addedLines = 0;
    let removedLines = 0;
    let unchangedLines = 0;
    let addedWords = 0;
    let removedWords = 0;
    
    for (const change of changes) {
      if (change.type === 'added') {
        addedLines += (change.value.match(/\n/g) || []).length;
        addedWords += change.value.split(/\s+/).filter(Boolean).length;
      } else if (change.type === 'removed') {
        removedLines += (change.value.match(/\n/g) || []).length;
        removedWords += change.value.split(/\s+/).filter(Boolean).length;
      } else {
        unchangedLines += (change.value.match(/\n/g) || []).length;
      }
    }
    
    const totalChanges = addedLines + removedLines;
    const totalLines = unchangedLines + totalChanges;
    const changePercentage = totalLines > 0 
      ? Math.round((totalChanges / totalLines) * 100) 
      : 0;
    
    return {
      addedLines,
      removedLines,
      unchangedLines,
      totalChanges,
      changePercentage,
      addedWords,
      removedWords,
    };
  }

  /**
   * 偵測關鍵修訂
   */
  private detectKeyAmendments(diff: DiffResult): Amendment[] {
    const amendments: Amendment[] = [];
    
    // 簡單的 Article 偵測 (需要更複雜的 NLP)
    const articlePatterns = [
      /第\s*(\d+)\s*條/,
      /Article\s*(\d+)/,
      /第(\d+)條/,
    ];
    
    for (const change of diff.changes) {
      if (change.type !== 'unchanged') {
        // 嘗試偵測條文編號
        for (const pattern of articlePatterns) {
          const match = change.value.match(pattern);
          if (match) {
            amendments.push({
              article: match[1],
              type: change.type === 'added' ? 'added' : 'removed',
              description: change.type === 'added' 
                ? `新增第${match[1]}條` 
                : `刪除第${match[1]}條`,
              significance: 'medium',
            });
            break;
          }
        }
      }
    }
    
    return amendments;
  }

  /**
   * 決定變更的重要性
   */
  private determineSignificance(
    keyword: string,
    category: string
  ): 'high' | 'medium' | 'low' {
    const highSignificance: Record<string, string[]> = {
      environmental: ['碳中和', 'net zero', '碳排放', 'carbon emission'],
      social: ['人權', 'human rights', '童工', '強制勞動'],
      governance: ['內控', 'internal control', '重大缺失'],
    };
    
    const categoryKeywords = highSignificance[category] || [];
    if (categoryKeywords.some((k: string) => keyword.toLowerCase().includes(k.toLowerCase()))) {
      return 'high';
    }
    
    return 'medium';
  }
}

// ============================================
// 工具函數
// ============================================

/**
 * 快速比較兩個文字
 */
export function quickDiff(oldText: string, newText: string): boolean {
  return oldText !== newText;
}

/**
 * 計算文字相似度 (0-1)
 */
export function calculateSimilarity(oldText: string, newText: string): number {
  if (!oldText && !newText) return 1;
  if (!oldText || !newText) return 0;
  
  const engine = new DiffEngine();
  const result = engine.compare(oldText, newText);
  
  return 1 - (result.summary.changePercentage / 100);
}

/**
 * 格式化差異為 HTML
 */
export function formatDiffAsHtml(diff: DiffResult): string {
  let html = '<div class="diff-container">';
  
  for (const change of diff.changes) {
    const cssClass = change.type === 'added' 
      ? 'diff-added' 
      : change.type === 'removed' 
        ? 'diff-removed' 
        : 'diff-unchanged';
    
    html += `<span class="${cssClass}">${escapeHtml(change.value)}</span>`;
  }
  
  html += '</div>';
  
  return html;
}

/**
 * 逸出 HTML 特殊字元
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================
// 預設匯出
// ============================================

export default DiffEngine;