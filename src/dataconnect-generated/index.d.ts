import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

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

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: UUIDString;
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

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

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

interface UpdateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  operationName: string;
}
export const updateTaskRef: UpdateTaskRef;

export function updateTask(vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;
export function updateTask(dc: DataConnect, vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

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

interface ListTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTasksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTasksData, undefined>;
  operationName: string;
}
export const listTasksRef: ListTasksRef;

export function listTasks(options?: ExecuteQueryOptions): QueryPromise<ListTasksData, undefined>;
export function listTasks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTasksData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUserTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserTasksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUserTasksData, undefined>;
  operationName: string;
}
export const listUserTasksRef: ListUserTasksRef;

export function listUserTasks(options?: ExecuteQueryOptions): QueryPromise<ListUserTasksData, undefined>;
export function listUserTasks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserTasksData, undefined>;

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

interface SearchTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchTaskVariables): QueryRef<SearchTaskData, SearchTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: SearchTaskVariables): QueryRef<SearchTaskData, SearchTaskVariables>;
  operationName: string;
}
export const searchTaskRef: SearchTaskRef;

export function searchTask(vars?: SearchTaskVariables, options?: ExecuteQueryOptions): QueryPromise<SearchTaskData, SearchTaskVariables>;
export function searchTask(dc: DataConnect, vars?: SearchTaskVariables, options?: ExecuteQueryOptions): QueryPromise<SearchTaskData, SearchTaskVariables>;

