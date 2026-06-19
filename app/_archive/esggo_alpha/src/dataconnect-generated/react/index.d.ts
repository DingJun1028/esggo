import { ListAllTasksData, GetTaskByIdData, GetTaskByIdVariables, CreateTaskData, CreateTaskVariables, DeleteTaskData, DeleteTaskVariables, UpdateTaskStatusData, UpdateTaskStatusVariables, ListAuditRecordsData, CreateAuditRecordData, CreateAuditRecordVariables, UpdateAuditRecordData, UpdateAuditRecordVariables, DeleteAuditRecordData, DeleteAuditRecordVariables, ListIntelligenceModulesData, UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables, ListIntelligenceSourcesData, UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables, ListReportsData, GetReportByIdData, GetReportByIdVariables, UpsertReportData, UpsertReportVariables, UpsertReportSectionData, UpsertReportSectionVariables, GetReportSectionsData, GetReportSectionsVariables, ListCompanyMetricData, ListCompanyMetricVariables, UpsertCompanyMetricData, UpsertCompanyMetricVariables, ListIntelligenceSignalsData, UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables, CreateDemoDataData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListAllTasks(options?: useDataConnectQueryOptions<ListAllTasksData>): UseDataConnectQueryResult<ListAllTasksData, undefined>;
export function useListAllTasks(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllTasksData>): UseDataConnectQueryResult<ListAllTasksData, undefined>;

export function useGetTaskById(vars: GetTaskByIdVariables, options?: useDataConnectQueryOptions<GetTaskByIdData>): UseDataConnectQueryResult<GetTaskByIdData, GetTaskByIdVariables>;
export function useGetTaskById(dc: DataConnect, vars: GetTaskByIdVariables, options?: useDataConnectQueryOptions<GetTaskByIdData>): UseDataConnectQueryResult<GetTaskByIdData, GetTaskByIdVariables>;

export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
export function useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;

export function useUpdateTaskStatus(options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;
export function useUpdateTaskStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;

export function useListAuditRecords(options?: useDataConnectQueryOptions<ListAuditRecordsData>): UseDataConnectQueryResult<ListAuditRecordsData, undefined>;
export function useListAuditRecords(dc: DataConnect, options?: useDataConnectQueryOptions<ListAuditRecordsData>): UseDataConnectQueryResult<ListAuditRecordsData, undefined>;

export function useCreateAuditRecord(options?: useDataConnectMutationOptions<CreateAuditRecordData, FirebaseError, CreateAuditRecordVariables>): UseDataConnectMutationResult<CreateAuditRecordData, CreateAuditRecordVariables>;
export function useCreateAuditRecord(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAuditRecordData, FirebaseError, CreateAuditRecordVariables>): UseDataConnectMutationResult<CreateAuditRecordData, CreateAuditRecordVariables>;

export function useUpdateAuditRecord(options?: useDataConnectMutationOptions<UpdateAuditRecordData, FirebaseError, UpdateAuditRecordVariables>): UseDataConnectMutationResult<UpdateAuditRecordData, UpdateAuditRecordVariables>;
export function useUpdateAuditRecord(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAuditRecordData, FirebaseError, UpdateAuditRecordVariables>): UseDataConnectMutationResult<UpdateAuditRecordData, UpdateAuditRecordVariables>;

export function useDeleteAuditRecord(options?: useDataConnectMutationOptions<DeleteAuditRecordData, FirebaseError, DeleteAuditRecordVariables>): UseDataConnectMutationResult<DeleteAuditRecordData, DeleteAuditRecordVariables>;
export function useDeleteAuditRecord(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAuditRecordData, FirebaseError, DeleteAuditRecordVariables>): UseDataConnectMutationResult<DeleteAuditRecordData, DeleteAuditRecordVariables>;

export function useListIntelligenceModules(options?: useDataConnectQueryOptions<ListIntelligenceModulesData>): UseDataConnectQueryResult<ListIntelligenceModulesData, undefined>;
export function useListIntelligenceModules(dc: DataConnect, options?: useDataConnectQueryOptions<ListIntelligenceModulesData>): UseDataConnectQueryResult<ListIntelligenceModulesData, undefined>;

export function useUpsertIntelligenceModule(options?: useDataConnectMutationOptions<UpsertIntelligenceModuleData, FirebaseError, UpsertIntelligenceModuleVariables>): UseDataConnectMutationResult<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;
export function useUpsertIntelligenceModule(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertIntelligenceModuleData, FirebaseError, UpsertIntelligenceModuleVariables>): UseDataConnectMutationResult<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;

export function useListIntelligenceSources(options?: useDataConnectQueryOptions<ListIntelligenceSourcesData>): UseDataConnectQueryResult<ListIntelligenceSourcesData, undefined>;
export function useListIntelligenceSources(dc: DataConnect, options?: useDataConnectQueryOptions<ListIntelligenceSourcesData>): UseDataConnectQueryResult<ListIntelligenceSourcesData, undefined>;

export function useUpsertIntelligenceSource(options?: useDataConnectMutationOptions<UpsertIntelligenceSourceData, FirebaseError, UpsertIntelligenceSourceVariables>): UseDataConnectMutationResult<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;
export function useUpsertIntelligenceSource(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertIntelligenceSourceData, FirebaseError, UpsertIntelligenceSourceVariables>): UseDataConnectMutationResult<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;

export function useListReports(options?: useDataConnectQueryOptions<ListReportsData>): UseDataConnectQueryResult<ListReportsData, undefined>;
export function useListReports(dc: DataConnect, options?: useDataConnectQueryOptions<ListReportsData>): UseDataConnectQueryResult<ListReportsData, undefined>;

export function useGetReportById(vars: GetReportByIdVariables, options?: useDataConnectQueryOptions<GetReportByIdData>): UseDataConnectQueryResult<GetReportByIdData, GetReportByIdVariables>;
export function useGetReportById(dc: DataConnect, vars: GetReportByIdVariables, options?: useDataConnectQueryOptions<GetReportByIdData>): UseDataConnectQueryResult<GetReportByIdData, GetReportByIdVariables>;

export function useUpsertReport(options?: useDataConnectMutationOptions<UpsertReportData, FirebaseError, UpsertReportVariables>): UseDataConnectMutationResult<UpsertReportData, UpsertReportVariables>;
export function useUpsertReport(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReportData, FirebaseError, UpsertReportVariables>): UseDataConnectMutationResult<UpsertReportData, UpsertReportVariables>;

export function useUpsertReportSection(options?: useDataConnectMutationOptions<UpsertReportSectionData, FirebaseError, UpsertReportSectionVariables>): UseDataConnectMutationResult<UpsertReportSectionData, UpsertReportSectionVariables>;
export function useUpsertReportSection(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReportSectionData, FirebaseError, UpsertReportSectionVariables>): UseDataConnectMutationResult<UpsertReportSectionData, UpsertReportSectionVariables>;

export function useGetReportSections(vars: GetReportSectionsVariables, options?: useDataConnectQueryOptions<GetReportSectionsData>): UseDataConnectQueryResult<GetReportSectionsData, GetReportSectionsVariables>;
export function useGetReportSections(dc: DataConnect, vars: GetReportSectionsVariables, options?: useDataConnectQueryOptions<GetReportSectionsData>): UseDataConnectQueryResult<GetReportSectionsData, GetReportSectionsVariables>;

export function useListCompanyMetric(vars: ListCompanyMetricVariables, options?: useDataConnectQueryOptions<ListCompanyMetricData>): UseDataConnectQueryResult<ListCompanyMetricData, ListCompanyMetricVariables>;
export function useListCompanyMetric(dc: DataConnect, vars: ListCompanyMetricVariables, options?: useDataConnectQueryOptions<ListCompanyMetricData>): UseDataConnectQueryResult<ListCompanyMetricData, ListCompanyMetricVariables>;

export function useUpsertCompanyMetric(options?: useDataConnectMutationOptions<UpsertCompanyMetricData, FirebaseError, UpsertCompanyMetricVariables>): UseDataConnectMutationResult<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;
export function useUpsertCompanyMetric(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompanyMetricData, FirebaseError, UpsertCompanyMetricVariables>): UseDataConnectMutationResult<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;

export function useListIntelligenceSignals(options?: useDataConnectQueryOptions<ListIntelligenceSignalsData>): UseDataConnectQueryResult<ListIntelligenceSignalsData, undefined>;
export function useListIntelligenceSignals(dc: DataConnect, options?: useDataConnectQueryOptions<ListIntelligenceSignalsData>): UseDataConnectQueryResult<ListIntelligenceSignalsData, undefined>;

export function useUpsertIntelligenceSignal(options?: useDataConnectMutationOptions<UpsertIntelligenceSignalData, FirebaseError, UpsertIntelligenceSignalVariables>): UseDataConnectMutationResult<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;
export function useUpsertIntelligenceSignal(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertIntelligenceSignalData, FirebaseError, UpsertIntelligenceSignalVariables>): UseDataConnectMutationResult<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;

export function useCreateDemoData(options?: useDataConnectMutationOptions<CreateDemoDataData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoDataData, undefined>;
export function useCreateDemoData(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDemoDataData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoDataData, undefined>;
