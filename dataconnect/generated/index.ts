/**
 * @dataconnect/generated — Stub Module
 * 
 * This is a placeholder for the Firebase Data Connect SDK generated types.
 * Replace with actual generated code once `firebase dataconnect:sdk:generate` is run.
 */

export interface Task {
  id: string;
  [key: string]: unknown;
}

export interface Report {
  id: string;
  [key: string]: unknown;
}

export interface ReportSection {
  id: string;
  [key: string]: unknown;
}

export interface CompanyMetric {
  id: string;
  [key: string]: unknown;
}

export interface EternalMemory {
  id: string;
  [key: string]: unknown;
}

export interface AuditRecord {
  id: string;
  [key: string]: unknown;
}

export interface SwarmAgentTask {
  id: string;
  [key: string]: unknown;
}

export interface RegulatoryPolicy {
  id: string;
  [key: string]: unknown;
}

export interface RoadmapMilestone {
  id: string;
  [key: string]: unknown;
}

export interface ScrapedArticle {
  id: string;
  [key: string]: unknown;
}

export interface CompanyProfile {
  id: string;
  [key: string]: unknown;
}

export function listAllTasks(dc: any, _options?: unknown): Promise<{ data: { tasks: Task[] } }>;
export function listAllTasks(options?: unknown): Promise<{ data: { tasks: Task[] } }>;
export function listAllTasks(_dcOrOpts?: unknown, _options?: unknown): Promise<{ data: { tasks: Task[] } }> {
  return Promise.resolve({ data: { tasks: [] } });
}

export function upsertTask(dc: any, _vars: Record<string, unknown>): Promise<{ data: Task_Key }>;
export function upsertTask(_vars: Record<string, unknown>): Promise<{ data: Task_Key }>;
export function upsertTask(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: Task_Key }> {
  return Promise.resolve({ data: { id: 'sim-task-id' } });
}

export function getReportById(dc: any, _vars: { id: string }): Promise<{ data: { report: Report | null } }>;
export function getReportById(_vars: { id: string }): Promise<{ data: { report: Report | null } }>;
export function getReportById(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { report: Report | null } }> {
  return Promise.resolve({ data: { report: null } });
}

export function upsertScrapedArticle(dc: any, _vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertScrapedArticle(_vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertScrapedArticle(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: unknown }> {
  return Promise.resolve({ data: null });
}

export function insertAuditRecord(dc: any, _vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function insertAuditRecord(_vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function insertAuditRecord(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: unknown }> {
  return Promise.resolve({ data: null });
}

export function listRoadmapMilestones(dc: any, _vars: Record<string, unknown>): Promise<{ data: { roadmapMilestones: RoadmapMilestone[] } }>;
export function listRoadmapMilestones(_vars: Record<string, unknown>): Promise<{ data: { roadmapMilestones: RoadmapMilestone[] } }>;
export function listRoadmapMilestones(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { roadmapMilestones: RoadmapMilestone[] } }> {
  return Promise.resolve({ data: { roadmapMilestones: [] } });
}

export function upsertRoadmapMilestone(dc: any, _vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertRoadmapMilestone(_vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertRoadmapMilestone(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: unknown }> {
  return Promise.resolve({ data: null });
}

export function getCompanyProfile(dc: any, _vars: Record<string, unknown>): Promise<{ data: { companyProfile: CompanyProfile | null } }>;
export function getCompanyProfile(_vars: Record<string, unknown>): Promise<{ data: { companyProfile: CompanyProfile | null } }>;
export function getCompanyProfile(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { companyProfile: CompanyProfile | null } }> {
  return Promise.resolve({ data: { companyProfile: null } });
}

export function upsertCompanyProfile(dc: any, _vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertCompanyProfile(_vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertCompanyProfile(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: unknown }> {
  return Promise.resolve({ data: null });
}

export function upsertReport(dc: any, _vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertReport(_vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertReport(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: unknown }> {
  return Promise.resolve({ data: null });
}

export function listSwarmAgentTasks(dc: any, _vars: Record<string, unknown>): Promise<{ data: { swarmAgentTasks: SwarmAgentTask[] } }>;
export function listSwarmAgentTasks(_vars: Record<string, unknown>): Promise<{ data: { swarmAgentTasks: SwarmAgentTask[] } }>;
export function listSwarmAgentTasks(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { swarmAgentTasks: SwarmAgentTask[] } }> {
  return Promise.resolve({ data: { swarmAgentTasks: [] } });
}

export function upsertSwarmAgentTask(dc: any, _vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertSwarmAgentTask(_vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertSwarmAgentTask(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: unknown }> {
  return Promise.resolve({ data: null });
}

export function listRegulatoryPolicies(dc: any, _vars: Record<string, unknown>): Promise<{ data: { regulatoryPolicies: RegulatoryPolicy[] } }>;
export function listRegulatoryPolicies(_vars: Record<string, unknown>): Promise<{ data: { regulatoryPolicies: RegulatoryPolicy[] } }>;
export function listRegulatoryPolicies(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { regulatoryPolicies: RegulatoryPolicy[] } }> {
  return Promise.resolve({ data: { regulatoryPolicies: [] } });
}

export function listReports(dc: any, _vars: Record<string, unknown>): Promise<{ data: { reports: Report[] } }>;
export function listReports(_vars: Record<string, unknown>): Promise<{ data: { reports: Report[] } }>;
export function listReports(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { reports: Report[] } }> {
  return Promise.resolve({ data: { reports: [] } });
}

export function listScrapedArticles(dc: any, _vars: Record<string, unknown>): Promise<{ data: { scrapedArticles: ScrapedArticle[] } }>;
export function listScrapedArticles(_vars: Record<string, unknown>): Promise<{ data: { scrapedArticles: ScrapedArticle[] } }>;
export function listScrapedArticles(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { scrapedArticles: ScrapedArticle[] } }> {
  return Promise.resolve({ data: { scrapedArticles: [] } });
}

export function listAuditRecords(dc: any, _vars: Record<string, unknown>): Promise<{ data: { auditRecords: AuditRecord[] } }>;
export function listAuditRecords(_vars: Record<string, unknown>): Promise<{ data: { auditRecords: AuditRecord[] } }>;
export function listAuditRecords(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { auditRecords: AuditRecord[] } }> {
  return Promise.resolve({ data: { auditRecords: [] } });
}

export function upsertCompanyMetric(dc: any, _vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertCompanyMetric(_vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function upsertCompanyMetric(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: unknown }> {
  return Promise.resolve({ data: null });
}

export function listCompanyMetrics(dc: any, _vars: Record<string, unknown>): Promise<{ data: { companyMetrics: CompanyMetric[] } }>;
export function listCompanyMetrics(_vars: Record<string, unknown>): Promise<{ data: { companyMetrics: CompanyMetric[] } }>;
export function listCompanyMetrics(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { companyMetrics: CompanyMetric[] } }> {
  return Promise.resolve({ data: { companyMetrics: [] } });
}

export function insertEternalMemory(dc: any, _vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function insertEternalMemory(_vars: Record<string, unknown>): Promise<{ data: unknown }>;
export function insertEternalMemory(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: unknown }> {
  return Promise.resolve({ data: null });
}

export function listEternalMemoriesByCompany(dc: any, _vars: Record<string, unknown>): Promise<{ data: { eternalMemories: EternalMemory[] } }>;
export function listEternalMemoriesByCompany(_vars: Record<string, unknown>): Promise<{ data: { eternalMemories: EternalMemory[] } }>;
export function listEternalMemoriesByCompany(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { eternalMemories: EternalMemory[] } }> {
  return Promise.resolve({ data: { eternalMemories: [] } });
}

export function listEternalMemories(dc: any, _vars: Record<string, unknown>): Promise<{ data: { eternalMemories: EternalMemory[] } }>;
export function listEternalMemories(_vars: Record<string, unknown>): Promise<{ data: { eternalMemories: EternalMemory[] } }>;
export function listEternalMemories(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { eternalMemories: EternalMemory[] } }> {
  return Promise.resolve({ data: { eternalMemories: [] } });
}

export function getReportByCompany(dc: any, _vars: Record<string, unknown>): Promise<{ data: { report: Report | null, reports?: Report[] } }>;
export function getReportByCompany(_vars: Record<string, unknown>): Promise<{ data: { report: Report | null, reports?: Report[] } }>;
export function getReportByCompany(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { report: Report | null, reports?: Report[] } }> {
  return Promise.resolve({ data: { report: null, reports: [] } });
}

export function upsertReportSection(dc: any, _vars: Record<string, unknown>): Promise<{ data: ReportSection_Key }>;
export function upsertReportSection(_vars: Record<string, unknown>): Promise<{ data: ReportSection_Key }>;
export function upsertReportSection(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: ReportSection_Key }> {
  return Promise.resolve({ data: { id: 'sim-section-id' } });
}

export function listReportSectionsByReport(dc: any, _vars: Record<string, unknown>): Promise<{ data: { reportSections: ReportSection[] } }>;
export function listReportSectionsByReport(_vars: Record<string, unknown>): Promise<{ data: { reportSections: ReportSection[] } }>;
export function listReportSectionsByReport(_dcOrVars: unknown, _vars?: unknown): Promise<{ data: { reportSections: ReportSection[] } }> {
  return Promise.resolve({ data: { reportSections: [] } });
}

export interface Task_Key {
  id: string;
  __typename?: 'Task_Key';
}

export interface ReportSection_Key {
  id: string;
  __typename?: 'ReportSection_Key';
}

export interface Report_Key {
  id: string;
  __typename?: 'Report_Key';
}
