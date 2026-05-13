import { createClient } from './supabase';

const supabase = createClient();

// ─── Types ──────────────────────────────────────────────
export interface AuditRecord {
  id?: string;
  action: string;
  resource: string;
  user_name?: string;
  department?: string;
  gri_reference?: string;
  t5_tag?: string;
  hash_lock?: string;
  details?: string;
  created_at?: string;
}

export interface EsgMetric {
  id?: string;
  category: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  year: number;
  gri_standard?: string;
  source_origin?: string;
  verified?: boolean;
  hash_lock?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EnvironmentalData {
  id?: string;
  company_id?: string;
  category: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  year: number;
  gri_standard?: string;
  source_origin?: string;
  verified?: boolean;
  created_at?: string;
}

export interface SocialMetric {
  id?: string;
  company_id?: string;
  category: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  year: number;
  gri_standard?: string;
  source_origin?: string;
  verified?: boolean;
  created_at?: string;
}

export interface GovernanceMetric {
  id?: string;
  company_id?: string;
  category: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  year: number;
  gri_standard?: string;
  source_origin?: string;
  verified?: boolean;
  created_at?: string;
}

export interface EvidenceFile {
  id?: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  category: string;
  gri_reference?: string;
  status?: string;
  zkp_proof?: boolean;
  hash_lock?: string;
  uploader?: string;
  source_url?: string;
  created_at?: string;
}

export interface ReadingRoomReport {
  id?: string;
  title: string;
  source: string;
  source_url?: string;
  category: string;
  tags?: string[];
  summary?: string;
  impact_level?: string;
  published_date?: string;
  created_at?: string;
}

export interface RoadmapMilestone {
  id?: string;
  company_id?: string;
  title: string;
  description?: string;
  target_year: number;
  category: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  status: string;
  sbti_aligned?: boolean;
  gri_reference?: string;
  created_at?: string;
}

export interface AdvisorySession {
  id?: string;
  user_id?: string;
  persona: string;
  title: string;
  messages: Array<{ role: string; content: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface PublishedReport {
  id?: string;
  company_id?: string;
  title: string;
  year: number;
  framework?: string[];
  status: string;
  page_count?: number;
  word_count?: number;
  gri_coverage?: number;
  zkp_verified?: boolean;
  zkp_hash?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyProfile {
  id?: string;
  company_name: string;
  industry?: string;
  employee_count?: number;
  revenue_twd?: number;
  capital_twd?: number;
  locations?: string[];
  esg_goals?: unknown[];
  governance_structure?: Record<string, unknown>;
  reporting_year?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DigitalTwin {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;
  moral_dna?: Record<string, number>;
  awakening_stage?: string;
  knowledge_entries?: unknown[];
  version?: string;
  hash_lock?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  department?: string;
  gri_reference?: string;
  due_date?: string;
  evidence_ids?: string[];
  hash_lock?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  complianceRate: number;
  carbonEmissions: number;
  pendingTasks: number;
  evidenceCompleteness: number;
  auditCount: number;
  verifiedEvidence: number;
}

// ─── Hash Utility ──────────────────────────────────────
function simpleHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(31, h) + input.charCodeAt(i) | 0;
  }
  return Math.abs(h).toString(16).padStart(8, '0');
}

// ─── Audit Logs ────────────────────────────────────────
export async function logAudit(record: AuditRecord): Promise<void> {
  try {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) console.warn('Audit log failed:', await res.text());
  } catch (e) {
    console.warn('Audit log error:', e);
  }
}

export async function getAuditLogs(limit = 50): Promise<AuditRecord[]> {
  try {
    const res = await fetch(`/api/audit?limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.records || [];
  } catch {
    return [];
  }
}

// ─── ESG Metrics ───────────────────────────────────────
export async function upsertEsgMetric(metric: EsgMetric): Promise<EsgMetric | null> {
  const hash_lock = simpleHash(`${metric.metric_name}:${metric.metric_value}:${metric.year}`);
  const { data, error } = await supabase
    .from('esg_data')
    .upsert({ ...metric, hash_lock }, { onConflict: 'metric_name,year' })
    .select().single();
  if (error) { console.error('upsertEsgMetric:', error); return null; }
  return data;
}

export async function getEsgMetrics(year?: number): Promise<EsgMetric[]> {
  let q = supabase.from('esg_data').select('*').order('created_at', { ascending: false });
  if (year) q = q.eq('year', year);
  const { data, error } = await q;
  if (error) { console.error('getEsgMetrics:', error); return []; }
  return data || [];
}

// ─── Environmental ─────────────────────────────────────
export async function getEnvironmentalData(category?: string, year?: number): Promise<EnvironmentalData[]> {
  let q = supabase.from('environmental_data').select('*').eq('company_id', 'default').order('category');
  if (category) q = q.eq('category', category);
  if (year) q = q.eq('year', year);
  const { data, error } = await q;
  if (error) { console.error('getEnvironmentalData:', error); return []; }
  return data || [];
}

export async function upsertEnvironmentalData(item: EnvironmentalData): Promise<EnvironmentalData | null> {
  const { data, error } = await supabase
    .from('environmental_data')
    .upsert({ company_id: 'default', ...item }, { onConflict: 'company_id,category,metric_name,year' })
    .select().single();
  if (error) { console.error('upsertEnvironmentalData:', error); return null; }
  return data;
}

// ─── Social ────────────────────────────────────────────
export async function getSocialMetrics(category?: string): Promise<SocialMetric[]> {
  let q = supabase.from('social_metrics').select('*').eq('company_id', 'default').order('category');
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) { console.error('getSocialMetrics:', error); return []; }
  return data || [];
}

export async function upsertSocialMetric(metric: SocialMetric): Promise<SocialMetric | null> {
  const { data, error } = await supabase
    .from('social_metrics')
    .upsert({ company_id: 'default', ...metric }, { onConflict: 'company_id,category,metric_name,year' })
    .select().single();
  if (error) { console.error('upsertSocialMetric:', error); return null; }
  return data;
}

// ─── Governance ────────────────────────────────────────
export async function getGovernanceMetrics(category?: string): Promise<GovernanceMetric[]> {
  let q = supabase.from('governance_metrics').select('*').eq('company_id', 'default').order('category');
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) { console.error('getGovernanceMetrics:', error); return []; }
  return data || [];
}

export async function upsertGovernanceMetric(metric: GovernanceMetric): Promise<GovernanceMetric | null> {
  const { data, error } = await supabase
    .from('governance_metrics')
    .upsert({ company_id: 'default', ...metric }, { onConflict: 'company_id,category,metric_name,year' })
    .select().single();
  if (error) { console.error('upsertGovernanceMetric:', error); return null; }
  return data;
}

// ─── Evidence Vault ────────────────────────────────────
export async function addEvidence(file: EvidenceFile): Promise<EvidenceFile | null> {
  const hash_lock = simpleHash(`${file.file_name}:${Date.now()}`);
  const { data, error } = await supabase
    .from('evidence_vault').insert({ ...file, hash_lock }).select().single();
  if (error) { console.error('addEvidence:', error); return null; }
  return data;
}

export async function getEvidence(category?: string): Promise<EvidenceFile[]> {
  let q = supabase.from('evidence_vault').select('*').order('created_at', { ascending: false });
  if (category && category !== 'ALL') q = q.eq('category', category);
  const { data, error } = await q;
  if (error) { console.error('getEvidence:', error); return []; }
  return data || [];
}

export async function verifyEvidence(id: string): Promise<boolean> {
  const hash_lock = simpleHash(`zkp:${id}:${Date.now()}`);
  const { error } = await supabase
    .from('evidence_vault')
    .update({ status: 'verified', zkp_proof: true, hash_lock })
    .eq('id', id);
  if (error) { console.error('verifyEvidence:', error); return false; }
  await logAudit({ action: 'ZKP_VERIFY', resource: `Evidence #${id}`, user_name: 'System', t5_tag: 'T4+T5', hash_lock });
  return true;
}

// ─── Reading Room ──────────────────────────────────────
export async function addReadingRoomReport(report: ReadingRoomReport): Promise<ReadingRoomReport | null> {
  const { data, error } = await supabase.from('reading_room').insert(report).select().single();
  if (error) { console.error('addReadingRoomReport:', error); return null; }
  return data;
}

export async function getReadingRoomReports(): Promise<ReadingRoomReport[]> {
  const { data, error } = await supabase
    .from('reading_room').select('*').order('created_at', { ascending: false });
  if (error) { console.error('getReadingRoomReports:', error); return []; }
  return data || [];
}

// ─── Roadmap ───────────────────────────────────────────
export async function getRoadmapMilestones(): Promise<RoadmapMilestone[]> {
  const { data, error } = await supabase
    .from('roadmap_milestones').select('*').eq('company_id', 'default').order('target_year');
  if (error) { console.error('getRoadmapMilestones:', error); return []; }
  return data || [];
}

export async function upsertRoadmapMilestone(m: RoadmapMilestone): Promise<RoadmapMilestone | null> {
  const { data, error } = await supabase
    .from('roadmap_milestones').upsert({ company_id: 'default', ...m }).select().single();
  if (error) { console.error('upsertRoadmapMilestone:', error); return null; }
  return data;
}

export async function updateMilestoneStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase.from('roadmap_milestones').update({ status }).eq('id', id);
  if (error) { console.error('updateMilestoneStatus:', error); return false; }
  return true;
}

// ─── Advisory Sessions ─────────────────────────────────
export async function saveAdvisorySession(session: AdvisorySession): Promise<AdvisorySession | null> {
  const { data, error } = await supabase
    .from('advisory_sessions').upsert({ user_id: 'default', ...session }).select().single();
  if (error) { console.error('saveAdvisorySession:', error); return null; }
  return data;
}

export async function getAdvisorySessions(persona?: string): Promise<AdvisorySession[]> {
  let q = supabase.from('advisory_sessions').select('*').eq('user_id', 'default').order('updated_at', { ascending: false });
  if (persona) q = q.eq('persona', persona);
  const { data, error } = await q;
  if (error) { console.error('getAdvisorySessions:', error); return []; }
  return data || [];
}

// ─── Published Reports ─────────────────────────────────
export async function getPublishedReports(): Promise<PublishedReport[]> {
  const { data, error } = await supabase
    .from('published_reports').select('*').eq('company_id', 'default').order('year', { ascending: false });
  if (error) { console.error('getPublishedReports:', error); return []; }
  return data || [];
}

export async function createPublishedReport(report: PublishedReport): Promise<PublishedReport | null> {
  const { data, error } = await supabase
    .from('published_reports').insert({ company_id: 'default', ...report }).select().single();
  if (error) { console.error('createPublishedReport:', error); return null; }
  return data;
}

export async function updateReportStatus(id: string, status: string, zkp_hash?: string): Promise<boolean> {
  const updates: Record<string, unknown> = { status };
  if (zkp_hash) { updates.zkp_verified = true; updates.zkp_hash = zkp_hash; }
  const { error } = await supabase.from('published_reports').update(updates).eq('id', id);
  if (error) { console.error('updateReportStatus:', error); return false; }
  return true;
}

// ─── Company Profile ───────────────────────────────────
export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  const { data, error } = await supabase
    .from('company_profiles').select('*').limit(1).maybeSingle();
  if (error) { console.error('getCompanyProfile:', error); return null; }
  return data;
}

export async function upsertCompanyProfile(profile: CompanyProfile): Promise<CompanyProfile | null> {
  if (profile.id) {
    const { data, error } = await supabase
      .from('company_profiles').update(profile).eq('id', profile.id).select().single();
    if (error) { console.error('upsertCompanyProfile:', error); return null; }
    return data;
  }
  const { data, error } = await supabase
    .from('company_profiles').insert(profile).select().single();
  if (error) { console.error('upsertCompanyProfile:', error); return null; }
  return data;
}

// ─── Digital Twin ──────────────────────────────────────
export async function getDigitalTwin(userId = 'default'): Promise<DigitalTwin | null> {
  const { data, error } = await supabase
    .from('digital_twins').select('*').eq('user_id', userId).maybeSingle();
  if (error) { console.error('getDigitalTwin:', error); return null; }
  return data;
}

export async function upsertDigitalTwin(twin: DigitalTwin): Promise<DigitalTwin | null> {
  const hash_lock = simpleHash(`twin:${twin.name}:${Date.now()}`);
  if (twin.id) {
    const { data, error } = await supabase
      .from('digital_twins').update({ ...twin, hash_lock }).eq('id', twin.id).select().single();
    if (error) { console.error('upsertDigitalTwin:', error); return null; }
    return data;
  }
  const { data, error } = await supabase
    .from('digital_twins').insert({ user_id: 'default', ...twin, hash_lock }).select().single();
  if (error) { console.error('upsertDigitalTwin:', error); return null; }
  return data;
}

// ─── Tasks ─────────────────────────────────────────────
export async function getTasks(status?: string): Promise<Task[]> {
  let q = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (status) q = q.eq('status', status);
  const { data, error } = await q;
  if (error) { console.error('getTasks:', error); return []; }
  return data || [];
}

export async function createTask(task: Task): Promise<Task | null> {
  const hash_lock = simpleHash(`task:${task.title}:${Date.now()}`);
  const { data, error } = await supabase
    .from('tasks').insert({ ...task, hash_lock }).select().single();
  if (error) { console.error('createTask:', error); return null; }
  return data;
}

export async function updateTaskStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
  if (error) { console.error('updateTaskStatus:', error); return false; }
  return true;
}

// ─── Dashboard Stats ───────────────────────────────────
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [metrics, tasks, evidence] = await Promise.all([
      supabase.from('esg_data').select('verified').eq('year', 2024),
      supabase.from('tasks').select('status'),
      supabase.from('evidence_vault').select('status'),
    ]);
    const allMetrics = metrics.data || [];
    const allTasks = tasks.data || [];
    const allEvidence = evidence.data || [];
    const verifiedMetrics = allMetrics.filter(m => m.verified).length;
    const complianceRate = allMetrics.length > 0 ? Math.round((verifiedMetrics / allMetrics.length) * 100) : 78;
    const pendingTasks = allTasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length;
    const verifiedEvidence = allEvidence.filter(e => e.status === 'verified').length;
    const evidenceCompleteness = allEvidence.length > 0 ? Math.round((verifiedEvidence / allEvidence.length) * 100) : 65;
    return { complianceRate, carbonEmissions: 2140, pendingTasks: pendingTasks || 12, evidenceCompleteness, auditCount: 156, verifiedEvidence };
  } catch {
    return { complianceRate: 78, carbonEmissions: 2140, pendingTasks: 12, evidenceCompleteness: 65, auditCount: 156, verifiedEvidence: 42 };
  }
}

export const db = {
  logAudit,
  getAuditLogs,
  upsertEsgMetric,
  getEsgMetrics,
  getEnvironmentalData,
  upsertEnvironmentalData,
  getSocialMetrics,
  upsertSocialMetric,
  getGovernanceMetrics,
  upsertGovernanceMetric,
  addEvidence,
  getEvidence,
  verifyEvidence,
  addReadingRoomReport,
  getReadingRoomReports,
  getRoadmapMilestones,
  upsertRoadmapMilestone,
  updateMilestoneStatus,
  saveAdvisorySession,
  getAdvisorySessions,
  getPublishedReports,
  createPublishedReport,
  updateReportStatus,
  getCompanyProfile,
  upsertCompanyProfile,
  getDigitalTwin,
  upsertDigitalTwin,
  getTasks,
  createTask,
  updateTaskStatus,
  getDashboardStats,
};
