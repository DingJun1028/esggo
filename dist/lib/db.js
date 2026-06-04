import { listAllTasks, upsertTask } from '@dataconnect/generated';
import { dcGetReportById } from './dataconnect-services';
export { listAllTasks, upsertTask, dcGetReportById };
import { db } from './firebase';
import { collection } from 'firebase/firestore';
import { isDemoMode } from './firebase';
import { getDemoData, MOCK_ENVIRONMENTAL, MOCK_TASKS, MOCK_AUDIT } from './demo-data';
const DEFAULT_COMPANY_ID = '00000000-0000-0000-0000-000000000000';
// ==========================================
// Stub Functions (for missing DataConnect operations)
// ==========================================
const listAuditRecords = async () => ({ data: { auditRecords: [] } });
const listScrapedArticles = async () => ({ data: { scrapedArticles: [] } });
const listRoadmapMilestones = async () => ({ data: { roadmapMilestones: [] } });
const listReports = async () => ({ data: { reports: [] } });
const listCompanyMetrics = async (_args) => ({ data: { companyMetrics: [] } });
// ==========================================
// ESG Metrics (Migrated to Data Connect)
// ==========================================
export const getGovernanceMetrics = async (ownerId) => {
    if (isDemoMode)
        return getDemoData('gov', []);
    const { data } = await listCompanyMetrics({ companyId: DEFAULT_COMPANY_ID });
    return (data?.companyMetrics || []).filter(m => m.category === 'G' || m.category === 'Governance');
};
export const getSocialMetrics = async (ownerId) => {
    if (isDemoMode)
        return getDemoData('soc', []);
    const { data } = await listCompanyMetrics({ companyId: DEFAULT_COMPANY_ID });
    return (data?.companyMetrics || []).filter(m => m.category === 'S' || m.category === 'Social');
};
export const getEnvironmentalData = async (activeCategory) => {
    if (isDemoMode) {
        const all = await getDemoData('env', MOCK_ENVIRONMENTAL);
        return activeCategory ? all.filter(m => m.category === activeCategory) : all;
    }
    const { data } = await listCompanyMetrics({ companyId: DEFAULT_COMPANY_ID });
    const metrics = (data?.companyMetrics || []).filter(m => m.category === 'E' || m.category === 'Environmental' || m.category === activeCategory);
    return metrics;
};
export const upsertEnvironmentalData = async (data) => true;
export const deleteEnvironmentalData = async (id) => true;
// ==========================================
// Tasks & Logs (Migrated to Data Connect)
// ==========================================
export const getTasks = async (ownerId) => {
    if (isDemoMode)
        return getDemoData('tasks', MOCK_TASKS);
    const { data } = await listAllTasks();
    return data?.tasks || [];
};
export const getAuditLogs = async (ownerId) => {
    if (isDemoMode)
        return getDemoData('audit', MOCK_AUDIT);
    const { data } = await listAuditRecords();
    return data?.auditRecords || [];
};
export const getRoadmapMilestones = async () => {
    if (isDemoMode)
        return [];
    const { data } = await listRoadmapMilestones();
    return data?.roadmapMilestones || [];
};
export const logAudit = async (record) => {
    // Logic for logging audit is handled via specific mutations if needed
    return true;
};
export const getDashboardStats = async (ownerId) => {
    if (isDemoMode)
        return { complianceRate: 78, griCoverage: 67, totalEvidence: 42, carbonEmissions: 1247 };
    return { complianceRate: 0, griCoverage: 0, totalEvidence: 0 };
};
// ==========================================
// Evidence & Other
// ==========================================
export const getEvidenceFiles = async () => {
    if (isDemoMode) {
        return [
            { id: 'ev_1', file_name: '2023_Electricity_Bill.pdf', gri_reference: 'GRI 302-1', hash_lock: 'sha256:bill_hash_123', dataType: 'EVIDENCE' },
            { id: 'ev_2', file_name: 'ISO_14064_Report.pdf', gri_reference: 'GRI 305-1', hash_lock: 'sha256:iso_hash_456', dataType: 'EVIDENCE' }
        ];
    }
    const { data } = await listAuditRecords();
    return (data?.auditRecords || []).filter(r => r.dataType === 'EVIDENCE');
};
export const getReadingRoomReports = async () => {
    const { data } = await listScrapedArticles();
    return data?.scrapedArticles || [];
};
export const secureHash = async (data) => {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
export const sealRecord = async (data, ownerId) => {
    const hash = await secureHash(data);
    await logAudit({
        action: 'SEAL_RECORD',
        hash_lock: hash,
        ownerId,
        timestamp: new Date().toISOString(),
        details: '5T Integrity Seal applied',
    });
    return hash;
};
export const saveAdvisorySession = async (session, p2) => true;
export const getAdvisorySession = async (ownerId) => null;
export const upsertRoadmapMilestone = async (data) => data;
export const updateMilestoneStatus = async (id, status) => true;
export const globalSearch = async (query) => [];
// ==========================================
// Legacy Reports Ref (for remaining components)
// ==========================================
export const reportsRef = collection(db, 'reports');
export const getReportsByOwner = async (ownerId) => {
    const { data } = await listReports();
    return data?.reports || [];
};
export const getReport = async (id) => {
    return await dcGetReportById(id);
};
export const createReport = async (data) => 'dummy_id';
export const updateReportStatus = async (id, status) => true;
export const evidenceRef = collection(db, 'vault_evidence');
export const getEvidenceForReport = async (reportId) => [];
export const addEvidence = async (data) => 'dummy_id';
export const signaturesRef = collection(db, 'signatures');
export const getSignaturesForEvidence = async (evidenceId) => [];
export const addSignature = async (data) => 'dummy_id';
//# sourceMappingURL=db.js.map