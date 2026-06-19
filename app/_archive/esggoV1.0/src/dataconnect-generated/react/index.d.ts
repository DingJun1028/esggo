import { ListUserEvidenceData, ListDashboardMetricsData, ListOcrReviewItemsData, GetCurrentUserData, CreateEvidenceData, CreateEvidenceVariables, CreateDashboardMetricData, CreateDashboardMetricVariables, UpdateOcrReviewItemData, UpdateOcrReviewItemVariables, UpsertUserData, UpsertUserVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListUserEvidence(options?: useDataConnectQueryOptions<ListUserEvidenceData>): UseDataConnectQueryResult<ListUserEvidenceData, undefined>;
export function useListUserEvidence(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserEvidenceData>): UseDataConnectQueryResult<ListUserEvidenceData, undefined>;

export function useListDashboardMetrics(options?: useDataConnectQueryOptions<ListDashboardMetricsData>): UseDataConnectQueryResult<ListDashboardMetricsData, undefined>;
export function useListDashboardMetrics(dc: DataConnect, options?: useDataConnectQueryOptions<ListDashboardMetricsData>): UseDataConnectQueryResult<ListDashboardMetricsData, undefined>;

export function useListOcrReviewItems(options?: useDataConnectQueryOptions<ListOcrReviewItemsData>): UseDataConnectQueryResult<ListOcrReviewItemsData, undefined>;
export function useListOcrReviewItems(dc: DataConnect, options?: useDataConnectQueryOptions<ListOcrReviewItemsData>): UseDataConnectQueryResult<ListOcrReviewItemsData, undefined>;

export function useGetCurrentUser(options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;
export function useGetCurrentUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetCurrentUserData>): UseDataConnectQueryResult<GetCurrentUserData, undefined>;

export function useCreateEvidence(options?: useDataConnectMutationOptions<CreateEvidenceData, FirebaseError, CreateEvidenceVariables>): UseDataConnectMutationResult<CreateEvidenceData, CreateEvidenceVariables>;
export function useCreateEvidence(dc: DataConnect, options?: useDataConnectMutationOptions<CreateEvidenceData, FirebaseError, CreateEvidenceVariables>): UseDataConnectMutationResult<CreateEvidenceData, CreateEvidenceVariables>;

export function useCreateDashboardMetric(options?: useDataConnectMutationOptions<CreateDashboardMetricData, FirebaseError, CreateDashboardMetricVariables>): UseDataConnectMutationResult<CreateDashboardMetricData, CreateDashboardMetricVariables>;
export function useCreateDashboardMetric(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDashboardMetricData, FirebaseError, CreateDashboardMetricVariables>): UseDataConnectMutationResult<CreateDashboardMetricData, CreateDashboardMetricVariables>;

export function useUpdateOcrReviewItem(options?: useDataConnectMutationOptions<UpdateOcrReviewItemData, FirebaseError, UpdateOcrReviewItemVariables>): UseDataConnectMutationResult<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;
export function useUpdateOcrReviewItem(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateOcrReviewItemData, FirebaseError, UpdateOcrReviewItemVariables>): UseDataConnectMutationResult<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;

export function useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables | void>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
export function useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables | void>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
