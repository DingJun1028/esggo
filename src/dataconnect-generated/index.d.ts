import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

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

interface ListAllTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTasksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllTasksData, undefined>;
  operationName: string;
}
export const listAllTasksRef: ListAllTasksRef;

export function listAllTasks(options?: ExecuteQueryOptions): QueryPromise<ListAllTasksData, undefined>;
export function listAllTasks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllTasksData, undefined>;

interface GetTaskByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTaskByIdVariables): QueryRef<GetTaskByIdData, GetTaskByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTaskByIdVariables): QueryRef<GetTaskByIdData, GetTaskByIdVariables>;
  operationName: string;
}
export const getTaskByIdRef: GetTaskByIdRef;

export function getTaskById(vars: GetTaskByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskByIdData, GetTaskByIdVariables>;
export function getTaskById(dc: DataConnect, vars: GetTaskByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskByIdData, GetTaskByIdVariables>;

interface UpsertTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertTaskVariables): MutationRef<UpsertTaskData, UpsertTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertTaskVariables): MutationRef<UpsertTaskData, UpsertTaskVariables>;
  operationName: string;
}
export const upsertTaskRef: UpsertTaskRef;

export function upsertTask(vars: UpsertTaskVariables): MutationPromise<UpsertTaskData, UpsertTaskVariables>;
export function upsertTask(dc: DataConnect, vars: UpsertTaskVariables): MutationPromise<UpsertTaskData, UpsertTaskVariables>;

interface ListAuditRecordsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAuditRecordsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAuditRecordsData, undefined>;
  operationName: string;
}
export const listAuditRecordsRef: ListAuditRecordsRef;

export function listAuditRecords(options?: ExecuteQueryOptions): QueryPromise<ListAuditRecordsData, undefined>;
export function listAuditRecords(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAuditRecordsData, undefined>;

interface ListScrapedArticlesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListScrapedArticlesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListScrapedArticlesData, undefined>;
  operationName: string;
}
export const listScrapedArticlesRef: ListScrapedArticlesRef;

export function listScrapedArticles(options?: ExecuteQueryOptions): QueryPromise<ListScrapedArticlesData, undefined>;
export function listScrapedArticles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListScrapedArticlesData, undefined>;

interface ListRoadmapMilestonesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRoadmapMilestonesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListRoadmapMilestonesData, undefined>;
  operationName: string;
}
export const listRoadmapMilestonesRef: ListRoadmapMilestonesRef;

export function listRoadmapMilestones(options?: ExecuteQueryOptions): QueryPromise<ListRoadmapMilestonesData, undefined>;
export function listRoadmapMilestones(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRoadmapMilestonesData, undefined>;

interface UpsertRoadmapMilestoneRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertRoadmapMilestoneVariables): MutationRef<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertRoadmapMilestoneVariables): MutationRef<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;
  operationName: string;
}
export const upsertRoadmapMilestoneRef: UpsertRoadmapMilestoneRef;

export function upsertRoadmapMilestone(vars: UpsertRoadmapMilestoneVariables): MutationPromise<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;
export function upsertRoadmapMilestone(dc: DataConnect, vars: UpsertRoadmapMilestoneVariables): MutationPromise<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;

interface GetCompanyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompanyProfileVariables): QueryRef<GetCompanyProfileData, GetCompanyProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCompanyProfileVariables): QueryRef<GetCompanyProfileData, GetCompanyProfileVariables>;
  operationName: string;
}
export const getCompanyProfileRef: GetCompanyProfileRef;

export function getCompanyProfile(vars: GetCompanyProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyProfileData, GetCompanyProfileVariables>;
export function getCompanyProfile(dc: DataConnect, vars: GetCompanyProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyProfileData, GetCompanyProfileVariables>;

interface UpsertCompanyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompanyProfileVariables): MutationRef<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCompanyProfileVariables): MutationRef<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;
  operationName: string;
}
export const upsertCompanyProfileRef: UpsertCompanyProfileRef;

export function upsertCompanyProfile(vars: UpsertCompanyProfileVariables): MutationPromise<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;
export function upsertCompanyProfile(dc: DataConnect, vars: UpsertCompanyProfileVariables): MutationPromise<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;

interface GetReportByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReportByIdVariables): QueryRef<GetReportByIdData, GetReportByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetReportByIdVariables): QueryRef<GetReportByIdData, GetReportByIdVariables>;
  operationName: string;
}
export const getReportByIdRef: GetReportByIdRef;

export function getReportById(vars: GetReportByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetReportByIdData, GetReportByIdVariables>;
export function getReportById(dc: DataConnect, vars: GetReportByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetReportByIdData, GetReportByIdVariables>;

interface UpsertReportRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertReportVariables): MutationRef<UpsertReportData, UpsertReportVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertReportVariables): MutationRef<UpsertReportData, UpsertReportVariables>;
  operationName: string;
}
export const upsertReportRef: UpsertReportRef;

export function upsertReport(vars: UpsertReportVariables): MutationPromise<UpsertReportData, UpsertReportVariables>;
export function upsertReport(dc: DataConnect, vars: UpsertReportVariables): MutationPromise<UpsertReportData, UpsertReportVariables>;

interface ListReportsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListReportsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListReportsData, undefined>;
  operationName: string;
}
export const listReportsRef: ListReportsRef;

export function listReports(options?: ExecuteQueryOptions): QueryPromise<ListReportsData, undefined>;
export function listReports(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListReportsData, undefined>;

interface ListCompanyMetricsByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyMetricsByCategoryVariables): QueryRef<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCompanyMetricsByCategoryVariables): QueryRef<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;
  operationName: string;
}
export const listCompanyMetricsByCategoryRef: ListCompanyMetricsByCategoryRef;

export function listCompanyMetricsByCategory(vars: ListCompanyMetricsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;
export function listCompanyMetricsByCategory(dc: DataConnect, vars: ListCompanyMetricsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;

interface UpsertCompanyMetricRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompanyMetricVariables): MutationRef<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertCompanyMetricVariables): MutationRef<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;
  operationName: string;
}
export const upsertCompanyMetricRef: UpsertCompanyMetricRef;

export function upsertCompanyMetric(vars: UpsertCompanyMetricVariables): MutationPromise<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;
export function upsertCompanyMetric(dc: DataConnect, vars: UpsertCompanyMetricVariables): MutationPromise<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;

interface UpsertScrapedArticleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertScrapedArticleVariables): MutationRef<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertScrapedArticleVariables): MutationRef<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;
  operationName: string;
}
export const upsertScrapedArticleRef: UpsertScrapedArticleRef;

export function upsertScrapedArticle(vars: UpsertScrapedArticleVariables): MutationPromise<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;
export function upsertScrapedArticle(dc: DataConnect, vars: UpsertScrapedArticleVariables): MutationPromise<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;

interface ListEternalMemoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListEternalMemoriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListEternalMemoriesData, undefined>;
  operationName: string;
}
export const listEternalMemoriesRef: ListEternalMemoriesRef;

export function listEternalMemories(options?: ExecuteQueryOptions): QueryPromise<ListEternalMemoriesData, undefined>;
export function listEternalMemories(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListEternalMemoriesData, undefined>;

interface UpsertEternalMemoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertEternalMemoryVariables): MutationRef<UpsertEternalMemoryData, UpsertEternalMemoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertEternalMemoryVariables): MutationRef<UpsertEternalMemoryData, UpsertEternalMemoryVariables>;
  operationName: string;
}
export const upsertEternalMemoryRef: UpsertEternalMemoryRef;

export function upsertEternalMemory(vars: UpsertEternalMemoryVariables): MutationPromise<UpsertEternalMemoryData, UpsertEternalMemoryVariables>;
export function upsertEternalMemory(dc: DataConnect, vars: UpsertEternalMemoryVariables): MutationPromise<UpsertEternalMemoryData, UpsertEternalMemoryVariables>;

interface ListSwarmAgentTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSwarmAgentTasksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSwarmAgentTasksData, undefined>;
  operationName: string;
}
export const listSwarmAgentTasksRef: ListSwarmAgentTasksRef;

export function listSwarmAgentTasks(options?: ExecuteQueryOptions): QueryPromise<ListSwarmAgentTasksData, undefined>;
export function listSwarmAgentTasks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListSwarmAgentTasksData, undefined>;

interface UpsertSwarmAgentTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertSwarmAgentTaskVariables): MutationRef<UpsertSwarmAgentTaskData, UpsertSwarmAgentTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertSwarmAgentTaskVariables): MutationRef<UpsertSwarmAgentTaskData, UpsertSwarmAgentTaskVariables>;
  operationName: string;
}
export const upsertSwarmAgentTaskRef: UpsertSwarmAgentTaskRef;

export function upsertSwarmAgentTask(vars: UpsertSwarmAgentTaskVariables): MutationPromise<UpsertSwarmAgentTaskData, UpsertSwarmAgentTaskVariables>;
export function upsertSwarmAgentTask(dc: DataConnect, vars: UpsertSwarmAgentTaskVariables): MutationPromise<UpsertSwarmAgentTaskData, UpsertSwarmAgentTaskVariables>;

interface ListRegulatoryPoliciesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRegulatoryPoliciesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListRegulatoryPoliciesData, undefined>;
  operationName: string;
}
export const listRegulatoryPoliciesRef: ListRegulatoryPoliciesRef;

export function listRegulatoryPolicies(options?: ExecuteQueryOptions): QueryPromise<ListRegulatoryPoliciesData, undefined>;
export function listRegulatoryPolicies(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRegulatoryPoliciesData, undefined>;

interface CreateDemoDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDemoDataData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateDemoDataData, undefined>;
  operationName: string;
}
export const createDemoDataRef: CreateDemoDataRef;

export function createDemoData(): MutationPromise<CreateDemoDataData, undefined>;
export function createDemoData(dc: DataConnect): MutationPromise<CreateDemoDataData, undefined>;

