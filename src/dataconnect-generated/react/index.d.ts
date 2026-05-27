import { ListAllTasksData, GetTaskByIdData, GetTaskByIdVariables, UpsertTaskData, UpsertTaskVariables, ListAuditRecordsData, ListScrapedArticlesData, ListRoadmapMilestonesData, UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables, GetCompanyProfileData, GetCompanyProfileVariables, UpsertCompanyProfileData, UpsertCompanyProfileVariables, GetReportByIdData, GetReportByIdVariables, UpsertReportData, UpsertReportVariables, UpsertReportSectionData, UpsertReportSectionVariables, ListReportSectionsByReportData, ListReportSectionsByReportVariables, UpsertCompanyMetricData, UpsertCompanyMetricVariables, ListCompanyMetricsData, ListCompanyMetricsVariables, UpsertEternalMemoryData, UpsertEternalMemoryVariables, ListEternalMemoriesByCompanyData, ListEternalMemoriesByCompanyVariables, GetReportByCompanyData, GetReportByCompanyVariables, ListReportsData, UpsertScrapedArticleData, UpsertScrapedArticleVariables, ListEternalMemoriesData, ListSwarmAgentTasksData, UpsertSwarmAgentTaskData, UpsertSwarmAgentTaskVariables, ListRegulatoryPoliciesData, CreateDemoDataData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListAllTasks(options?: useDataConnectQueryOptions<ListAllTasksData>): UseDataConnectQueryResult<ListAllTasksData, undefined>;
export function useListAllTasks(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllTasksData>): UseDataConnectQueryResult<ListAllTasksData, undefined>;

export function useGetTaskById(vars: GetTaskByIdVariables, options?: useDataConnectQueryOptions<GetTaskByIdData>): UseDataConnectQueryResult<GetTaskByIdData, GetTaskByIdVariables>;
export function useGetTaskById(dc: DataConnect, vars: GetTaskByIdVariables, options?: useDataConnectQueryOptions<GetTaskByIdData>): UseDataConnectQueryResult<GetTaskByIdData, GetTaskByIdVariables>;

export function useUpsertTask(options?: useDataConnectMutationOptions<UpsertTaskData, FirebaseError, UpsertTaskVariables>): UseDataConnectMutationResult<UpsertTaskData, UpsertTaskVariables>;
export function useUpsertTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertTaskData, FirebaseError, UpsertTaskVariables>): UseDataConnectMutationResult<UpsertTaskData, UpsertTaskVariables>;

export function useListAuditRecords(options?: useDataConnectQueryOptions<ListAuditRecordsData>): UseDataConnectQueryResult<ListAuditRecordsData, undefined>;
export function useListAuditRecords(dc: DataConnect, options?: useDataConnectQueryOptions<ListAuditRecordsData>): UseDataConnectQueryResult<ListAuditRecordsData, undefined>;

export function useListScrapedArticles(options?: useDataConnectQueryOptions<ListScrapedArticlesData>): UseDataConnectQueryResult<ListScrapedArticlesData, undefined>;
export function useListScrapedArticles(dc: DataConnect, options?: useDataConnectQueryOptions<ListScrapedArticlesData>): UseDataConnectQueryResult<ListScrapedArticlesData, undefined>;

export function useListRoadmapMilestones(options?: useDataConnectQueryOptions<ListRoadmapMilestonesData>): UseDataConnectQueryResult<ListRoadmapMilestonesData, undefined>;
export function useListRoadmapMilestones(dc: DataConnect, options?: useDataConnectQueryOptions<ListRoadmapMilestonesData>): UseDataConnectQueryResult<ListRoadmapMilestonesData, undefined>;

export function useUpsertRoadmapMilestone(options?: useDataConnectMutationOptions<UpsertRoadmapMilestoneData, FirebaseError, UpsertRoadmapMilestoneVariables>): UseDataConnectMutationResult<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;
export function useUpsertRoadmapMilestone(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertRoadmapMilestoneData, FirebaseError, UpsertRoadmapMilestoneVariables>): UseDataConnectMutationResult<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;

export function useGetCompanyProfile(vars: GetCompanyProfileVariables, options?: useDataConnectQueryOptions<GetCompanyProfileData>): UseDataConnectQueryResult<GetCompanyProfileData, GetCompanyProfileVariables>;
export function useGetCompanyProfile(dc: DataConnect, vars: GetCompanyProfileVariables, options?: useDataConnectQueryOptions<GetCompanyProfileData>): UseDataConnectQueryResult<GetCompanyProfileData, GetCompanyProfileVariables>;

export function useUpsertCompanyProfile(options?: useDataConnectMutationOptions<UpsertCompanyProfileData, FirebaseError, UpsertCompanyProfileVariables>): UseDataConnectMutationResult<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;
export function useUpsertCompanyProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompanyProfileData, FirebaseError, UpsertCompanyProfileVariables>): UseDataConnectMutationResult<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;

export function useGetReportById(vars: GetReportByIdVariables, options?: useDataConnectQueryOptions<GetReportByIdData>): UseDataConnectQueryResult<GetReportByIdData, GetReportByIdVariables>;
export function useGetReportById(dc: DataConnect, vars: GetReportByIdVariables, options?: useDataConnectQueryOptions<GetReportByIdData>): UseDataConnectQueryResult<GetReportByIdData, GetReportByIdVariables>;

export function useUpsertReport(options?: useDataConnectMutationOptions<UpsertReportData, FirebaseError, UpsertReportVariables>): UseDataConnectMutationResult<UpsertReportData, UpsertReportVariables>;
export function useUpsertReport(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReportData, FirebaseError, UpsertReportVariables>): UseDataConnectMutationResult<UpsertReportData, UpsertReportVariables>;

export function useUpsertReportSection(options?: useDataConnectMutationOptions<UpsertReportSectionData, FirebaseError, UpsertReportSectionVariables>): UseDataConnectMutationResult<UpsertReportSectionData, UpsertReportSectionVariables>;
export function useUpsertReportSection(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReportSectionData, FirebaseError, UpsertReportSectionVariables>): UseDataConnectMutationResult<UpsertReportSectionData, UpsertReportSectionVariables>;

export function useListReportSectionsByReport(vars: ListReportSectionsByReportVariables, options?: useDataConnectQueryOptions<ListReportSectionsByReportData>): UseDataConnectQueryResult<ListReportSectionsByReportData, ListReportSectionsByReportVariables>;
export function useListReportSectionsByReport(dc: DataConnect, vars: ListReportSectionsByReportVariables, options?: useDataConnectQueryOptions<ListReportSectionsByReportData>): UseDataConnectQueryResult<ListReportSectionsByReportData, ListReportSectionsByReportVariables>;

export function useUpsertCompanyMetric(options?: useDataConnectMutationOptions<UpsertCompanyMetricData, FirebaseError, UpsertCompanyMetricVariables>): UseDataConnectMutationResult<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;
export function useUpsertCompanyMetric(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompanyMetricData, FirebaseError, UpsertCompanyMetricVariables>): UseDataConnectMutationResult<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;

export function useListCompanyMetrics(vars: ListCompanyMetricsVariables, options?: useDataConnectQueryOptions<ListCompanyMetricsData>): UseDataConnectQueryResult<ListCompanyMetricsData, ListCompanyMetricsVariables>;
export function useListCompanyMetrics(dc: DataConnect, vars: ListCompanyMetricsVariables, options?: useDataConnectQueryOptions<ListCompanyMetricsData>): UseDataConnectQueryResult<ListCompanyMetricsData, ListCompanyMetricsVariables>;

export function useUpsertEternalMemory(options?: useDataConnectMutationOptions<UpsertEternalMemoryData, FirebaseError, UpsertEternalMemoryVariables>): UseDataConnectMutationResult<UpsertEternalMemoryData, UpsertEternalMemoryVariables>;
export function useUpsertEternalMemory(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertEternalMemoryData, FirebaseError, UpsertEternalMemoryVariables>): UseDataConnectMutationResult<UpsertEternalMemoryData, UpsertEternalMemoryVariables>;

export function useListEternalMemoriesByCompany(vars: ListEternalMemoriesByCompanyVariables, options?: useDataConnectQueryOptions<ListEternalMemoriesByCompanyData>): UseDataConnectQueryResult<ListEternalMemoriesByCompanyData, ListEternalMemoriesByCompanyVariables>;
export function useListEternalMemoriesByCompany(dc: DataConnect, vars: ListEternalMemoriesByCompanyVariables, options?: useDataConnectQueryOptions<ListEternalMemoriesByCompanyData>): UseDataConnectQueryResult<ListEternalMemoriesByCompanyData, ListEternalMemoriesByCompanyVariables>;

export function useGetReportByCompany(vars: GetReportByCompanyVariables, options?: useDataConnectQueryOptions<GetReportByCompanyData>): UseDataConnectQueryResult<GetReportByCompanyData, GetReportByCompanyVariables>;
export function useGetReportByCompany(dc: DataConnect, vars: GetReportByCompanyVariables, options?: useDataConnectQueryOptions<GetReportByCompanyData>): UseDataConnectQueryResult<GetReportByCompanyData, GetReportByCompanyVariables>;

export function useListReports(options?: useDataConnectQueryOptions<ListReportsData>): UseDataConnectQueryResult<ListReportsData, undefined>;
export function useListReports(dc: DataConnect, options?: useDataConnectQueryOptions<ListReportsData>): UseDataConnectQueryResult<ListReportsData, undefined>;

export function useUpsertScrapedArticle(options?: useDataConnectMutationOptions<UpsertScrapedArticleData, FirebaseError, UpsertScrapedArticleVariables>): UseDataConnectMutationResult<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;
export function useUpsertScrapedArticle(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertScrapedArticleData, FirebaseError, UpsertScrapedArticleVariables>): UseDataConnectMutationResult<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;

export function useListEternalMemories(options?: useDataConnectQueryOptions<ListEternalMemoriesData>): UseDataConnectQueryResult<ListEternalMemoriesData, undefined>;
export function useListEternalMemories(dc: DataConnect, options?: useDataConnectQueryOptions<ListEternalMemoriesData>): UseDataConnectQueryResult<ListEternalMemoriesData, undefined>;

export function useListSwarmAgentTasks(options?: useDataConnectQueryOptions<ListSwarmAgentTasksData>): UseDataConnectQueryResult<ListSwarmAgentTasksData, undefined>;
export function useListSwarmAgentTasks(dc: DataConnect, options?: useDataConnectQueryOptions<ListSwarmAgentTasksData>): UseDataConnectQueryResult<ListSwarmAgentTasksData, undefined>;

export function useUpsertSwarmAgentTask(options?: useDataConnectMutationOptions<UpsertSwarmAgentTaskData, FirebaseError, UpsertSwarmAgentTaskVariables>): UseDataConnectMutationResult<UpsertSwarmAgentTaskData, UpsertSwarmAgentTaskVariables>;
export function useUpsertSwarmAgentTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertSwarmAgentTaskData, FirebaseError, UpsertSwarmAgentTaskVariables>): UseDataConnectMutationResult<UpsertSwarmAgentTaskData, UpsertSwarmAgentTaskVariables>;

export function useListRegulatoryPolicies(options?: useDataConnectQueryOptions<ListRegulatoryPoliciesData>): UseDataConnectQueryResult<ListRegulatoryPoliciesData, undefined>;
export function useListRegulatoryPolicies(dc: DataConnect, options?: useDataConnectQueryOptions<ListRegulatoryPoliciesData>): UseDataConnectQueryResult<ListRegulatoryPoliciesData, undefined>;

export function useCreateDemoData(options?: useDataConnectMutationOptions<CreateDemoDataData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoDataData, undefined>;
export function useCreateDemoData(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDemoDataData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoDataData, undefined>;
