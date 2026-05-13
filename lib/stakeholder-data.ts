/**
 * ESG GO | Stakeholder Engagement Data Model
 */

export interface StakeholderGroup {
  id: string;
  name: string;
  engagementScore: number; // 0-100
  sentiment: 'Positive' | 'Neutral' | 'Mixed';
  frequency: string;
  keyIssues: string[];
  lastEngaged: string;
}

export const stakeholderGroups: StakeholderGroup[] = [
  { 
    id: 'SH-01', 
    name: '員工 Employees', 
    engagementScore: 92, 
    sentiment: 'Positive', 
    frequency: 'Monthly Survey', 
    keyIssues: ['薪酬福利', '職安健康', '職涯發展'],
    lastEngaged: '2025-04-15'
  },
  { 
    id: 'SH-02', 
    name: '投資人 Investors', 
    engagementScore: 85, 
    sentiment: 'Neutral', 
    frequency: 'Quarterly Call', 
    keyIssues: ['氣候風險', '財務回報', '治理透明度'],
    lastEngaged: '2025-03-30'
  },
  { 
    id: 'SH-03', 
    name: '供應商 Suppliers', 
    engagementScore: 74, 
    sentiment: 'Mixed', 
    frequency: 'Annual Audit', 
    keyIssues: ['供應鏈韌性', '人權準則', '付款條件'],
    lastEngaged: '2025-02-12'
  },
  { 
    id: 'SH-04', 
    name: '客戶 Customers', 
    engagementScore: 88, 
    sentiment: 'Positive', 
    frequency: 'Daily Feedback', 
    keyIssues: ['產品安全', '個資隱私', '綠色包裝'],
    lastEngaged: '2025-04-28'
  }
];