import { describe, it, expect } from 'vitest';
import { computeFeedback } from '../DynamicFormEngine';

/**
 * 零幻覺警告邏輯的可重現驗證（不依賴瀏覽器熱重載）。
 * 對齊 DynamicFormEngine 的渲染條件：feedback.status==='error' 時顯示琥珀色橫幅。
 */
describe('computeFeedback (9式果因引擎 → UI 反饋)', () => {
  const basePayload = {
    uuid: 'mod-env-carbon-0001',
    version: '1.1.0-Universe',
    source_origin: 'dynamic-form-engine-ui',
    evidence: ['https://s3.example.com/proof.pdf'],
    reportType: 'ISO-14064',
    previousYearUsage: 1000,
    gridEmissionFactor: 0.495,
    timestamp: Date.now(),
  };

  it('正常數據 → success（綠色橫幅）', () => {
    const fb = computeFeedback({
      ...basePayload,
      currentYearUsage: 1050, // +5% 合理
    });
    expect(fb.status).toBe('success');
    expect(fb.message).toContain('果因引擎驗算通過');
  });

  it('>500% 暴增 → error + 欄位警告（琥珀色橫幅 + 當期用電量錯誤）', () => {
    const fb = computeFeedback({
      ...basePayload,
      currentYearUsage: 10000, // +900% 異常
    });
    expect(fb.status).toBe('error');
    expect(fb.message).toContain('【Dr. Thoth 零幻覺警告】');
    // 欄位級錯誤對映到 currentYearUsage（DynamicFormEngine 用 fieldError 顯示）
    expect(fb.errors?.currentYearUsage?._errors[0]).toContain('暴增超過 500%');
  });

  it('缺少證據 → error + evidence 錯誤（橫幅附證據提示）', () => {
    const fb = computeFeedback({
      ...basePayload,
      evidence: [],
      currentYearUsage: 1050,
    });
    expect(fb.status).toBe('error');
    expect(fb.errors?.evidence?._errors[0]).toContain('佐證憑證');
  });
});
