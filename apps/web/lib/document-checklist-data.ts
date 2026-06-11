export type DocStatus = 'pending' | 'completed' | 'in_progress' | 'missing' | 'needs_update';

export interface ESGDocument {
  id: string;
  name: string;
  standard: string;
  department: string;
  status: DocStatus;
  notes?: string;
  priority?: 'high';
  isNew?: boolean;
  category: 'D' | 'E' | 'S' | 'T' | 'G';
}

export const documentChecklist: ESGDocument[] = [
  // D - 基礎治理文件
  { id: 'D-001', name: '公司組織章程', standard: 'GRI 2-1', department: '法務部', status: 'pending', category: 'D' },
  { id: 'D-002', name: '董事會組成與職能說明', standard: 'GRI 2-9', department: '董事會', status: 'pending', category: 'D' },
  { id: 'D-003', name: '年度財務報告（稽核後）', standard: 'GRI 2-5', department: '財務部', status: 'pending', category: 'D' },
  { id: 'D-004', name: '報告書範疇說明書', standard: 'GRI 2-2', department: 'ESG辦公室', status: 'pending', category: 'D' },
  { id: 'D-005', name: '永續政策聲明書', standard: 'GRI 2-23', department: '高層管理', status: 'pending', category: 'D' },
  { id: 'D-006', name: '利害關係人議合機制說明', standard: 'GRI 2-29', department: 'ESG辦公室', status: 'pending', category: 'D' },
  { id: 'D-007', name: '重大性評估矩陣與說明', standard: 'GRI 3-1/3-2', department: 'ESG辦公室', status: 'pending', category: 'D' },
  { id: 'D-008', name: '法令遵循聲明書', standard: 'GRI 2-27', department: '法務部', status: 'pending', category: 'D' },
  { id: 'D-009', name: '企業社會責任政策', standard: 'GRI 2-23', department: '高層管理', status: 'pending', category: 'D' },
  { id: 'D-010', name: '報告書發布聲明', standard: 'GRI 2-3', department: 'ESG辦公室', status: 'pending', category: 'D' },
  { id: 'D-011', name: '主要子公司與關係企業清單', standard: 'GRI 2-2', department: '財務部', status: 'pending', category: 'D' },
  { id: 'D-012', name: 'GRI符合性聲明書', standard: 'GRI 2-3', department: 'ESG辦公室', status: 'pending', isNew: true, category: 'D' },
  { id: 'D-013', name: '利害關係人識別與參與紀錄', standard: 'GRI 2-29', department: 'ESG辦公室', status: 'pending', isNew: true, category: 'D' },
  { id: 'D-014', name: '第三方查證報告', standard: '金管會', department: 'ESG辦公室', status: 'missing', isNew: true, priority: 'high', notes: '金管會強制', category: 'D' },

  // E - 環境面文件
  { id: 'E-001', name: '溫室氣體排放盤查報告（Scope 1/2）', standard: 'GRI 305 / TCFD', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-002', name: 'Scope 3 排放評估報告', standard: 'GRI 305-3', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-003', name: '能源消耗統計表', standard: 'GRI 302', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-004', name: '再生能源使用紀錄', standard: 'GRI 302-1', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-005', name: '碳排放減量目標與行動計畫', standard: 'TCFD / SBTi', department: 'ESG辦公室', status: 'pending', category: 'E' },
  { id: 'E-006', name: '氣候相關風險與機會評估報告', standard: 'TCFD', department: 'ESG辦公室', status: 'pending', category: 'E' },
  { id: 'E-007', name: '用水量統計與節水措施說明', standard: 'GRI 303', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-008', name: '廢棄物管理報告', standard: 'GRI 306', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-009', name: '空氣污染排放紀錄', standard: 'GRI 305-7', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-010', name: '環境法規遵循紀錄', standard: 'GRI 307', department: '法務部', status: 'pending', category: 'E' },
  { id: 'E-011', name: '綠色採購政策與紀錄', standard: 'GRI 308', department: '採購部', status: 'pending', category: 'E' },
  { id: 'E-012', name: '碳足跡計算報告（產品/服務）', standard: 'SASB', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-013', name: '環境管理系統認證（ISO 14001）', standard: 'GRI 307', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-014', name: '氣候調適計畫說明書', standard: 'TCFD', department: 'ESG辦公室', status: 'pending', category: 'E' },
  { id: 'E-015', name: '土地使用與污染防治說明', standard: 'GRI 304', department: '環安部', status: 'pending', category: 'E' },
  { id: 'E-016', name: '生物多樣性評估報告', standard: 'GRI 304 / TNFD', department: '環安部', status: 'pending', isNew: true, category: 'E' },
  { id: 'E-017', name: 'TCFD氣候情境分析報告', standard: 'TCFD', department: 'ESG辦公室', status: 'missing', isNew: true, priority: 'high', notes: 'TCFD核心', category: 'E' },
  { id: 'E-018', name: '水資源壓力地圖', standard: 'GRI 303 / SASB', department: '環安部', status: 'pending', isNew: true, category: 'E' },

  // S - 社會面文件
  { id: 'S-001', name: '員工人數統計表（依性別/職級/地區）', standard: 'GRI 2-7', department: '人資部', status: 'pending', category: 'S' },
  { id: 'S-002', name: '薪酬結構說明書', standard: 'GRI 2-19', department: '人資部', status: 'pending', category: 'S' },
  { id: 'S-003', name: '職業安全衛生報告', standard: 'GRI 403', department: '環安部', status: 'pending', category: 'S' },
  { id: 'S-004', name: '員工訓練紀錄與時數統計', standard: 'GRI 404', department: '人資部', status: 'pending', category: 'S' },
  { id: 'S-005', name: '多元共融（DEI）政策與數據', standard: 'GRI 405', department: '人資部', status: 'pending', category: 'S' },
  { id: 'S-006', name: '員工申訴機制說明書', standard: 'GRI 2-25', department: '人資部', status: 'pending', category: 'S' },
  { id: 'S-007', name: '社區投資與公益活動報告', standard: 'GRI 413', department: 'CSR辦公室', status: 'pending', category: 'S' },
  { id: 'S-008', name: '供應商行為準則', standard: 'GRI 308/414', department: '採購部', status: 'pending', category: 'S' },
  { id: 'S-009', name: '顧客滿意度調查報告', standard: 'GRI 417', department: '行銷部', status: 'pending', category: 'S' },
  { id: 'S-010', name: '童工與強迫勞動防範聲明', standard: 'GRI 408/409', department: '法務部', status: 'pending', category: 'S' },
  { id: 'S-011', name: '員工福利項目說明書', standard: 'GRI 401', department: '人資部', status: 'pending', category: 'S' },
  { id: 'S-012', name: '職場健康促進計畫', standard: 'GRI 403-6', department: '人資部', status: 'pending', category: 'S' },
  { id: 'S-013', name: '供應商ESG評核報告', standard: 'GRI 308/414', department: '採購部', status: 'pending', isNew: true, category: 'S' },
  { id: 'S-014', name: '人權盡職調查報告', standard: 'GRI 411-414', department: '法務部', status: 'missing', isNew: true, priority: 'high', notes: 'GRI必備', category: 'S' },
  { id: 'S-015', name: '個資保護事件通報記錄', standard: 'GRI 418', department: '資訊部', status: 'pending', isNew: true, category: 'S' },

  // T - 資訊安全文件
  { id: 'T-001', name: '資訊安全政策聲明書', standard: 'SASB / 金管會', department: '資訊部', status: 'pending', category: 'T' },
  { id: 'T-002', name: '資訊安全事件通報與處理程序', standard: 'SASB', department: '資訊部', status: 'pending', category: 'T' },
  { id: 'T-003', name: '個人資料保護管理辦法', standard: 'SASB / GRI 418', department: '資訊部', status: 'pending', category: 'T' },
  { id: 'T-004', name: '系統風險評估報告', standard: 'SASB', department: '資訊部', status: 'pending', category: 'T' },
  { id: 'T-005', name: '資安認證（ISO 27001）文件', standard: 'SASB', department: '資訊部', status: 'pending', category: 'T' },
  { id: 'T-006', name: '網路安全事件統計表', standard: 'SASB', department: '資訊部', status: 'pending', category: 'T' },

  // G - 治理面文件
  { id: 'G-001', name: '反貪腐政策與訓練紀錄', standard: 'GRI 205', department: '法務部', status: 'pending', category: 'G' },
  { id: 'G-002', name: '稅務策略與透明度聲明', standard: 'GRI 207', department: '財務部', status: 'pending', category: 'G' },
  { id: 'G-003', name: '政治獻金與遊說活動說明', standard: 'GRI 415', department: '法務部', status: 'pending', category: 'G' },
  { id: 'G-004', name: '競爭行為與反壟斷政策', standard: 'GRI 206', department: '法務部', status: 'pending', category: 'G' },
  { id: 'G-005', name: '重大違規事件紀錄', standard: 'GRI 2-27', department: '法務部', status: 'pending', category: 'G' },
  { id: 'G-006', name: '風險管理架構說明書', standard: 'TCFD / GRI 2-12', department: '風控部', status: 'pending', category: 'G' },
  { id: 'G-007', name: '高階主管薪酬連結ESG說明', standard: 'GRI 2-19', department: '董事會', status: 'pending', category: 'G' },
  { id: 'G-008', name: '董事會多元化政策', standard: 'GRI 2-10', department: '董事會', status: 'pending', category: 'G' },
  { id: 'G-009', name: '內部稽核報告摘要', standard: 'GRI 2-12', department: '稽核部', status: 'pending', category: 'G' },
  { id: 'G-010', name: '吹哨者保護政策', standard: 'GRI 2-25', department: '法務部', status: 'pending', category: 'G' },
  { id: 'G-011', name: '關係人交易揭露說明', standard: 'GRI 2-26', department: '財務部', status: 'pending', category: 'G' },
  { id: 'G-012', name: '永續發展策略藍圖', standard: 'GRI 2-23', department: 'ESG辦公室', status: 'pending', category: 'G' },
  { id: 'G-013', name: 'ESG KPI目標設定與追蹤表', standard: '金管會', department: 'ESG辦公室', status: 'pending', category: 'G' },
  { id: 'G-014', name: '董事會ESG審議紀錄', standard: '金管會', department: '董事會', status: 'pending', category: 'G' },
  { id: 'G-015', name: '永續委員會議事錄', standard: '金管會', department: 'ESG辦公室', status: 'missing', isNew: true, priority: 'high', notes: '金管會強制', category: 'G' },
  { id: 'G-016', name: '重大性評估複核簽呈', standard: 'GRI 3-1/3-2', department: 'ESG辦公室', status: 'pending', isNew: true, category: 'G' },
  { id: 'G-017', name: '股東會決議摘要', standard: 'GRI 2-10', department: '董事會', status: 'pending', isNew: true, category: 'G' },
];

export const categoryMeta = {
  D: { label: '基礎治理', color: '#003262', bg: '#e8f0f7', emoji: '🏛️' },
  E: { label: '環境面', color: '#2d6a4f', bg: '#e8f5e9', emoji: '🌿' },
  S: { label: '社會面', color: '#8b4513', bg: '#fdf3e7', emoji: '👥' },
  T: { label: '資訊安全', color: '#1a237e', bg: '#e8eaf6', emoji: '🔐' },
  G: { label: '治理面', color: '#4a148c', bg: '#f3e5f5', emoji: '⚖️' },
};

export const statusMeta: Record<DocStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending:      { label: '待填報', color: '#6b7280', bg: '#f3f4f6', icon: '○' },
  completed:    { label: '已完成', color: '#16a34a', bg: '#dcfce7', icon: '✅' },
  in_progress:  { label: '進行中', color: '#2563eb', bg: '#dbeafe', icon: '🔄' },
  missing:      { label: '缺漏', color: '#dc2626', bg: '#fee2e2', icon: '❌' },
  needs_update: { label: '需更新', color: '#d97706', bg: '#fef3c7', icon: '⚠️' },
};