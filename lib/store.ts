'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuditRecord {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  gri: string;
  hash: string;
  status: 'verified' | 'pending' | 'flagged';
}

export interface EvidenceFile {
  id: string;
  name: string;
  type: string;
  gri: string;
  uploader: string;
  uploadDate: string;
  size: string;
  zkpStatus: 'verified' | 'pending' | 'rejected';
  hash: string;
  tags: string[];
}

export interface ESGMetric {
  id: string;
  category: 'E' | 'S' | 'G';
  name: string;
  value: number;
  unit: string;
  target: number;
  gri: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  lastUpdated: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  department: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  gri: string;
  createdAt: string;
}

export interface ReadingRoomReport {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  tags: string[];
  summary: string;
  category: string;
  griRef: string;
}

export interface CompanyProfile {
  name: string;
  industry: string;
  employees: number;
  revenue: string;
  address: string;
  reportingYear: string;
  vision: string;
  mission: string;
  esgGoals: string[];
}

interface ESGStore {
  auditRecords: AuditRecord[];
  evidenceFiles: EvidenceFile[];
  metrics: ESGMetric[];
  tasks: Task[];
  reports: ReadingRoomReport[];
  profile: CompanyProfile;
  addAuditRecord: (record: AuditRecord) => void;
  addEvidenceFile: (file: EvidenceFile) => void;
  updateEvidenceFile: (id: string, updates: Partial<EvidenceFile>) => void;
  addMetric: (metric: ESGMetric) => void;
  updateMetric: (id: string, updates: Partial<ESGMetric>) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addReport: (report: ReadingRoomReport) => void;
  updateProfile: (updates: Partial<CompanyProfile>) => void;
}

const defaultProfile: CompanyProfile = {
  name: '台灣永續科技股份有限公司',
  industry: '科技製造業',
  employees: 1250,
  revenue: 'NT$ 42億',
  address: '台北市信義區市府路1號',
  reportingYear: '2025',
  vision: '成為亞太地區最具影響力的永續科技企業',
  mission: '透過創新技術與負責任的治理，為社會與環境創造長期價值',
  esgGoals: [
    '2030年前達成碳中和',
    '再生能源使用比例提升至80%',
    '供應鏈永續評估覆蓋率達100%',
    '董事會性別多元比例達40%',
  ],
};

const defaultMetrics: ESGMetric[] = [
  { id: 'm1', category: 'E', name: '溫室氣體排放（範疇一）', value: 1250, unit: '噸CO₂e', target: 1000, gri: 'GRI 305-1', status: 'at-risk', lastUpdated: '2025-01-15' },
  { id: 'm2', category: 'E', name: '再生能源使用比例', value: 38, unit: '%', target: 50, gri: 'GRI 302-1', status: 'at-risk', lastUpdated: '2025-01-15' },
  { id: 'm3', category: 'E', name: '總用水量', value: 8500, unit: '立方公尺', target: 8000, gri: 'GRI 303-1', status: 'at-risk', lastUpdated: '2025-01-10' },
  { id: 'm4', category: 'S', name: '員工總人數', value: 1250, unit: '人', target: 1250, gri: 'GRI 2-7', status: 'on-track', lastUpdated: '2025-01-20' },
  { id: 'm5', category: 'S', name: '女性員工比例', value: 42, unit: '%', target: 45, gri: 'GRI 405-1', status: 'at-risk', lastUpdated: '2025-01-20' },
  { id: 'm6', category: 'G', name: '獨立董事比例', value: 60, unit: '%', target: 50, gri: 'GRI 2-9', status: 'on-track', lastUpdated: '2025-01-05' },
];

const defaultAuditRecords: AuditRecord[] = [
  { id: 'a1', timestamp: '2025-01-20T09:00:00Z', user: '陳建宏', action: '提交溫室氣體盤查數據', module: '環境指揮', gri: 'GRI 305-1', hash: 'sha256:a1b2c3d4', status: 'verified' },
  { id: 'a2', timestamp: '2025-01-19T14:30:00Z', user: 'VerifyLink™', action: '完成 ZKP 驗證', module: '證據金庫', gri: 'GRI 302-1', hash: 'sha256:e5f6g7h8', status: 'verified' },
  { id: 'a3', timestamp: '2025-01-18T10:15:00Z', user: '林雅婷', action: '更新員工結構數據', module: '社會影響', gri: 'GRI 2-7', hash: 'sha256:i9j0k1l2', status: 'verified' },
  { id: 'a4', timestamp: '2025-01-17T16:45:00Z', user: 'SAP ERP', action: '自動同步用電數據', module: '環境指揮', gri: 'GRI 302-1', hash: 'sha256:m3n4o5p6', status: 'pending' },
];

export const useESGStore = create<ESGStore>()(
  persist(
    (set) => ({
      auditRecords: defaultAuditRecords,
      evidenceFiles: [],
      metrics: defaultMetrics,
      tasks: [],
      reports: [],
      profile: defaultProfile,
      addAuditRecord: (record) =>
        set((state) => ({ auditRecords: [record, ...state.auditRecords] })),
      addEvidenceFile: (file) =>
        set((state) => ({ evidenceFiles: [file, ...state.evidenceFiles] })),
      updateEvidenceFile: (id, updates) =>
        set((state) => ({
          evidenceFiles: state.evidenceFiles.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),
      addMetric: (metric) =>
        set((state) => ({ metrics: [...state.metrics, metric] })),
      updateMetric: (id, updates) =>
        set((state) => ({
          metrics: state.metrics.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      addTask: (task) =>
        set((state) => ({ tasks: [task, ...state.tasks] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      addReport: (report) =>
        set((state) => ({ reports: [report, ...state.reports] })),
      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),
    }),
    { name: 'esggo-store' }
  )
);