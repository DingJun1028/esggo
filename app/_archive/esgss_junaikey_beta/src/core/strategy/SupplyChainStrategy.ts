import { ISupplierScore, IStrategyResult } from './types';

/**
 * 💡 奧秘元件：供應鏈策略分析
 * --------------------------------------------------
 * [來源] 根據 ISO-20400 永續採購指南
 */
export const generateStrategy = (suppliers: ISupplierScore[]): IStrategyResult => {
  const highRisk = suppliers.filter(s => s.grade === 'C' && s.emission_impact > 0.2);

  // 模擬邏輯：如果有高風險供應商
  if (highRisk.length >= 3) {
    return {
      critical_action: '🔥 偵測到 3 家高風險供應商。其排放佔範疇三 15%，且數據不可溯源。',
      optimization_path:
        '建議將 20% 的訂單轉移至具備 Grade S 評等的供應商 B，預計可降低年度總碳排 3.5%。',
      compliance_alert: '供應商 C 未能提供 Hash Lock 憑證，建議啟動現場稽核程序。',
    };
  }

  // 預設/安全狀態
  return {
    critical_action: '✅ 供應鏈狀態穩定。未偵測到重大風險。',
    optimization_path: '建議持續監控 Top 5 供應商的即時碳排數據。',
    compliance_alert: '所有主要供應商皆已簽署數位憑證。',
  };
};
