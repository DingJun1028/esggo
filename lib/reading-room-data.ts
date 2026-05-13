/**
 * ESG GO | 永續閱覽室數據持久化邏輯 (無亂碼校準版)
 */

export interface SustainableReport {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: Date;
  tags: string[];
  type: 'Insight' | 'Alert' | 'Benchmark';
}

// 模擬內存存儲 (實際應用中應對接到 Supabase)
let reports: SustainableReport[] = [
  {
    id: '1',
    title: '2025 臺北市綠色金融政策深度觀察',
    summary: '分析最新碳費徵收標準對中小企業的財務影響預估，並提供對應的補助申請路徑。',
    source: 'Omni_Terminal AI Observer',
    timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    tags: ['政策分析', '碳費預測'],
    type: 'Insight'
  },
  {
    id: '2',
    title: '歐盟 CBAM 申報常見錯誤警示',
    summary: '彙整過去三個月內 500 家企業申報時最常被退件的數據節點，提供合規檢核清單。',
    source: 'VerifyLink™ Audit System',
    timestamp: new Date(Date.now() - 86400000 * 1), // 1 day ago
    tags: ['CBAM', '合規警告'],
    type: 'Alert'
  }
];

export const getReports = () => {
  return [...reports].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const addReport = (report: Omit<SustainableReport, 'id' | 'timestamp'>) => {
  const newReport: SustainableReport = {
    ...report,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };
  reports = [newReport, ...reports];
  return newReport;
};

export const getTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' 年前';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' 個月前';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' 天前';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' 小時前';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' 分鐘前';
  return '剛剛';
};
