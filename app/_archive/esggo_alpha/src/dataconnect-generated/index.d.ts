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
  userId: UUIDString;
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

export interface CreateAuditRecordData {
  auditRecord: AuditRecord_Key;
}

export interface CreateAuditRecordVariables {
  title: string;
  dataType: string;
  source: string;
  category?: string | null;
  standard?: string | null;
  description?: string | null;
  contentHash: string;
  zkpStatus: string;
  createdAt: TimestampString;
  metadata?: string | null;
  proofSignature?: string | null;
  verifierKey?: string | null;
  algorithm?: string | null;
  salt?: string | null;
  proofJson?: string | null;
}

export interface CreateDemoDataData {
  user_insertMany: User_Key[];
  comment_insertMany: Comment_Key[];
}

export interface CreateTaskData {
  task: Task_Key;
}

export interface CreateTaskVariables {
  title: string;
  description?: string | null;
  createdAt: TimestampString;
}

export interface DeleteAuditRecordData {
  auditRecord?: AuditRecord_Key | null;
}

export interface DeleteAuditRecordVariables {
  id: UUIDString;
}

export interface DeleteTaskData {
  task?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: UUIDString;
}

export interface GetReportByIdData {
  report?: {
    id: UUIDString;
    templateId: string;
    title: string;
    language: string;
    progress: number;
    status: string;
    createdAt: TimestampString;
    lastSavedAt?: TimestampString | null;
    company: {
      id: UUIDString;
      name: string;
    } & CompanyProfile_Key;
  } & Report_Key;
}

export interface GetReportByIdVariables {
  id: UUIDString;
}

export interface GetReportSectionsData {
  reportSections: ({
    id: UUIDString;
    sectionId: string;
    title: string;
    content?: string | null;
    isDone: boolean;
    lastUpdated: TimestampString;
  } & ReportSection_Key)[];
}

export interface GetReportSectionsVariables {
  reportId: UUIDString;
}

export interface GetTaskByIdData {
  task?: {
    id: UUIDString;
    title: string;
    description?: string | null;
    completed: boolean;
    createdAt: TimestampString;
  } & Task_Key;
}

export interface GetTaskByIdVariables {
  id: UUIDString;
}

export interface IntelligenceModule_Key {
  id: string;
  __typename?: 'IntelligenceModule_Key';
}

export interface IntelligenceSignal_Key {
  id: UUIDString;
  __typename?: 'IntelligenceSignal_Key';
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
    createdAt: TimestampString;
  } & Task_Key)[];
}

export interface ListAuditRecordsData {
  auditRecords: ({
    id: UUIDString;
    title: string;
    dataType: string;
    source: string;
    category?: string | null;
    standard?: string | null;
    description?: string | null;
    contentHash: string;
    zkpStatus: string;
    createdAt: TimestampString;
    metadata?: string | null;
    proofSignature?: string | null;
    verifierKey?: string | null;
    algorithm?: string | null;
    salt?: string | null;
    proofJson?: string | null;
  } & AuditRecord_Key)[];
}

export interface ListCompanyMetricData {
  companyMetrics: ({
    id: UUIDString;
    readinessScore: number;
    complianceRate: number;
    riskLevel: number;
    efficiencyRate: number;
    trustScore: number;
    updatedAt: TimestampString;
  } & CompanyMetric_Key)[];
}

export interface ListCompanyMetricVariables {
  companyId: UUIDString;
}

export interface ListIntelligenceModulesData {
  intelligenceModules: ({
    id: string;
    titleZh: string;
    titleEn: string;
    descriptionZh: string;
    descriptionEn: string;
    iconName: string;
    color: string;
    details?: string | null;
  } & IntelligenceModule_Key)[];
}

export interface ListIntelligenceSignalsData {
  intelligenceSignals: ({
    id: UUIDString;
    title: string;
    content: string;
    severity: string;
    timestamp: TimestampString;
    sourceId?: string | null;
  } & IntelligenceSignal_Key)[];
}

export interface ListIntelligenceSourcesData {
  intelligenceSources: ({
    id: UUIDString;
    category: string;
    name: string;
    type: string;
    status: string;
  } & IntelligenceSource_Key)[];
}

export interface ListReportsData {
  reports: ({
    id: UUIDString;
    templateId: string;
    title: string;
    language: string;
    progress: number;
    status: string;
    createdAt: TimestampString;
    lastSavedAt?: TimestampString | null;
    company: {
      id: UUIDString;
      name: string;
    } & CompanyProfile_Key;
  } & Report_Key)[];
}

export interface ReportSection_Key {
  id: UUIDString;
  __typename?: 'ReportSection_Key';
}

export interface Report_Key {
  id: UUIDString;
  __typename?: 'Report_Key';
}

export interface SocialConnection_Key {
  followerId: UUIDString;
  followedId: UUIDString;
  __typename?: 'SocialConnection_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateAuditRecordData {
  auditRecord?: AuditRecord_Key | null;
}

export interface UpdateAuditRecordVariables {
  id: UUIDString;
  title?: string | null;
  dataType?: string | null;
  source?: string | null;
  category?: string | null;
  standard?: string | null;
  description?: string | null;
  contentHash?: string | null;
  zkpStatus?: string | null;
  metadata?: string | null;
  proofSignature?: string | null;
  verifierKey?: string | null;
  algorithm?: string | null;
  salt?: string | null;
  proofJson?: string | null;
}

export interface UpdateTaskStatusData {
  task?: Task_Key | null;
}

export interface UpdateTaskStatusVariables {
  id: UUIDString;
  completed: boolean;
}

export interface UpsertCompanyMetricData {
  companyMetric_upsert: CompanyMetric_Key;
}

export interface UpsertCompanyMetricVariables {
  id?: UUIDString | null;
  companyId: UUIDString;
  readinessScore: number;
  complianceRate: number;
  riskLevel: number;
  efficiencyRate: number;
  trustScore: number;
  updatedAt: TimestampString;
}

export interface UpsertIntelligenceModuleData {
  intelligenceModule: IntelligenceModule_Key;
}

export interface UpsertIntelligenceModuleVariables {
  id: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  iconName: string;
  color: string;
  details?: string | null;
}

export interface UpsertIntelligenceSignalData {
  intelligenceSignal: IntelligenceSignal_Key;
}

export interface UpsertIntelligenceSignalVariables {
  id?: UUIDString | null;
  title: string;
  content: string;
  severity: string;
  timestamp: TimestampString;
}

export interface UpsertIntelligenceSourceData {
  intelligenceSource: IntelligenceSource_Key;
}

export interface UpsertIntelligenceSourceVariables {
  id?: UUIDString | null;
  category: string;
  name: string;
  type: string;
  status: string;
}

export interface UpsertReportData {
  report: Report_Key;
}

export interface UpsertReportSectionData {
  reportSection: ReportSection_Key;
}

export interface UpsertReportSectionVariables {
  id?: UUIDString | null;
  reportId: UUIDString;
  sectionId: string;
  title: string;
  content?: string | null;
  isDone: boolean;
  lastUpdated: TimestampString;
}

export interface UpsertReportVariables {
  id?: UUIDString | null;
  companyId: UUIDString;
  templateId: string;
  title: string;
  language: string;
  progress: number;
  status: string;
  createdAt: TimestampString;
  lastSavedAt?: TimestampString | null;
}

export interface User_Key {
  id: UUIDString;
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

interface CreateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  operationName: string;
}
export const createTaskRef: CreateTaskRef;

export function createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;
export function createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface DeleteTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  operationName: string;
}
export const deleteTaskRef: DeleteTaskRef;

export function deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface UpdateTaskStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
  operationName: string;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;

export function updateTaskStatus(vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;
export function updateTaskStatus(dc: DataConnect, vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

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

interface CreateAuditRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuditRecordVariables): MutationRef<CreateAuditRecordData, CreateAuditRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAuditRecordVariables): MutationRef<CreateAuditRecordData, CreateAuditRecordVariables>;
  operationName: string;
}
export const createAuditRecordRef: CreateAuditRecordRef;

export function createAuditRecord(vars: CreateAuditRecordVariables): MutationPromise<CreateAuditRecordData, CreateAuditRecordVariables>;
export function createAuditRecord(dc: DataConnect, vars: CreateAuditRecordVariables): MutationPromise<CreateAuditRecordData, CreateAuditRecordVariables>;

interface UpdateAuditRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAuditRecordVariables): MutationRef<UpdateAuditRecordData, UpdateAuditRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAuditRecordVariables): MutationRef<UpdateAuditRecordData, UpdateAuditRecordVariables>;
  operationName: string;
}
export const updateAuditRecordRef: UpdateAuditRecordRef;

export function updateAuditRecord(vars: UpdateAuditRecordVariables): MutationPromise<UpdateAuditRecordData, UpdateAuditRecordVariables>;
export function updateAuditRecord(dc: DataConnect, vars: UpdateAuditRecordVariables): MutationPromise<UpdateAuditRecordData, UpdateAuditRecordVariables>;

interface DeleteAuditRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuditRecordVariables): MutationRef<DeleteAuditRecordData, DeleteAuditRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAuditRecordVariables): MutationRef<DeleteAuditRecordData, DeleteAuditRecordVariables>;
  operationName: string;
}
export const deleteAuditRecordRef: DeleteAuditRecordRef;

export function deleteAuditRecord(vars: DeleteAuditRecordVariables): MutationPromise<DeleteAuditRecordData, DeleteAuditRecordVariables>;
export function deleteAuditRecord(dc: DataConnect, vars: DeleteAuditRecordVariables): MutationPromise<DeleteAuditRecordData, DeleteAuditRecordVariables>;

interface ListIntelligenceModulesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIntelligenceModulesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListIntelligenceModulesData, undefined>;
  operationName: string;
}
export const listIntelligenceModulesRef: ListIntelligenceModulesRef;

export function listIntelligenceModules(options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceModulesData, undefined>;
export function listIntelligenceModules(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceModulesData, undefined>;

interface UpsertIntelligenceModuleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertIntelligenceModuleVariables): MutationRef<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertIntelligenceModuleVariables): MutationRef<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;
  operationName: string;
}
export const upsertIntelligenceModuleRef: UpsertIntelligenceModuleRef;

export function upsertIntelligenceModule(vars: UpsertIntelligenceModuleVariables): MutationPromise<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;
export function upsertIntelligenceModule(dc: DataConnect, vars: UpsertIntelligenceModuleVariables): MutationPromise<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;

interface ListIntelligenceSourcesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIntelligenceSourcesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListIntelligenceSourcesData, undefined>;
  operationName: string;
}
export const listIntelligenceSourcesRef: ListIntelligenceSourcesRef;

export function listIntelligenceSources(options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceSourcesData, undefined>;
export function listIntelligenceSources(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceSourcesData, undefined>;

interface UpsertIntelligenceSourceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertIntelligenceSourceVariables): MutationRef<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertIntelligenceSourceVariables): MutationRef<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;
  operationName: string;
}
export const upsertIntelligenceSourceRef: UpsertIntelligenceSourceRef;

export function upsertIntelligenceSource(vars: UpsertIntelligenceSourceVariables): MutationPromise<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;
export function upsertIntelligenceSource(dc: DataConnect, vars: UpsertIntelligenceSourceVariables): MutationPromise<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;

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

interface UpsertReportSectionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertReportSectionVariables): MutationRef<UpsertReportSectionData, UpsertReportSectionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertReportSectionVariables): MutationRef<UpsertReportSectionData, UpsertReportSectionVariables>;
  operationName: string;
}
export const upsertReportSectionRef: UpsertReportSectionRef;

export function upsertReportSection(vars: UpsertReportSectionVariables): MutationPromise<UpsertReportSectionData, UpsertReportSectionVariables>;
export function upsertReportSection(dc: DataConnect, vars: UpsertReportSectionVariables): MutationPromise<UpsertReportSectionData, UpsertReportSectionVariables>;

interface GetReportSectionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReportSectionsVariables): QueryRef<GetReportSectionsData, GetReportSectionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetReportSectionsVariables): QueryRef<GetReportSectionsData, GetReportSectionsVariables>;
  operationName: string;
}
export const getReportSectionsRef: GetReportSectionsRef;

export function getReportSections(vars: GetReportSectionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetReportSectionsData, GetReportSectionsVariables>;
export function getReportSections(dc: DataConnect, vars: GetReportSectionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetReportSectionsData, GetReportSectionsVariables>;

interface ListCompanyMetricRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyMetricVariables): QueryRef<ListCompanyMetricData, ListCompanyMetricVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCompanyMetricVariables): QueryRef<ListCompanyMetricData, ListCompanyMetricVariables>;
  operationName: string;
}
export const listCompanyMetricRef: ListCompanyMetricRef;

export function listCompanyMetric(vars: ListCompanyMetricVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyMetricData, ListCompanyMetricVariables>;
export function listCompanyMetric(dc: DataConnect, vars: ListCompanyMetricVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyMetricData, ListCompanyMetricVariables>;

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

interface ListIntelligenceSignalsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIntelligenceSignalsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListIntelligenceSignalsData, undefined>;
  operationName: string;
}
export const listIntelligenceSignalsRef: ListIntelligenceSignalsRef;

export function listIntelligenceSignals(options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceSignalsData, undefined>;
export function listIntelligenceSignals(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceSignalsData, undefined>;

interface UpsertIntelligenceSignalRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertIntelligenceSignalVariables): MutationRef<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertIntelligenceSignalVariables): MutationRef<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;
  operationName: string;
}
export const upsertIntelligenceSignalRef: UpsertIntelligenceSignalRef;

export function upsertIntelligenceSignal(vars: UpsertIntelligenceSignalVariables): MutationPromise<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;
export function upsertIntelligenceSignal(dc: DataConnect, vars: UpsertIntelligenceSignalVariables): MutationPromise<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;

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

