import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface Action_Key {
  id: UUIDString;
  __typename?: 'Action_Key';
}

export interface AuditRecord_Key {
  id: UUIDString;
  __typename?: 'AuditRecord_Key';
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface ChallengeParticipation_Key {
  userUid: string;
  challengeId: UUIDString;
  __typename?: 'ChallengeParticipation_Key';
}

export interface Challenge_Key {
  id: UUIDString;
  __typename?: 'Challenge_Key';
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CompanyMetric_Key {
  id: UUIDString;
  __typename?: 'CompanyMetric_Key';
}

export interface CompanyProfile_Key {
  id: UUIDString;
  __typename?: 'CompanyProfile_Key';
}

export interface CreateDemoDataData {
  user_insertMany: User_Key[];
  comment_insertMany: Comment_Key[];
}

export interface EternalMemory_Key {
  id: UUIDString;
  __typename?: 'EternalMemory_Key';
}

export interface GetCompanyProfileData {
  companyProfile?: {
    id: UUIDString;
    name: string;
    industry?: string | null;
    headquarters?: string | null;
    vision?: string | null;
    mission?: string | null;
    employeeCount?: number | null;
    revenueTwd?: number | null;
    capitalTwd?: number | null;
    user?: {
      uid: string;
    } & User_Key;
  } & CompanyProfile_Key;
}

export interface GetCompanyProfileVariables {
  id: UUIDString;
}

export interface GetReportByIdData {
  report?: {
    id: UUIDString;
    title: string;
    progress: number;
    status: string;
    language: string;
    templateId: string;
    createdAt: TimestampString;
    company: {
      id: UUIDString;
      name: string;
      user?: {
        uid: string;
      } & User_Key;
    } & CompanyProfile_Key;
  } & Report_Key;
}

export interface GetReportByIdVariables {
  id: UUIDString;
}

export interface GetTaskByIdData {
  task?: {
    id: UUIDString;
    user: {
      uid: string;
    } & User_Key;
      title: string;
      description?: string | null;
      completed: boolean;
      status: string;
      priority: string;
      assignee?: string | null;
      department?: string | null;
      griReference?: string | null;
      dueDate?: DateString | null;
  } & Task_Key;
}

export interface GetTaskByIdVariables {
  id: UUIDString;
}

export interface IntelligenceModule_Key {
  id: string;
  __typename?: 'IntelligenceModule_Key';
}

export interface IntelligenceSource_Key {
  id: UUIDString;
  __typename?: 'IntelligenceSource_Key';
}

export interface ListAllTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    completed: boolean;
    status: string;
    priority: string;
    assignee?: string | null;
    department?: string | null;
    griReference?: string | null;
    dueDate?: DateString | null;
    createdAt: TimestampString;
  } & Task_Key)[];
}

export interface ListAuditRecordsData {
  auditRecords: ({
    id: UUIDString;
    title: string;
    dataType: string;
    source: string;
    standard?: string | null;
    description?: string | null;
    contentHash: string;
    zkpStatus: string;
    createdAt: TimestampString;
  } & AuditRecord_Key)[];
}

export interface ListCompanyMetricsByCategoryData {
  companyMetrics: ({
    id: UUIDString;
    metricName: string;
    metricValue?: number | null;
    unit?: string | null;
    category: string;
    verified: boolean;
    griStandard?: string | null;
    updatedAt: TimestampString;
  } & CompanyMetric_Key)[];
}

export interface ListCompanyMetricsByCategoryVariables {
  companyId: UUIDString;
  category: string;
}

export interface ListEternalMemoriesData {
  eternalMemories: ({
    id: UUIDString;
    type: string;
    content: string;
    tags?: string | null;
    hashLock: string;
    consolidated: boolean;
    createdAt: TimestampString;
  } & EternalMemory_Key)[];
}

export interface ListRegulatoryPoliciesData {
  regulatoryPolicies: ({
    id: string;
    standard: string;
    code: string;
    name: string;
    description?: string | null;
    rulesJson: string;
  } & RegulatoryPolicy_Key)[];
}

export interface ListReportsData {
  reports: ({
    id: UUIDString;
    title: string;
    progress: number;
    status: string;
    language: string;
    templateId: string;
    createdAt: TimestampString;
    company: {
      id: UUIDString;
      name: string;
    } & CompanyProfile_Key;
  } & Report_Key)[];
}

export interface ListRoadmapMilestonesData {
  roadmapMilestones: ({
    id: UUIDString;
    title: string;
    targetYear: number;
    category: string;
    status: string;
    targetValue?: number | null;
    unit?: string | null;
    sbtiAligned: boolean;
  } & RoadmapMilestone_Key)[];
}

export interface ListScrapedArticlesData {
  scrapedArticles: ({
    id: UUIDString;
    title: string;
    summary?: string | null;
    url: string;
    source: string;
    publishedAt?: DateString | null;
    category: string;
    tags?: string | null;
    impactLevel: string;
    scrapedAt: TimestampString;
  } & ScrapedArticle_Key)[];
}

export interface ListSwarmAgentTasksData {
  swarmAgentTasks: ({
    id: UUIDString;
    title: string;
    taskType: string;
    status: string;
    agentId?: string | null;
    progress: number;
    skillKey?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & SwarmAgentTask_Key)[];
}

export interface RegulatoryPolicy_Key {
  id: string;
  __typename?: 'RegulatoryPolicy_Key';
}

export interface ReportSection_Key {
  id: UUIDString;
  __typename?: 'ReportSection_Key';
}

export interface Report_Key {
  id: UUIDString;
  __typename?: 'Report_Key';
}

export interface RoadmapMilestone_Key {
  id: UUIDString;
  __typename?: 'RoadmapMilestone_Key';
}

export interface ScrapedArticle_Key {
  id: UUIDString;
  __typename?: 'ScrapedArticle_Key';
}

export interface SocialConnection_Key {
  followerUid: string;
  followedUid: string;
  __typename?: 'SocialConnection_Key';
}

export interface SwarmAgentTask_Key {
  id: UUIDString;
  __typename?: 'SwarmAgentTask_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpsertCompanyMetricData {
  companyMetric_upsert: CompanyMetric_Key;
}

export interface UpsertCompanyMetricVariables {
  id?: UUIDString | null;
  companyId: UUIDString;
  metricName: string;
  metricValue?: number | null;
  unit?: string | null;
  category: string;
  verified: boolean;
  griStandard?: string | null;
}

export interface UpsertCompanyProfileData {
  companyProfile_upsert: CompanyProfile_Key;
}

export interface UpsertCompanyProfileVariables {
  id?: UUIDString | null;
  name: string;
  industry?: string | null;
  vision?: string | null;
  mission?: string | null;
  employeeCount?: number | null;
  revenueTwd?: number | null;
  capitalTwd?: number | null;
}

export interface UpsertEternalMemoryData {
  eternalMemory_upsert: EternalMemory_Key;
}

export interface UpsertEternalMemoryVariables {
  id?: UUIDString | null;
  type: string;
  content: string;
  tags?: string | null;
  hashLock: string;
  consolidated: boolean;
}

export interface UpsertReportData {
  report_upsert: Report_Key;
}

export interface UpsertReportVariables {
  id?: UUIDString | null;
  companyId: UUIDString;
  templateId: string;
  title: string;
  language: string;
  progress: number;
  status: string;
}

export interface UpsertRoadmapMilestoneData {
  roadmapMilestone_upsert: RoadmapMilestone_Key;
}

export interface UpsertRoadmapMilestoneVariables {
  id?: UUIDString | null;
  title: string;
  targetYear: number;
  category: string;
  status: string;
  targetValue?: number | null;
  unit?: string | null;
  sbtiAligned: boolean;
}

export interface UpsertScrapedArticleData {
  scrapedArticle_upsert: ScrapedArticle_Key;
}

export interface UpsertScrapedArticleVariables {
  id?: UUIDString | null;
  title: string;
  summary?: string | null;
  url: string;
  source: string;
  publishedAt?: DateString | null;
  category: string;
  tags?: string | null;
  impactLevel: string;
}

export interface UpsertSwarmAgentTaskData {
  swarmAgentTask_upsert: SwarmAgentTask_Key;
}

export interface UpsertSwarmAgentTaskVariables {
  id?: UUIDString | null;
  title: string;
  taskType: string;
  status: string;
  agentId?: string | null;
  progress: number;
  skillKey?: string | null;
}

export interface UpsertTaskData {
  task_upsert: Task_Key;
}

export interface UpsertTaskVariables {
  id?: UUIDString | null;
  title: string;
  description?: string | null;
  completed: boolean;
  status: string;
  priority: string;
  assignee?: string | null;
  department?: string | null;
  griReference?: string | null;
  dueDate?: DateString | null;
}

export interface User_Key {
  uid: string;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateDemoData' Mutation. Allow users to execute without passing in DataConnect. */
export function createDemoData(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDemoDataData>>;
/** Generated Node Admin SDK operation action function for the 'CreateDemoData' Mutation. Allow users to pass in custom DataConnect instances. */
export function createDemoData(options?: OperationOptions): Promise<ExecuteOperationResponse<CreateDemoDataData>>;

/** Generated Node Admin SDK operation action function for the 'ListAllTasks' Query. Allow users to execute without passing in DataConnect. */
export function listAllTasks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllTasksData>>;
/** Generated Node Admin SDK operation action function for the 'ListAllTasks' Query. Allow users to pass in custom DataConnect instances. */
export function listAllTasks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAllTasksData>>;

/** Generated Node Admin SDK operation action function for the 'GetTaskById' Query. Allow users to execute without passing in DataConnect. */
export function getTaskById(dc: DataConnect, vars: GetTaskByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskByIdData>>;
/** Generated Node Admin SDK operation action function for the 'GetTaskById' Query. Allow users to pass in custom DataConnect instances. */
export function getTaskById(vars: GetTaskByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskByIdData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertTask' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertTask(dc: DataConnect, vars: UpsertTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertTaskData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertTask(vars: UpsertTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertTaskData>>;

/** Generated Node Admin SDK operation action function for the 'ListAuditRecords' Query. Allow users to execute without passing in DataConnect. */
export function listAuditRecords(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAuditRecordsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAuditRecords' Query. Allow users to pass in custom DataConnect instances. */
export function listAuditRecords(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAuditRecordsData>>;

/** Generated Node Admin SDK operation action function for the 'ListScrapedArticles' Query. Allow users to execute without passing in DataConnect. */
export function listScrapedArticles(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListScrapedArticlesData>>;
/** Generated Node Admin SDK operation action function for the 'ListScrapedArticles' Query. Allow users to pass in custom DataConnect instances. */
export function listScrapedArticles(options?: OperationOptions): Promise<ExecuteOperationResponse<ListScrapedArticlesData>>;

/** Generated Node Admin SDK operation action function for the 'ListRoadmapMilestones' Query. Allow users to execute without passing in DataConnect. */
export function listRoadmapMilestones(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListRoadmapMilestonesData>>;
/** Generated Node Admin SDK operation action function for the 'ListRoadmapMilestones' Query. Allow users to pass in custom DataConnect instances. */
export function listRoadmapMilestones(options?: OperationOptions): Promise<ExecuteOperationResponse<ListRoadmapMilestonesData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertRoadmapMilestone' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertRoadmapMilestone(dc: DataConnect, vars: UpsertRoadmapMilestoneVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertRoadmapMilestoneData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertRoadmapMilestone' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertRoadmapMilestone(vars: UpsertRoadmapMilestoneVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertRoadmapMilestoneData>>;

/** Generated Node Admin SDK operation action function for the 'GetCompanyProfile' Query. Allow users to execute without passing in DataConnect. */
export function getCompanyProfile(dc: DataConnect, vars: GetCompanyProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCompanyProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetCompanyProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getCompanyProfile(vars: GetCompanyProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetCompanyProfileData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertCompanyProfile' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertCompanyProfile(dc: DataConnect, vars: UpsertCompanyProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCompanyProfileData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertCompanyProfile' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertCompanyProfile(vars: UpsertCompanyProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCompanyProfileData>>;

/** Generated Node Admin SDK operation action function for the 'GetReportById' Query. Allow users to execute without passing in DataConnect. */
export function getReportById(dc: DataConnect, vars: GetReportByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetReportByIdData>>;
/** Generated Node Admin SDK operation action function for the 'GetReportById' Query. Allow users to pass in custom DataConnect instances. */
export function getReportById(vars: GetReportByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetReportByIdData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertReport' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertReport(dc: DataConnect, vars: UpsertReportVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertReportData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertReport' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertReport(vars: UpsertReportVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertReportData>>;

/** Generated Node Admin SDK operation action function for the 'ListReports' Query. Allow users to execute without passing in DataConnect. */
export function listReports(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListReportsData>>;
/** Generated Node Admin SDK operation action function for the 'ListReports' Query. Allow users to pass in custom DataConnect instances. */
export function listReports(options?: OperationOptions): Promise<ExecuteOperationResponse<ListReportsData>>;

/** Generated Node Admin SDK operation action function for the 'ListCompanyMetricsByCategory' Query. Allow users to execute without passing in DataConnect. */
export function listCompanyMetricsByCategory(dc: DataConnect, vars: ListCompanyMetricsByCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCompanyMetricsByCategoryData>>;
/** Generated Node Admin SDK operation action function for the 'ListCompanyMetricsByCategory' Query. Allow users to pass in custom DataConnect instances. */
export function listCompanyMetricsByCategory(vars: ListCompanyMetricsByCategoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListCompanyMetricsByCategoryData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertCompanyMetric' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertCompanyMetric(dc: DataConnect, vars: UpsertCompanyMetricVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCompanyMetricData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertCompanyMetric' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertCompanyMetric(vars: UpsertCompanyMetricVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertCompanyMetricData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertScrapedArticle' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertScrapedArticle(dc: DataConnect, vars: UpsertScrapedArticleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertScrapedArticleData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertScrapedArticle' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertScrapedArticle(vars: UpsertScrapedArticleVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertScrapedArticleData>>;

/** Generated Node Admin SDK operation action function for the 'ListEternalMemories' Query. Allow users to execute without passing in DataConnect. */
export function listEternalMemories(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListEternalMemoriesData>>;
/** Generated Node Admin SDK operation action function for the 'ListEternalMemories' Query. Allow users to pass in custom DataConnect instances. */
export function listEternalMemories(options?: OperationOptions): Promise<ExecuteOperationResponse<ListEternalMemoriesData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertEternalMemory' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertEternalMemory(dc: DataConnect, vars: UpsertEternalMemoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertEternalMemoryData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertEternalMemory' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertEternalMemory(vars: UpsertEternalMemoryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertEternalMemoryData>>;

/** Generated Node Admin SDK operation action function for the 'ListSwarmAgentTasks' Query. Allow users to execute without passing in DataConnect. */
export function listSwarmAgentTasks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSwarmAgentTasksData>>;
/** Generated Node Admin SDK operation action function for the 'ListSwarmAgentTasks' Query. Allow users to pass in custom DataConnect instances. */
export function listSwarmAgentTasks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListSwarmAgentTasksData>>;

/** Generated Node Admin SDK operation action function for the 'UpsertSwarmAgentTask' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertSwarmAgentTask(dc: DataConnect, vars: UpsertSwarmAgentTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertSwarmAgentTaskData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertSwarmAgentTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertSwarmAgentTask(vars: UpsertSwarmAgentTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertSwarmAgentTaskData>>;

/** Generated Node Admin SDK operation action function for the 'ListRegulatoryPolicies' Query. Allow users to execute without passing in DataConnect. */
export function listRegulatoryPolicies(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListRegulatoryPoliciesData>>;
/** Generated Node Admin SDK operation action function for the 'ListRegulatoryPolicies' Query. Allow users to pass in custom DataConnect instances. */
export function listRegulatoryPolicies(options?: OperationOptions): Promise<ExecuteOperationResponse<ListRegulatoryPoliciesData>>;

