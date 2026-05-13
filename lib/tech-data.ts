/**
 * ESG GO | 資安與創新數據模型
 * 遵循 GRI 418 (客戶隱私) 與數位治理規範
 */

export interface SecurityIncident {
  id: string;
  type: 'Data Privacy' | 'System Breach' | 'Phishing';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Investigating' | 'Contained' | 'Resolved';
  date: string;
}

export const mockIncidents: SecurityIncident[] = [
  { id: 'SEC-2025-01', type: 'Data Privacy', severity: 'Low', status: 'Resolved', date: '2025-03-12' },
  { id: 'SEC-2025-02', type: 'Phishing', severity: 'Medium', status: 'Resolved', date: '2025-04-05' },
];

export const innovationStats = {
  greenPatents: 12,
  rdInvestment: 4500000, // TWD
  digitalTransformationScore: 88,
};