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
} from '@dataconnect/generated';
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
  createdAt: any;
  updatedAt: any;
}

export interface VaultEvidence {
  id?: string;
  reportId: string;
  fileName: string;
  fileUrl: string;
  hashLock: string; // ZKP hash_lock from Omni-Core
  uploadedAt: any;
}

export interface Signature {
  id?: string;
  evidenceId: string;
  signerId: string;
  signature: string; // 5T signature
  timestamp: any;
}

export interface GovernanceMetric { id?: string; [key: string]: any; }
export interface Task { id?: string; [key: string]: any; }
export interface EvidenceFile { id?: string; [key: string]: any; }
export interface AuditRecord { id?: string; [key: string]: any; }
export interface AdvisoryMessage { id?: string; [key: string]: any; }
export interface EnvironmentalMetric { id?: string; [key: string]: any; }
export interface RoadmapMilestone { id?: string; [key: string]: any; }
export interface SocialMetric { id?: string; [key: string]: any; }

const DEFAULT_COMPANY_ID = '00000000-0000-0000-0000-000000000000';

// ==========================================
// ESG Metrics (Migrated to Data Connect)
// ==========================================

export const getGovernanceMetrics = async (ownerId?: any): Promise<any> => {
  if (isDemoMode) return getDemoData('gov', []);
  const { data } = await listCompanyMetrics({ companyId: DEFAULT_COMPANY_ID });
  return (data?.companyMetrics || []).filter(m => m.category === 'G' || m.category === 'Governance');
};

export const getSocialMetrics = async (ownerId?: any): Promise<any> => {
  if (isDemoMode) return getDemoData('soc', []);
  const { data } = await listCompanyMetrics({ companyId: DEFAULT_COMPANY_ID });
  return (data?.companyMetrics || []).filter(m => m.category === 'S' || m.category === 'Social');
};

export const getEnvironmentalData = async (activeCategory?: any): Promise<any> => {
  if (isDemoMode) {
    const all = await getDemoData('env', MOCK_ENVIRONMENTAL);
    return activeCategory ? all.filter(m => m.category === activeCategory) : all;
  }
  const { data } = await listCompanyMetrics({ companyId: DEFAULT_COMPANY_ID });
  const metrics = (data?.companyMetrics || []).filter(m => m.category === 'E' || m.category === 'Environmental' || m.category === activeCategory);
  return metrics;
};

export const upsertEnvironmentalData = async (data: any): Promise<any> => true;
export const deleteEnvironmentalData = async (id: any): Promise<any> => true;

// ==========================================
// Tasks & Logs (Migrated to Data Connect)
// ==========================================

export const getTasks = async (ownerId?: any): Promise<any> => {
  if (isDemoMode) return getDemoData('tasks', MOCK_TASKS);
  const { data } = await listAllTasks();
  return data?.tasks || [];
};

export const getAuditLogs = async (ownerId?: any): Promise<any> => {
  if (isDemoMode) return getDemoData('audit', MOCK_AUDIT);
  const { data } = await listAuditRecords();
  return data?.auditRecords || [];
};

export const getRoadmapMilestones = async (): Promise<any> => {
  if (isDemoMode) return [];
  const { data } = await listRoadmapMilestones();
  return data?.roadmapMilestones || [];
};

export const logAudit = async (record: any): Promise<any> => {
  // Logic for logging audit is handled via specific mutations if needed
  return true;
};

export const getDashboardStats = async (ownerId?: any): Promise<any> => {
  if (isDemoMode) return { complianceRate: 78, griCoverage: 67, totalEvidence: 42, carbonEmissions: 1247 };
  return { complianceRate: 0, griCoverage: 0, totalEvidence: 0 };
};

// ==========================================
// Evidence & Other
// ==========================================

export const getEvidenceFiles = async (): Promise<any> => {
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

export const secureHash = async (data: any): Promise<string> => {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const saveAdvisorySession = async (session: any, p2?: any): Promise<any> => true;
export const getAdvisorySession = async (ownerId: any): Promise<any> => null;

export const upsertRoadmapMilestone = async (data: any): Promise<any> => data as any;
export const updateMilestoneStatus = async (id: any, status: any): Promise<any> => true;
export const globalSearch = async (query: any): Promise<any> => [];

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

export const createReport = async (data: any) => 'dummy_id';
export const updateReportStatus = async (id: string, status: any) => true;

export const evidenceRef = collection(db, 'vault_evidence');
export const getEvidenceForReport = async (reportId: string) => [];
export const addEvidence = async (data: any) => 'dummy_id';

export const signaturesRef = collection(db, 'signatures');
export const getSignaturesForEvidence = async (evidenceId: string) => [];
export const addSignature = async (data: any) => 'dummy_id';
