import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Business_Key {
  id: UUIDString;
  __typename?: 'Business_Key';
}

export interface CreateBusinessData {
  business_insert: Business_Key;
}

export interface CreateBusinessVariables {
  name: string;
  industry: string;
  overallEsgScore: number;
}

export interface EsgDetail_Key {
  id: UUIDString;
  __typename?: 'EsgDetail_Key';
}

export interface GetBusinessDetailsData {
  business?: {
    id: UUIDString;
    name: string;
    description?: string | null;
    overallEsgScore: number;
  } & Business_Key;
}

export interface GetBusinessDetailsVariables {
  id: UUIDString;
}

export interface ListAllBusinessesData {
  businesses: ({
    id: UUIDString;
    name: string;
    industry: string;
    createdAt: TimestampString;
  } & Business_Key)[];
}

export interface ListBusiness_Key {
  id: UUIDString;
  __typename?: 'ListBusiness_Key';
}

export interface Suggestion_Key {
  id: UUIDString;
  __typename?: 'Suggestion_Key';
}

export interface UserList_Key {
  id: UUIDString;
  __typename?: 'UserList_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListAllBusinessesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllBusinessesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllBusinessesData, undefined>;
  operationName: string;
}
export const listAllBusinessesRef: ListAllBusinessesRef;

export function listAllBusinesses(options?: ExecuteQueryOptions): QueryPromise<ListAllBusinessesData, undefined>;
export function listAllBusinesses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllBusinessesData, undefined>;

interface GetBusinessDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessDetailsVariables): QueryRef<GetBusinessDetailsData, GetBusinessDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessDetailsVariables): QueryRef<GetBusinessDetailsData, GetBusinessDetailsVariables>;
  operationName: string;
}
export const getBusinessDetailsRef: GetBusinessDetailsRef;

export function getBusinessDetails(vars: GetBusinessDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessDetailsData, GetBusinessDetailsVariables>;
export function getBusinessDetails(dc: DataConnect, vars: GetBusinessDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessDetailsData, GetBusinessDetailsVariables>;

interface CreateBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
  operationName: string;
}
export const createBusinessRef: CreateBusinessRef;

export function createBusiness(vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;
export function createBusiness(dc: DataConnect, vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

