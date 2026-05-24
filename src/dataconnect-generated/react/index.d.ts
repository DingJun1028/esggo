import { ListAllBusinessesData, GetBusinessDetailsData, GetBusinessDetailsVariables, CreateBusinessData, CreateBusinessVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListAllBusinesses(options?: useDataConnectQueryOptions<ListAllBusinessesData>): UseDataConnectQueryResult<ListAllBusinessesData, undefined>;
export function useListAllBusinesses(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllBusinessesData>): UseDataConnectQueryResult<ListAllBusinessesData, undefined>;

export function useGetBusinessDetails(vars: GetBusinessDetailsVariables, options?: useDataConnectQueryOptions<GetBusinessDetailsData>): UseDataConnectQueryResult<GetBusinessDetailsData, GetBusinessDetailsVariables>;
export function useGetBusinessDetails(dc: DataConnect, vars: GetBusinessDetailsVariables, options?: useDataConnectQueryOptions<GetBusinessDetailsData>): UseDataConnectQueryResult<GetBusinessDetailsData, GetBusinessDetailsVariables>;

export function useCreateBusiness(options?: useDataConnectMutationOptions<CreateBusinessData, FirebaseError, CreateBusinessVariables>): UseDataConnectMutationResult<CreateBusinessData, CreateBusinessVariables>;
export function useCreateBusiness(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBusinessData, FirebaseError, CreateBusinessVariables>): UseDataConnectMutationResult<CreateBusinessData, CreateBusinessVariables>;
