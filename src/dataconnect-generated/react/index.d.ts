import { UpsertUserData, UpsertUserVariables, CreateTaskData, CreateTaskVariables, UpdateTaskData, UpdateTaskVariables, DeleteTaskData, DeleteTaskVariables, ListTasksData, ListUsersData, ListUserTasksData, GetTaskByIdData, GetTaskByIdVariables, SearchTaskData, SearchTaskVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
export function useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;

export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useUpdateTask(options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
export function useUpdateTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;

export function useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
export function useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;

export function useListTasks(options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, undefined>;
export function useListTasks(dc: DataConnect, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, undefined>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useListUserTasks(options?: useDataConnectQueryOptions<ListUserTasksData>): UseDataConnectQueryResult<ListUserTasksData, undefined>;
export function useListUserTasks(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserTasksData>): UseDataConnectQueryResult<ListUserTasksData, undefined>;

export function useGetTaskById(vars: GetTaskByIdVariables, options?: useDataConnectQueryOptions<GetTaskByIdData>): UseDataConnectQueryResult<GetTaskByIdData, GetTaskByIdVariables>;
export function useGetTaskById(dc: DataConnect, vars: GetTaskByIdVariables, options?: useDataConnectQueryOptions<GetTaskByIdData>): UseDataConnectQueryResult<GetTaskByIdData, GetTaskByIdVariables>;

export function useSearchTask(vars?: SearchTaskVariables, options?: useDataConnectQueryOptions<SearchTaskData>): UseDataConnectQueryResult<SearchTaskData, SearchTaskVariables>;
export function useSearchTask(dc: DataConnect, vars?: SearchTaskVariables, options?: useDataConnectQueryOptions<SearchTaskData>): UseDataConnectQueryResult<SearchTaskData, SearchTaskVariables>;
