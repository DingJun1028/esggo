import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AuditLog_Key {
  id: UUIDString;
  __typename?: 'AuditLog_Key';
}

export interface CreateDashboardMetricData {
  dashboardMetric_insert: DashboardMetric_Key;
}

export interface CreateDashboardMetricVariables {
  title: string;
  value: number;
  unit: string;
  trend: string;
  percentageChange: number;
}

export interface CreateEvidenceData {
  evidence_insert: Evidence_Key;
}

export interface CreateEvidenceVariables {
  title: string;
  content: string;
  source: string;
  confidenceScore: number;
}

export interface DashboardMetric_Key {
  id: UUIDString;
  __typename?: 'DashboardMetric_Key';
}

export interface Evidence_Key {
  id: UUIDString;
  __typename?: 'Evidence_Key';
}

export interface GetCurrentUserData {
  user?: {
    id: string;
    displayName?: string | null;
    email?: string | null;
    createdAt: TimestampString;
  } & User_Key;
}

export interface ListDashboardMetricsData {
  dashboardMetrics: ({
    id: UUIDString;
    title: string;
    value: number;
    unit: string;
    trend: string;
    percentageChange: number;
    timestamp: TimestampString;
  } & DashboardMetric_Key)[];
}

export interface ListOcrReviewItemsData {
  ocrReviewItems: ({
    id: UUIDString;
    fieldLabel: string;
    extractedValue: string;
    unit: string;
    confidenceScore: number;
    status: string;
  } & OcrReviewItem_Key)[];
}

export interface ListUserEvidenceData {
  evidences: ({
    id: UUIDString;
    title: string;
    content: string;
    source: string;
    timestamp: TimestampString;
    confidenceScore: number;
    verified: boolean;
  } & Evidence_Key)[];
}

export interface OcrReviewItem_Key {
  id: UUIDString;
  __typename?: 'OcrReviewItem_Key';
}

export interface UpdateOcrReviewItemData {
  ocrReviewItem_updateMany: number;
}

export interface UpdateOcrReviewItemVariables {
  id: UUIDString;
  status?: string | null;
  extractedValue?: string | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  displayName?: string | null;
  email?: string | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface ListUserEvidenceRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserEvidenceData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUserEvidenceData, undefined>;
  operationName: string;
}
export const listUserEvidenceRef: ListUserEvidenceRef;

export function listUserEvidence(options?: ExecuteQueryOptions): QueryPromise<ListUserEvidenceData, undefined>;
export function listUserEvidence(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserEvidenceData, undefined>;

interface ListDashboardMetricsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDashboardMetricsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListDashboardMetricsData, undefined>;
  operationName: string;
}
export const listDashboardMetricsRef: ListDashboardMetricsRef;

export function listDashboardMetrics(options?: ExecuteQueryOptions): QueryPromise<ListDashboardMetricsData, undefined>;
export function listDashboardMetrics(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDashboardMetricsData, undefined>;

interface ListOcrReviewItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListOcrReviewItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListOcrReviewItemsData, undefined>;
  operationName: string;
}
export const listOcrReviewItemsRef: ListOcrReviewItemsRef;

export function listOcrReviewItems(options?: ExecuteQueryOptions): QueryPromise<ListOcrReviewItemsData, undefined>;
export function listOcrReviewItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListOcrReviewItemsData, undefined>;

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface CreateEvidenceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEvidenceVariables): MutationRef<CreateEvidenceData, CreateEvidenceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEvidenceVariables): MutationRef<CreateEvidenceData, CreateEvidenceVariables>;
  operationName: string;
}
export const createEvidenceRef: CreateEvidenceRef;

export function createEvidence(vars: CreateEvidenceVariables): MutationPromise<CreateEvidenceData, CreateEvidenceVariables>;
export function createEvidence(dc: DataConnect, vars: CreateEvidenceVariables): MutationPromise<CreateEvidenceData, CreateEvidenceVariables>;

interface CreateDashboardMetricRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDashboardMetricVariables): MutationRef<CreateDashboardMetricData, CreateDashboardMetricVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDashboardMetricVariables): MutationRef<CreateDashboardMetricData, CreateDashboardMetricVariables>;
  operationName: string;
}
export const createDashboardMetricRef: CreateDashboardMetricRef;

export function createDashboardMetric(vars: CreateDashboardMetricVariables): MutationPromise<CreateDashboardMetricData, CreateDashboardMetricVariables>;
export function createDashboardMetric(dc: DataConnect, vars: CreateDashboardMetricVariables): MutationPromise<CreateDashboardMetricData, CreateDashboardMetricVariables>;

interface UpdateOcrReviewItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOcrReviewItemVariables): MutationRef<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateOcrReviewItemVariables): MutationRef<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;
  operationName: string;
}
export const updateOcrReviewItemRef: UpdateOcrReviewItemRef;

export function updateOcrReviewItem(vars: UpdateOcrReviewItemVariables): MutationPromise<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;
export function updateOcrReviewItem(dc: DataConnect, vars: UpdateOcrReviewItemVariables): MutationPromise<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars?: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars?: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

