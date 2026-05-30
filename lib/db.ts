import { 
  listCompanyMetrics, 
  upsertCompanyMetric,
  listReports,
  listReportSectionsByReport,
  listAuditRecords,
  listRoadmapMilestones,
  listScrapedArticles,
  listAllTasks,
  upsertTask
} from '@dataconnect/generated';

export { 
  listCompanyMetrics, 
  upsertCompanyMetric,
  listReports,
  listReportSectionsByReport,
  listAuditRecords,
  listRoadmapMilestones,
  listScrapedArticles,
  listAllTasks,
  upsertTask
};
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { isDemoMode } from './firebase';
import { getDemoData, MOCK_ENVIRONMENTAL, MOCK_TASKS, MOCK_AUDIT } from './demo-data';

// ==========================================
// Types
// ==========================================

export interface Report {
  id?: string;
  title: string;
  status: 'draft' | 'verified' | 'error' | 'warning';
  ownerId: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface VaultEvidence {
  id?: string;
  reportId: string;
  fileName: string;
  fileUrl: string;
  hashLock: string; // ZKP hash_lock from Omni-Core
  uploadedAt: unknown;
}

export interface Signature {
  id?: string;
  evidenceId: string;
  signerId: string;
  signature: string; // 5T signature
  timestamp: unknown;
}

export interface GovernanceMetric { id?: string; [key: string]: unknown; }
export interface Task { id?: string; [key: string]: unknown; }
export interface EvidenceFile { id?: string; [key: string]: unknown; }
export interface AuditRecord { id?: string; [key: string]: unknown; }
export interface AdvisoryMessage { id?: string; [key: string]: unknown; }
export interface EnvironmentalMetric { id?: string; [key: string]: unknown; }
export interface RoadmapMilestone { id?: string; [key: string]: unknown; }
export interface SocialMetric { id?: string; [key: string]: unknown; }

const DEFAULT_COMPANY_ID = '00000000-0000-0000-0000-000000000000';

// ==========================================
// ESG Metrics (Migrated to Data Connect)
// ==========================================

export const getGovernanceMetrics = async (ownerId?: unknown): Promise<any> => {
  if (isDemoMode) return getDemoData('gov', []);
  const { data } = await listCompanyMetrics({ companyId: DEFAULT_COMPANY_ID });
  return (data?.companyMetrics || []).filter(m => m.category === 'G' || m.category === 'Governance');
};

export const getSocialMetrics = async (ownerId?: unknown): Promise<any> => {
  if (isDemoMode) return getDemoData('soc', []);
  const { data } = await listCompanyMetrics({ companyId: DEFAULT_COMPANY_ID });
  return (data?.companyMetrics || []).filter(m => m.category === 'S' || m.category === 'Social');
};

export const getEnvironmentalData = async (activeCategory?: unknown): Promise<any> => {
  if (isDemoMode) {
    const all = await getDemoData('env', MOCK_ENVIRONMENTAL);
    return activeCategory ? all.filter(m => m.category === activeCategory) : all;
  }
  const { data } = await listCompanyMetrics({ companyId: DEFAULT_COMPANY_ID });
  const metrics = (data?.companyMetrics || []).filter(m => m.category === 'E' || m.category === 'Environmental' || m.category === activeCategory);
  return metrics;
};

export const upsertEnvironmentalData = async (data: unknown): Promise<any> => true;
export const deleteEnvironmentalData = async (id: unknown): Promise<any> => true;

// ==========================================
// Tasks & Logs (Migrated to Data Connect)
// ==========================================

export const getTasks = async (ownerId?: unknown): Promise<any> => {
  if (isDemoMode) return getDemoData('tasks', MOCK_TASKS);
  const { data } = await listAllTasks();
  return data?.tasks || [];
};

export const getAuditLogs = async (ownerId?: unknown): Promise<any> => {
  if (isDemoMode) return getDemoData('audit', MOCK_AUDIT);
  const { data } = await listAuditRecords();
  return data?.auditRecords || [];
};

export const getRoadmapMilestones = async (): Promise<any> => {
  if (isDemoMode) return [];
  const { data } = await listRoadmapMilestones();
  return data?.roadmapMilestones || [];
};

export const logAudit = async (record: unknown): Promise<any> => {
  // Logic for logging audit is handled via specific mutations if needed
  return true;
};

export const getDashboardStats = async (ownerId?: unknown): Promise<any> => {
  if (isDemoMode) return { complianceRate: 78, griCoverage: 67, totalEvidence: 42, carbonEmissions: 1247 };
  return { complianceRate: 0, griCoverage: 0, totalEvidence: 0 };
};

// ==========================================
// Evidence & Other
// ==========================================

export const getEvidenceFiles = async (): Promise<any> => {
  if (isDemoMode) {
    return [
      { id: 'ev_1', file_name: '2023_Electricity_Bill.pdf', gri_reference: 'GRI 302-1', hash_lock: 'sha256:bill_hash_123', dataType: 'EVIDENCE' },
      { id: 'ev_2', file_name: 'ISO_14064_Report.pdf', gri_reference: 'GRI 305-1', hash_lock: 'sha256:iso_hash_456', dataType: 'EVIDENCE' }
    ];
  }
  const { data } = await listAuditRecords();
  return (data?.auditRecords || []).filter(r => r.dataType === 'EVIDENCE');
};

export const getReadingRoomReports = async (): Promise<any> => {
  const { data } = await listScrapedArticles();
  return data?.scrapedArticles || [];
};

export const simpleHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

export const simplehash = simpleHash;

export const secureHash = async (data: unknown): Promise<string> => {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const saveAdvisorySession = async (session: unknown, p2?: unknown): Promise<any> => true;
export const getAdvisorySession = async (ownerId: unknown): Promise<any> => null;

export const upsertRoadmapMilestone = async (data: unknown): Promise<any> => data as any;
export const updateMilestoneStatus = async (id: unknown, status: unknown): Promise<any> => true;
export const globalSearch = async (query: unknown): Promise<any> => [];

// ==========================================
// Legacy Reports Ref (for remaining components)
// ==========================================
export const reportsRef = collection(db, 'reports');

export const getReportsByOwner = async (ownerId: string) => {
  const { data } = await listReports();
  return data?.reports || [];
};

export const getReport = async (id: string) => {
  // This would need a GetReportById query in Data Connect
  return null; 
};

export const createReport = async (data: unknown) => 'dummy_id';
export const updateReportStatus = async (id: string, status: unknown) => true;

export const evidenceRef = collection(db, 'vault_evidence');
export const getEvidenceForReport = async (reportId: string) => [];
export const addEvidence = async (data: unknown) => 'dummy_id';

export const signaturesRef = collection(db, 'signatures');
export const getSignaturesForEvidence = async (evidenceId: string) => [];
export const addSignature = async (data: unknown) => 'dummy_id';
