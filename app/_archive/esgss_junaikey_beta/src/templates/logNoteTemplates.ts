/**
 * 📝 Log Note Templates
 * --------------------------------------------------
 * 功能: 為錯誤日誌自動生成結構化調查筆記
 * 整合: OmniNote 系統
 * 協議: RCA (Root Cause Analysis) Framework
 * 
 * @version 1.0.0
 * @date 2026-02-11
 * @philosophy OmniCircle (奧秘圓通) - 將錯誤轉化為學習資產
 */

import type { LogEntry } from '@/omni/infrastructure/logging/OmniLogger';

/**
 * 🔴 創建錯誤調查筆記 (ERROR/CRITICAL)
 */
export function createErrorInvestigationNote(log: LogEntry): string {
    const timestamp = new Date(log.timestamp).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const levelIcon = log.level === 'CRITICAL' ? '🔴' : '🟠';
    const levelText = log.level === 'CRITICAL' ? '緊急' : '錯誤';

    return `# ${levelIcon} ${levelText}調查筆記

## 基本資訊
- **日誌 ID**: \`${log.id}\`
- **時間**: ${timestamp}
- **來源**: \`${log.source_origin}\`
- **分類**: ${log.category}
- **追踪 ID**: \`${log.trace_id}\`

---

## 錯誤描述
> ${log.message}

${log.metadata ? `\n### 上下文資料\n\`\`\`json\n${JSON.stringify(log.metadata, null, 2)}\n\`\`\`\n` : ''}

## 堆疊追踪
\`\`\`javascript
${log.stack || '無堆疊追踪資訊'}
\`\`\`

${log.url ? `\n### 請求資訊\n- **URL**: ${log.url}\n- **User Agent**: ${log.userAgent || 'N/A'}\n` : ''}

---

## 調查檢查清單 (RCA Framework)
- [ ] ✅ **重現問題** (本地環境)
  - 步驟: TODO
  - 結果: TODO
- [ ] 🔍 **定位根本原因**
  - 原因: TODO
  - 證據: TODO
- [ ] 💡 **提出解決方案**
  - 方案 1: TODO
  - 方案 2: TODO
- [ ] 🧪 **驗證修復** (單元測試)
  - 測試案例: TODO
  - 通過條件: TODO
- [ ] 📝 **更新文檔**
  - 文檔路徑: TODO
- [ ] 🚀 **部署修復**
  - 部署時間: TODO
  - 驗證環境: TODO

---

## 根本原因分析 (5 Whys)
1. **Why 1**: TODO - 為什麼會發生這個錯誤？
2. **Why 2**: TODO - 為什麼會有這個原因？
3. **Why 3**: TODO - 為什麼系統沒有防範？
4. **Why 4**: TODO - 為什麼測試沒有發現？
5. **Why 5**: TODO - 根本原因是什麼？

**結論**: TODO

---

## 短期修復 (Immediate Fix)
\`\`\`typescript
// TODO: 記錄修復代碼
\`\`\`

## 長期改進 (Long-term Improvement)
- [ ] 架構調整: TODO
- [ ] 監控增強: TODO
- [ ] 測試補強: TODO

---

## 預防措施 (Prevention)
1. **代碼層面**: TODO
2. **測試層面**: TODO
3. **監控層面**: TODO
4. **流程層面**: TODO

---

**自動產生於**: ${new Date().toLocaleString('zh-TW')}  
**關聯日誌**: [查看完整日誌](#/logs/${log.id})  
**狀態**: 🟡 調查中

---

## 調查日誌
<!-- 在此記錄調查過程 -->
`;
}

/**
 * 🟡 創建模式分析筆記 (重複錯誤)
 */
export function createPatternAnalysisNote(
    errorCode: string,
    occurrences: LogEntry[]
): string {
    if (!occurrences || occurrences.length === 0) {
        return `# 🟡 模式分析筆記 - ${errorCode}\n\n⚠️ 無發生記錄`;
    }

    const firstOccurrence = occurrences[0];
    const latestOccurrence = occurrences[occurrences.length - 1];

    const timeRange = `${new Date(firstOccurrence!.timestamp).toLocaleString('zh-TW')} ~ ${new Date(latestOccurrence!.timestamp).toLocaleString('zh-TW')}`;

    return `# 🟡 模式分析筆記 - ${errorCode}

## 摘要
**錯誤碼**: \`${errorCode}\`  
**發生次數**: ${occurrences.length} 次  
**時間範圍**: ${timeRange}

---

## 發生模式

### 時間分布
${occurrences.map((log, idx) => `${idx + 1}. ${new Date(log.timestamp).toLocaleString('zh-TW')} - ${log.message}`).join('\n')}

### 共同特徵
- **來源**: ${[...new Set(occurrences.map(log => log.source_origin))].join(', ')}
- **分類**: ${[...new Set(occurrences.map(log => log.category))].join(', ')}

---

## 影響評估
- [ ] **使用者影響**: TODO
- [ ] **業務影響**: TODO
- [ ] **系統穩定性**: TODO

---

## 模式假設
1. **假設 1**: TODO - 可能與某個特定操作相關
2. **假設 2**: TODO - 可能與時間段相關
3. **假設 3**: TODO - 可能與數據狀態相關

---

## 驗證計劃
- [ ] 數據分析: TODO
- [ ] 日誌關聯: TODO
- [ ] 指標監控: TODO

---

## 關聯日誌
${occurrences.slice(0, 5).map(log => `- [\`${log.id}\`](#/logs/${log.id}) - ${log.message}`).join('\n')}
${occurrences.length > 5 ? `\n... 以及其他 ${occurrences.length - 5} 條日誌` : ''}

---

**自動產生於**: ${new Date().toLocaleString('zh-TW')}  
**狀態**: 🔍 分析中
`;
}

/**
 * 📊 創建性能日誌摘要筆記
 */
export function createPerformanceLogNote(
    category: string,
    logs: LogEntry[]
): string {
    if (!logs || logs.length === 0) {
        return `# 📊 性能日誌摘要 - ${category}\n\n⚠️ 無日誌記錄`;
    }

    const avgTimestamp = logs.reduce((sum, log) => sum + log.timestamp, 0) / logs.length;

    return `# 📊 性能日誌摘要 - ${category}

## 統計資訊
- **日誌數量**: ${logs.length}
- **時間範圍**: ${new Date(logs[0]!.timestamp).toLocaleString('zh-TW')} ~ ${new Date(logs[logs.length - 1]!.timestamp).toLocaleString('zh-TW')}
- **平均時間**: ${new Date(avgTimestamp).toLocaleString('zh-TW')}

---

## 級別分布
- 🔴 CRITICAL: ${logs.filter(l => l.level === 'CRITICAL').length}
- 🟠 ERROR: ${logs.filter(l => l.level === 'ERROR').length}
- 🟡 WARN: ${logs.filter(l => l.level === 'WARN').length}
- 🔵 INFO: ${logs.filter(l => l.level === 'INFO').length}
- ⚪ DEBUG: ${logs.filter(l => l.level === 'DEBUG').length}

---

## 關鍵發現
- [ ] TODO: 分析關鍵趨勢
- [ ] TODO: 識別性能瓶頸
- [ ] TODO: 提出優化建議

---

**自動產生於**: ${new Date().toLocaleString('zh-TW')}
`;
}

/**
 * 🎯 創建客製化筆記模板
 */
export function createCustomNote(
    title: string,
    content: Record<string, any>
): string {
    return `# ${title}

${Object.entries(content).map(([key, value]) => {
        if (typeof value === 'object') {
            return `## ${key}\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
        }
        return `## ${key}\n${value}`;
    }).join('\n\n---\n\n')}

---

**自動產生於**: ${new Date().toLocaleString('zh-TW')}
`;
}
