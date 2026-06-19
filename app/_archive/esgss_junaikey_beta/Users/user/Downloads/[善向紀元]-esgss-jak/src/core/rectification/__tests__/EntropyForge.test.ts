// src/core/rectification/__tests__/EntropyForge.test.ts

import { EntropyForge } from '../EntropyForge';
// 假設我們將 AiOracle 抽出以便 Mock
import { AiOracle } from '../services/AiOracle';

import { EntropyForge } from '../EntropyForge';

describe('🔥 EntropyForge (核心煉金爐)', () => {

  // 1. 測試絕對秩序 (Zero Entropy)
  test('應對完美數據保持原樣 (PASS_THROUGH)', async () => {
    const perfectInput = 100;
    const result = await EntropyForge.purify(perfectInput, 'test-context');

    expect(result.data).toBe(100);
    expect(result.entropy).toBe('ZERO');
    expect(result.strategyUsed).toBe('PASS_THROUGH');
    expect(result.confidence).toBe(100);
  });

  // 2. 測試輕微擾動 (Low Entropy) - 格式修復
  test('應自動修復浮點數格式 (FORMAT_FIX)', async () => {
    const messyFloat = 100000.55555555; // 使它 > 99999 以觸發 LOW
    const result = await EntropyForge.purify(messyFloat, 'test-context');

    expect(result.data).toBe(100000.56); // 假設我們設定修復為小數點後兩位
    expect(result.entropy).toBe('LOW');
    expect(result.strategyUsed).toBe('FORMAT_FIX');
  });

  // 3. 測試高度混亂 (High Entropy) - AI 填補
  test('應對 Null 值觸發 AI 填補 (GAP_FILLING)', async () => {
    const voidInput = null;
    const result = await EntropyForge.purify(voidInput, 'test-context');

    // 驗證是否調用了 AI
    expect(result.data).toBe(1250.5); // 來自本地 AiOracle 的值
    expect(result.entropy).toBe('HIGH');
    expect(result.strategyUsed).toBe('GAP_FILLING');
    expect(result.confidence).toBeLessThan(100); // AI 預測的置信度應較低
  });

  // 4. 測試混沌注入 (Chaos Injection) - 反脆弱性
  test('應對非數值垃圾數據觸發回滾或填補', async () => {
    const chaosInput = "NaN"; // 模擬計算錯誤導致的字串
    const result = await EntropyForge.purify(chaosInput as any, 'test-context');

    // 預期系統將其視為 HIGH 或 CRITICAL 並進行處理
    expect(result.strategyUsed).not.toBe('PASS_THROUGH');
    expect(result.data).not.toBeNaN(); // 確保輸出的不是 NaN
  });
});