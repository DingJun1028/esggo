import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AuditRecord_Key {
  id: UUIDString;
  __typename?: 'AuditRecord_Key';
}

export interface CompanyMetric_Key {
  id: UUIDString;
  __typename?: 'CompanyMetric_Key';
}

export interface CompanyProfile_Key {
  id: UUIDString;
  __typename?: 'CompanyProfile_Key';
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  title: string;
  status: string;
  priority: string;
  completed: boolean;
}

export interface EternalMemory_Key {
  id: UUIDString;
  __typename?: 'EternalMemory_Key';
}

export interface GetTaskByIdData {
  task?: {
    id: UUIDString;
    title: string;
    status: string;
    priority: string;
    completed: boolean;
    user: {
      id: string;
      displayName?: string | null;
    } & User_Key;
  } & Task_Key;
}

export interface GetTaskByIdVariables {
  id: UUIDString;
}

export interface ListTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    status: string;
    priority: string;
    completed: boolean;
  } & Task_Key)[];
}

export interface ListUserTasksData {
  user?: {
    id: string;
    displayName?: string | null;
    email?: string | null;
    tasks: ({
      id: UUIDString;
      title: string;
      status: string;
      priority: string;
      completed: boolean;
    } & Task_Key)[];
  } & User_Key;
}

export interface ListUsersData {
  users: ({
    id: string;
    displayName?: string | null;
    email?: string | null;
  } & User_Key)[];
}

export interface RegulatoryPolicy_Key {
  id: UUIDString;
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

export interface SearchTaskData {
  tasks: ({
    id: UUIDString;
    title: string;
    status: string;
    priority: string;
    completed: boolean;
  } & Task_Key)[];
}

export interface SearchTaskVariables {
  titleInput?: string | null;
  status?: string | null;
}

export interface SwarmAgentTask_Key {
  id: UUIDString;
  __typename?: 'SwarmAgentTask_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface UpdateTaskData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskVariables {
  id: UUIDString;
  status: string;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  displayName: string;
  email?: string | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'UpsertUser' Mutation. Allow users to execute without passing in DataConnect. */
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserData>>;
/** Generated Node Admin SDK operation action function for the 'UpsertUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function upsertUser(vars: UpsertUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpsertUserData>>;

/** Generated Node Admin SDK operation action function for the 'CreateTask' Mutation. Allow users to execute without passing in DataConnect. */
export function createTask(dc: DataConnect, vars: CreateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTaskData>>;
/** Generated Node Admin SDK operation action function for the 'CreateTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function createTask(vars: CreateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateTaskData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateTask' Mutation. Allow users to execute without passing in DataConnect. */
export function updateTask(dc: DataConnect, vars: UpdateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTaskData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateTask' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateTask(vars: UpdateTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateTaskData>>;

/** Generated Node Admin SDK operation action function for the 'ListTasks' Query. Allow users to execute without passing in DataConnect. */
export function listTasks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListTasksData>>;
/** Generated Node Admin SDK operation action function for the 'ListTasks' Query. Allow users to pass in custom DataConnect instances. */
export function listTasks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListTasksData>>;

/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to execute without passing in DataConnect. */
export function listUsers(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;
/** Generated Node Admin SDK operation action function for the 'ListUsers' Query. Allow users to pass in custom DataConnect instances. */
export function listUsers(options?: OperationOptions): Promise<ExecuteOperationResponse<ListUsersData>>;

/** Generated Node Admin SDK operation action function for the 'ListUserTasks' Query. Allow users to execute without passing in DataConnect. */
export function listUserTasks(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserTasksData>>;
/** Generated Node Admin SDK operation action function for the 'ListUserTasks' Query. Allow users to pass in custom DataConnect instances. */
export function listUserTasks(options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserTasksData>>;

/** Generated Node Admin SDK operation action function for the 'GetTaskById' Query. Allow users to execute without passing in DataConnect. */
export function getTaskById(dc: DataConnect, vars: GetTaskByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskByIdData>>;
/** Generated Node Admin SDK operation action function for the 'GetTaskById' Query. Allow users to pass in custom DataConnect instances. */
export function getTaskById(vars: GetTaskByIdVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetTaskByIdData>>;

/** Generated Node Admin SDK operation action function for the 'SearchTask' Query. Allow users to execute without passing in DataConnect. */
export function searchTask(dc: DataConnect, vars?: SearchTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchTaskData>>;
/** Generated Node Admin SDK operation action function for the 'SearchTask' Query. Allow users to pass in custom DataConnect instances. */
export function searchTask(vars?: SearchTaskVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<SearchTaskData>>;

