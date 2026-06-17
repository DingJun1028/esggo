export type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export interface DataConnectEntity {
  id: string;
  [key: string]: unknown;
}

export interface EternalMemory extends DataConnectEntity {
  companyId?: string;
  userId?: string;
  title?: string;
  summary?: string;
  tags?: string[];
  payload?: Json;
  createdAt?: string;
  updatedAt?: string;
  company_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SwarmAgentTask extends DataConnectEntity {
  companyId?: string;
  type?: string;
  status?: string;
  payload?: Json;
  result?: Json;
  startedAt?: string;
  finishedAt?: string;
  company_id?: string;
  started_at?: string;
  finished_at?: string;
}

export interface RegulatoryPolicy extends DataConnectEntity {
  jurisdiction?: string;
  topic?: string;
  effectiveDate?: string;
  content?: string;
  link?: string;
  effective_date?: string;
}

export interface Report extends DataConnectEntity {
  companyId?: string;
  year?: number;
  framework?: string;
  status?: string;
  score?: number;
  company_id?: string;
}

export interface ReportSection extends DataConnectEntity {
  reportId?: string;
  chapterKey?: string;
  content?: unknown;
  order?: number;
  report_id?: string;
  chapter_key?: string;
}

export interface CompanyMetric extends DataConnectEntity {
  companyId?: string;
  metricKey?: string;
  value?: number | null;
  unit?: string;
  period?: string;
  company_id?: string;
  metric_key?: string;
}

export interface ScrapedArticle extends DataConnectEntity {
  url?: string;
  source?: string;
  title?: string;
  summary?: string;
  publishedAt?: string;
  published_at?: string;
}

export interface AuditRecord extends DataConnectEntity {
  companyId?: string;
  action?: string;
  actor?: string;
  metadata?: Json;
  company_id?: string;
}

export interface RoadmapMilestone extends DataConnectEntity {
  companyId?: string;
  title?: string;
  description?: string;
  targetYear?: number;
  category?: string;
  status?: string;
  targetValue?: number | null;
  unit?: string;
  sbtiAligned?: boolean;
  company_id?: string;
  target_year?: number;
  target_value?: number | null;
  sbti_aligned?: boolean;
}

export interface CompanyProfile extends DataConnectEntity {
  companyId?: string;
  legalName?: string;
  ticker?: string;
  industry?: string;
  headquarters?: string;
  website?: string;
  company_id?: string;
  legal_name?: string;
}

export interface DataConnectResponse<T> {
  data: {
    [K in
      | 'eternalMemories'
      | 'swarmAgentTasks'
      | 'regulatoryPolicies'
      | 'reports'
      | 'report'
      | 'scrapedArticles'
      | 'auditRecords'
      | 'tasks'
      | 'roadmapMilestones'
      | 'companyProfile'
      | 'companyMetrics']?: T extends EternalMemory[]
      ? EternalMemory[]
      : T extends SwarmAgentTask[]
      ? SwarmAgentTask[]
      : T extends RegulatoryPolicy[]
      ? RegulatoryPolicy[]
      : T extends Report[]
      ? Report[]
      : T extends Report | null
      ? Report | null
      : T extends ScrapedArticle[]
      ? ScrapedArticle[]
      : T extends AuditRecord[]
      ? AuditRecord[]
      : T extends CompanyMetric[]
      ? CompanyMetric[]
      : T extends RoadmapMilestone[]
      ? RoadmapMilestone[]
      : T extends CompanyProfile | null
      ? CompanyProfile | null
      : unknown;
  };
}
