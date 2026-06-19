# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAllTasks*](#listalltasks)
  - [*GetTaskById*](#gettaskbyid)
  - [*ListAuditRecords*](#listauditrecords)
  - [*ListIntelligenceModules*](#listintelligencemodules)
  - [*ListIntelligenceSources*](#listintelligencesources)
  - [*ListReports*](#listreports)
  - [*GetReportById*](#getreportbyid)
  - [*GetReportSections*](#getreportsections)
  - [*ListCompanyMetric*](#listcompanymetric)
  - [*ListIntelligenceSignals*](#listintelligencesignals)
- [**Mutations**](#mutations)
  - [*CreateTask*](#createtask)
  - [*DeleteTask*](#deletetask)
  - [*UpdateTaskStatus*](#updatetaskstatus)
  - [*CreateAuditRecord*](#createauditrecord)
  - [*UpdateAuditRecord*](#updateauditrecord)
  - [*DeleteAuditRecord*](#deleteauditrecord)
  - [*UpsertIntelligenceModule*](#upsertintelligencemodule)
  - [*UpsertIntelligenceSource*](#upsertintelligencesource)
  - [*UpsertReport*](#upsertreport)
  - [*UpsertReportSection*](#upsertreportsection)
  - [*UpsertCompanyMetric*](#upsertcompanymetric)
  - [*UpsertIntelligenceSignal*](#upsertintelligencesignal)
  - [*CreateDemoData*](#createdemodata)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListAllTasks
You can execute the `ListAllTasks` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListAllTasks(dc: DataConnect, options?: useDataConnectQueryOptions<ListAllTasksData>): UseDataConnectQueryResult<ListAllTasksData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListAllTasks(options?: useDataConnectQueryOptions<ListAllTasksData>): UseDataConnectQueryResult<ListAllTasksData, undefined>;
```

### Variables
The `ListAllTasks` Query has no variables.
### Return Type
Recall that calling the `ListAllTasks` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListAllTasks` Query is of type `ListAllTasksData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListAllTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    completed: boolean;
    createdAt: TimestampString;
  } & Task_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListAllTasks`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListAllTasks } from '@dataconnect/generated/react'

export default function ListAllTasksComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListAllTasks();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListAllTasks(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListAllTasks(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListAllTasks(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.tasks);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetTaskById
You can execute the `GetTaskById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetTaskById(dc: DataConnect, vars: GetTaskByIdVariables, options?: useDataConnectQueryOptions<GetTaskByIdData>): UseDataConnectQueryResult<GetTaskByIdData, GetTaskByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetTaskById(vars: GetTaskByIdVariables, options?: useDataConnectQueryOptions<GetTaskByIdData>): UseDataConnectQueryResult<GetTaskByIdData, GetTaskByIdVariables>;
```

### Variables
The `GetTaskById` Query requires an argument of type `GetTaskByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetTaskByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetTaskById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetTaskById` Query is of type `GetTaskByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetTaskByIdData {
  task?: {
    id: UUIDString;
    title: string;
    description?: string | null;
    completed: boolean;
    createdAt: TimestampString;
  } & Task_Key;
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetTaskById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetTaskByIdVariables } from '@dataconnect/generated';
import { useGetTaskById } from '@dataconnect/generated/react'

export default function GetTaskByIdComponent() {
  // The `useGetTaskById` Query hook requires an argument of type `GetTaskByIdVariables`:
  const getTaskByIdVars: GetTaskByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetTaskById(getTaskByIdVars);
  // Variables can be defined inline as well.
  const query = useGetTaskById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetTaskById(dataConnect, getTaskByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetTaskById(getTaskByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetTaskById(dataConnect, getTaskByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.task);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListAuditRecords
You can execute the `ListAuditRecords` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListAuditRecords(dc: DataConnect, options?: useDataConnectQueryOptions<ListAuditRecordsData>): UseDataConnectQueryResult<ListAuditRecordsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListAuditRecords(options?: useDataConnectQueryOptions<ListAuditRecordsData>): UseDataConnectQueryResult<ListAuditRecordsData, undefined>;
```

### Variables
The `ListAuditRecords` Query has no variables.
### Return Type
Recall that calling the `ListAuditRecords` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListAuditRecords` Query is of type `ListAuditRecordsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListAuditRecords`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListAuditRecords } from '@dataconnect/generated/react'

export default function ListAuditRecordsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListAuditRecords();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListAuditRecords(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListAuditRecords(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListAuditRecords(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.auditRecords);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListIntelligenceModules
You can execute the `ListIntelligenceModules` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListIntelligenceModules(dc: DataConnect, options?: useDataConnectQueryOptions<ListIntelligenceModulesData>): UseDataConnectQueryResult<ListIntelligenceModulesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListIntelligenceModules(options?: useDataConnectQueryOptions<ListIntelligenceModulesData>): UseDataConnectQueryResult<ListIntelligenceModulesData, undefined>;
```

### Variables
The `ListIntelligenceModules` Query has no variables.
### Return Type
Recall that calling the `ListIntelligenceModules` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListIntelligenceModules` Query is of type `ListIntelligenceModulesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListIntelligenceModules`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListIntelligenceModules } from '@dataconnect/generated/react'

export default function ListIntelligenceModulesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListIntelligenceModules();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListIntelligenceModules(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListIntelligenceModules(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListIntelligenceModules(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.intelligenceModules);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListIntelligenceSources
You can execute the `ListIntelligenceSources` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListIntelligenceSources(dc: DataConnect, options?: useDataConnectQueryOptions<ListIntelligenceSourcesData>): UseDataConnectQueryResult<ListIntelligenceSourcesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListIntelligenceSources(options?: useDataConnectQueryOptions<ListIntelligenceSourcesData>): UseDataConnectQueryResult<ListIntelligenceSourcesData, undefined>;
```

### Variables
The `ListIntelligenceSources` Query has no variables.
### Return Type
Recall that calling the `ListIntelligenceSources` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListIntelligenceSources` Query is of type `ListIntelligenceSourcesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListIntelligenceSourcesData {
  intelligenceSources: ({
    id: UUIDString;
    category: string;
    name: string;
    type: string;
    status: string;
  } & IntelligenceSource_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListIntelligenceSources`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListIntelligenceSources } from '@dataconnect/generated/react'

export default function ListIntelligenceSourcesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListIntelligenceSources();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListIntelligenceSources(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListIntelligenceSources(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListIntelligenceSources(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.intelligenceSources);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListReports
You can execute the `ListReports` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListReports(dc: DataConnect, options?: useDataConnectQueryOptions<ListReportsData>): UseDataConnectQueryResult<ListReportsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListReports(options?: useDataConnectQueryOptions<ListReportsData>): UseDataConnectQueryResult<ListReportsData, undefined>;
```

### Variables
The `ListReports` Query has no variables.
### Return Type
Recall that calling the `ListReports` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListReports` Query is of type `ListReportsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListReports`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListReports } from '@dataconnect/generated/react'

export default function ListReportsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListReports();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListReports(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListReports(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListReports(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.reports);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetReportById
You can execute the `GetReportById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetReportById(dc: DataConnect, vars: GetReportByIdVariables, options?: useDataConnectQueryOptions<GetReportByIdData>): UseDataConnectQueryResult<GetReportByIdData, GetReportByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetReportById(vars: GetReportByIdVariables, options?: useDataConnectQueryOptions<GetReportByIdData>): UseDataConnectQueryResult<GetReportByIdData, GetReportByIdVariables>;
```

### Variables
The `GetReportById` Query requires an argument of type `GetReportByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetReportByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetReportById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetReportById` Query is of type `GetReportByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetReportById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetReportByIdVariables } from '@dataconnect/generated';
import { useGetReportById } from '@dataconnect/generated/react'

export default function GetReportByIdComponent() {
  // The `useGetReportById` Query hook requires an argument of type `GetReportByIdVariables`:
  const getReportByIdVars: GetReportByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetReportById(getReportByIdVars);
  // Variables can be defined inline as well.
  const query = useGetReportById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetReportById(dataConnect, getReportByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetReportById(getReportByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetReportById(dataConnect, getReportByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.report);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetReportSections
You can execute the `GetReportSections` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetReportSections(dc: DataConnect, vars: GetReportSectionsVariables, options?: useDataConnectQueryOptions<GetReportSectionsData>): UseDataConnectQueryResult<GetReportSectionsData, GetReportSectionsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetReportSections(vars: GetReportSectionsVariables, options?: useDataConnectQueryOptions<GetReportSectionsData>): UseDataConnectQueryResult<GetReportSectionsData, GetReportSectionsVariables>;
```

### Variables
The `GetReportSections` Query requires an argument of type `GetReportSectionsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetReportSectionsVariables {
  reportId: UUIDString;
}
```
### Return Type
Recall that calling the `GetReportSections` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetReportSections` Query is of type `GetReportSectionsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetReportSections`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetReportSectionsVariables } from '@dataconnect/generated';
import { useGetReportSections } from '@dataconnect/generated/react'

export default function GetReportSectionsComponent() {
  // The `useGetReportSections` Query hook requires an argument of type `GetReportSectionsVariables`:
  const getReportSectionsVars: GetReportSectionsVariables = {
    reportId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetReportSections(getReportSectionsVars);
  // Variables can be defined inline as well.
  const query = useGetReportSections({ reportId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetReportSections(dataConnect, getReportSectionsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetReportSections(getReportSectionsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetReportSections(dataConnect, getReportSectionsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.reportSections);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListCompanyMetric
You can execute the `ListCompanyMetric` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListCompanyMetric(dc: DataConnect, vars: ListCompanyMetricVariables, options?: useDataConnectQueryOptions<ListCompanyMetricData>): UseDataConnectQueryResult<ListCompanyMetricData, ListCompanyMetricVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCompanyMetric(vars: ListCompanyMetricVariables, options?: useDataConnectQueryOptions<ListCompanyMetricData>): UseDataConnectQueryResult<ListCompanyMetricData, ListCompanyMetricVariables>;
```

### Variables
The `ListCompanyMetric` Query requires an argument of type `ListCompanyMetricVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListCompanyMetricVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that calling the `ListCompanyMetric` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCompanyMetric` Query is of type `ListCompanyMetricData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCompanyMetric`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListCompanyMetricVariables } from '@dataconnect/generated';
import { useListCompanyMetric } from '@dataconnect/generated/react'

export default function ListCompanyMetricComponent() {
  // The `useListCompanyMetric` Query hook requires an argument of type `ListCompanyMetricVariables`:
  const listCompanyMetricVars: ListCompanyMetricVariables = {
    companyId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCompanyMetric(listCompanyMetricVars);
  // Variables can be defined inline as well.
  const query = useListCompanyMetric({ companyId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCompanyMetric(dataConnect, listCompanyMetricVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyMetric(listCompanyMetricVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyMetric(dataConnect, listCompanyMetricVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.companyMetrics);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListIntelligenceSignals
You can execute the `ListIntelligenceSignals` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListIntelligenceSignals(dc: DataConnect, options?: useDataConnectQueryOptions<ListIntelligenceSignalsData>): UseDataConnectQueryResult<ListIntelligenceSignalsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListIntelligenceSignals(options?: useDataConnectQueryOptions<ListIntelligenceSignalsData>): UseDataConnectQueryResult<ListIntelligenceSignalsData, undefined>;
```

### Variables
The `ListIntelligenceSignals` Query has no variables.
### Return Type
Recall that calling the `ListIntelligenceSignals` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListIntelligenceSignals` Query is of type `ListIntelligenceSignalsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListIntelligenceSignals`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListIntelligenceSignals } from '@dataconnect/generated/react'

export default function ListIntelligenceSignalsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListIntelligenceSignals();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListIntelligenceSignals(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListIntelligenceSignals(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListIntelligenceSignals(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.intelligenceSignals);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateTask
You can execute the `CreateTask` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
```

### Variables
The `CreateTask` Mutation requires an argument of type `CreateTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateTaskVariables {
  title: string;
  description?: string | null;
  createdAt: TimestampString;
}
```
### Return Type
Recall that calling the `CreateTask` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateTask` Mutation is of type `CreateTaskData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateTaskData {
  task: Task_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateTask`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateTaskVariables } from '@dataconnect/generated';
import { useCreateTask } from '@dataconnect/generated/react'

export default function CreateTaskComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateTask();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateTask(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTask(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateTask(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateTask` Mutation requires an argument of type `CreateTaskVariables`:
  const createTaskVars: CreateTaskVariables = {
    title: ..., 
    description: ..., // optional
    createdAt: ..., 
  };
  mutation.mutate(createTaskVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., description: ..., createdAt: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createTaskVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.task);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteTask
You can execute the `DeleteTask` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
```

### Variables
The `DeleteTask` Mutation requires an argument of type `DeleteTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteTaskVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteTask` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteTask` Mutation is of type `DeleteTaskData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteTaskData {
  task?: Task_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteTask`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteTaskVariables } from '@dataconnect/generated';
import { useDeleteTask } from '@dataconnect/generated/react'

export default function DeleteTaskComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteTask();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteTask(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTask(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteTask(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteTask` Mutation requires an argument of type `DeleteTaskVariables`:
  const deleteTaskVars: DeleteTaskVariables = {
    id: ..., 
  };
  mutation.mutate(deleteTaskVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteTaskVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.task);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateTaskStatus
You can execute the `UpdateTaskStatus` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateTaskStatus(options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateTaskStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskStatusData, FirebaseError, UpdateTaskStatusVariables>): UseDataConnectMutationResult<UpdateTaskStatusData, UpdateTaskStatusVariables>;
```

### Variables
The `UpdateTaskStatus` Mutation requires an argument of type `UpdateTaskStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateTaskStatusVariables {
  id: UUIDString;
  completed: boolean;
}
```
### Return Type
Recall that calling the `UpdateTaskStatus` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateTaskStatus` Mutation is of type `UpdateTaskStatusData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateTaskStatusData {
  task?: Task_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateTaskStatus`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateTaskStatusVariables } from '@dataconnect/generated';
import { useUpdateTaskStatus } from '@dataconnect/generated/react'

export default function UpdateTaskStatusComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateTaskStatus();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateTaskStatus(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTaskStatus(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateTaskStatus(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateTaskStatus` Mutation requires an argument of type `UpdateTaskStatusVariables`:
  const updateTaskStatusVars: UpdateTaskStatusVariables = {
    id: ..., 
    completed: ..., 
  };
  mutation.mutate(updateTaskStatusVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., completed: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateTaskStatusVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.task);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateAuditRecord
You can execute the `CreateAuditRecord` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateAuditRecord(options?: useDataConnectMutationOptions<CreateAuditRecordData, FirebaseError, CreateAuditRecordVariables>): UseDataConnectMutationResult<CreateAuditRecordData, CreateAuditRecordVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateAuditRecord(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAuditRecordData, FirebaseError, CreateAuditRecordVariables>): UseDataConnectMutationResult<CreateAuditRecordData, CreateAuditRecordVariables>;
```

### Variables
The `CreateAuditRecord` Mutation requires an argument of type `CreateAuditRecordVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `CreateAuditRecord` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateAuditRecord` Mutation is of type `CreateAuditRecordData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateAuditRecordData {
  auditRecord: AuditRecord_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateAuditRecord`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateAuditRecordVariables } from '@dataconnect/generated';
import { useCreateAuditRecord } from '@dataconnect/generated/react'

export default function CreateAuditRecordComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateAuditRecord();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateAuditRecord(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateAuditRecord(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateAuditRecord(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateAuditRecord` Mutation requires an argument of type `CreateAuditRecordVariables`:
  const createAuditRecordVars: CreateAuditRecordVariables = {
    title: ..., 
    dataType: ..., 
    source: ..., 
    category: ..., // optional
    standard: ..., // optional
    description: ..., // optional
    contentHash: ..., 
    zkpStatus: ..., 
    createdAt: ..., 
    metadata: ..., // optional
    proofSignature: ..., // optional
    verifierKey: ..., // optional
    algorithm: ..., // optional
    salt: ..., // optional
    proofJson: ..., // optional
  };
  mutation.mutate(createAuditRecordVars);
  // Variables can be defined inline as well.
  mutation.mutate({ title: ..., dataType: ..., source: ..., category: ..., standard: ..., description: ..., contentHash: ..., zkpStatus: ..., createdAt: ..., metadata: ..., proofSignature: ..., verifierKey: ..., algorithm: ..., salt: ..., proofJson: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createAuditRecordVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.auditRecord);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateAuditRecord
You can execute the `UpdateAuditRecord` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateAuditRecord(options?: useDataConnectMutationOptions<UpdateAuditRecordData, FirebaseError, UpdateAuditRecordVariables>): UseDataConnectMutationResult<UpdateAuditRecordData, UpdateAuditRecordVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateAuditRecord(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAuditRecordData, FirebaseError, UpdateAuditRecordVariables>): UseDataConnectMutationResult<UpdateAuditRecordData, UpdateAuditRecordVariables>;
```

### Variables
The `UpdateAuditRecord` Mutation requires an argument of type `UpdateAuditRecordVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpdateAuditRecord` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateAuditRecord` Mutation is of type `UpdateAuditRecordData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateAuditRecordData {
  auditRecord?: AuditRecord_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateAuditRecord`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateAuditRecordVariables } from '@dataconnect/generated';
import { useUpdateAuditRecord } from '@dataconnect/generated/react'

export default function UpdateAuditRecordComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateAuditRecord();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateAuditRecord(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateAuditRecord(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateAuditRecord(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateAuditRecord` Mutation requires an argument of type `UpdateAuditRecordVariables`:
  const updateAuditRecordVars: UpdateAuditRecordVariables = {
    id: ..., 
    title: ..., // optional
    dataType: ..., // optional
    source: ..., // optional
    category: ..., // optional
    standard: ..., // optional
    description: ..., // optional
    contentHash: ..., // optional
    zkpStatus: ..., // optional
    metadata: ..., // optional
    proofSignature: ..., // optional
    verifierKey: ..., // optional
    algorithm: ..., // optional
    salt: ..., // optional
    proofJson: ..., // optional
  };
  mutation.mutate(updateAuditRecordVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., title: ..., dataType: ..., source: ..., category: ..., standard: ..., description: ..., contentHash: ..., zkpStatus: ..., metadata: ..., proofSignature: ..., verifierKey: ..., algorithm: ..., salt: ..., proofJson: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateAuditRecordVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.auditRecord);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteAuditRecord
You can execute the `DeleteAuditRecord` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteAuditRecord(options?: useDataConnectMutationOptions<DeleteAuditRecordData, FirebaseError, DeleteAuditRecordVariables>): UseDataConnectMutationResult<DeleteAuditRecordData, DeleteAuditRecordVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteAuditRecord(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAuditRecordData, FirebaseError, DeleteAuditRecordVariables>): UseDataConnectMutationResult<DeleteAuditRecordData, DeleteAuditRecordVariables>;
```

### Variables
The `DeleteAuditRecord` Mutation requires an argument of type `DeleteAuditRecordVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteAuditRecordVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteAuditRecord` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteAuditRecord` Mutation is of type `DeleteAuditRecordData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteAuditRecordData {
  auditRecord?: AuditRecord_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteAuditRecord`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteAuditRecordVariables } from '@dataconnect/generated';
import { useDeleteAuditRecord } from '@dataconnect/generated/react'

export default function DeleteAuditRecordComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteAuditRecord();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteAuditRecord(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteAuditRecord(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteAuditRecord(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteAuditRecord` Mutation requires an argument of type `DeleteAuditRecordVariables`:
  const deleteAuditRecordVars: DeleteAuditRecordVariables = {
    id: ..., 
  };
  mutation.mutate(deleteAuditRecordVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteAuditRecordVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.auditRecord);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertIntelligenceModule
You can execute the `UpsertIntelligenceModule` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertIntelligenceModule(options?: useDataConnectMutationOptions<UpsertIntelligenceModuleData, FirebaseError, UpsertIntelligenceModuleVariables>): UseDataConnectMutationResult<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertIntelligenceModule(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertIntelligenceModuleData, FirebaseError, UpsertIntelligenceModuleVariables>): UseDataConnectMutationResult<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;
```

### Variables
The `UpsertIntelligenceModule` Mutation requires an argument of type `UpsertIntelligenceModuleVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpsertIntelligenceModule` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertIntelligenceModule` Mutation is of type `UpsertIntelligenceModuleData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertIntelligenceModuleData {
  intelligenceModule: IntelligenceModule_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertIntelligenceModule`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertIntelligenceModuleVariables } from '@dataconnect/generated';
import { useUpsertIntelligenceModule } from '@dataconnect/generated/react'

export default function UpsertIntelligenceModuleComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertIntelligenceModule();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertIntelligenceModule(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertIntelligenceModule(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertIntelligenceModule(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertIntelligenceModule` Mutation requires an argument of type `UpsertIntelligenceModuleVariables`:
  const upsertIntelligenceModuleVars: UpsertIntelligenceModuleVariables = {
    id: ..., 
    titleZh: ..., 
    titleEn: ..., 
    descriptionZh: ..., 
    descriptionEn: ..., 
    iconName: ..., 
    color: ..., 
    details: ..., // optional
  };
  mutation.mutate(upsertIntelligenceModuleVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., titleZh: ..., titleEn: ..., descriptionZh: ..., descriptionEn: ..., iconName: ..., color: ..., details: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertIntelligenceModuleVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.intelligenceModule);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertIntelligenceSource
You can execute the `UpsertIntelligenceSource` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertIntelligenceSource(options?: useDataConnectMutationOptions<UpsertIntelligenceSourceData, FirebaseError, UpsertIntelligenceSourceVariables>): UseDataConnectMutationResult<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertIntelligenceSource(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertIntelligenceSourceData, FirebaseError, UpsertIntelligenceSourceVariables>): UseDataConnectMutationResult<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;
```

### Variables
The `UpsertIntelligenceSource` Mutation requires an argument of type `UpsertIntelligenceSourceVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertIntelligenceSourceVariables {
  id?: UUIDString | null;
  category: string;
  name: string;
  type: string;
  status: string;
}
```
### Return Type
Recall that calling the `UpsertIntelligenceSource` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertIntelligenceSource` Mutation is of type `UpsertIntelligenceSourceData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertIntelligenceSourceData {
  intelligenceSource: IntelligenceSource_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertIntelligenceSource`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertIntelligenceSourceVariables } from '@dataconnect/generated';
import { useUpsertIntelligenceSource } from '@dataconnect/generated/react'

export default function UpsertIntelligenceSourceComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertIntelligenceSource();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertIntelligenceSource(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertIntelligenceSource(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertIntelligenceSource(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertIntelligenceSource` Mutation requires an argument of type `UpsertIntelligenceSourceVariables`:
  const upsertIntelligenceSourceVars: UpsertIntelligenceSourceVariables = {
    id: ..., // optional
    category: ..., 
    name: ..., 
    type: ..., 
    status: ..., 
  };
  mutation.mutate(upsertIntelligenceSourceVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., category: ..., name: ..., type: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertIntelligenceSourceVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.intelligenceSource);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertReport
You can execute the `UpsertReport` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertReport(options?: useDataConnectMutationOptions<UpsertReportData, FirebaseError, UpsertReportVariables>): UseDataConnectMutationResult<UpsertReportData, UpsertReportVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertReport(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReportData, FirebaseError, UpsertReportVariables>): UseDataConnectMutationResult<UpsertReportData, UpsertReportVariables>;
```

### Variables
The `UpsertReport` Mutation requires an argument of type `UpsertReportVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpsertReport` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertReport` Mutation is of type `UpsertReportData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertReportData {
  report: Report_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertReport`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertReportVariables } from '@dataconnect/generated';
import { useUpsertReport } from '@dataconnect/generated/react'

export default function UpsertReportComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertReport();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertReport(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertReport(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertReport(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertReport` Mutation requires an argument of type `UpsertReportVariables`:
  const upsertReportVars: UpsertReportVariables = {
    id: ..., // optional
    companyId: ..., 
    templateId: ..., 
    title: ..., 
    language: ..., 
    progress: ..., 
    status: ..., 
    createdAt: ..., 
    lastSavedAt: ..., // optional
  };
  mutation.mutate(upsertReportVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., companyId: ..., templateId: ..., title: ..., language: ..., progress: ..., status: ..., createdAt: ..., lastSavedAt: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertReportVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.report);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertReportSection
You can execute the `UpsertReportSection` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertReportSection(options?: useDataConnectMutationOptions<UpsertReportSectionData, FirebaseError, UpsertReportSectionVariables>): UseDataConnectMutationResult<UpsertReportSectionData, UpsertReportSectionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertReportSection(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertReportSectionData, FirebaseError, UpsertReportSectionVariables>): UseDataConnectMutationResult<UpsertReportSectionData, UpsertReportSectionVariables>;
```

### Variables
The `UpsertReportSection` Mutation requires an argument of type `UpsertReportSectionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertReportSectionVariables {
  id?: UUIDString | null;
  reportId: UUIDString;
  sectionId: string;
  title: string;
  content?: string | null;
  isDone: boolean;
  lastUpdated: TimestampString;
}
```
### Return Type
Recall that calling the `UpsertReportSection` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertReportSection` Mutation is of type `UpsertReportSectionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertReportSectionData {
  reportSection: ReportSection_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertReportSection`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertReportSectionVariables } from '@dataconnect/generated';
import { useUpsertReportSection } from '@dataconnect/generated/react'

export default function UpsertReportSectionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertReportSection();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertReportSection(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertReportSection(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertReportSection(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertReportSection` Mutation requires an argument of type `UpsertReportSectionVariables`:
  const upsertReportSectionVars: UpsertReportSectionVariables = {
    id: ..., // optional
    reportId: ..., 
    sectionId: ..., 
    title: ..., 
    content: ..., // optional
    isDone: ..., 
    lastUpdated: ..., 
  };
  mutation.mutate(upsertReportSectionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., reportId: ..., sectionId: ..., title: ..., content: ..., isDone: ..., lastUpdated: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertReportSectionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.reportSection);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertCompanyMetric
You can execute the `UpsertCompanyMetric` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertCompanyMetric(options?: useDataConnectMutationOptions<UpsertCompanyMetricData, FirebaseError, UpsertCompanyMetricVariables>): UseDataConnectMutationResult<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertCompanyMetric(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompanyMetricData, FirebaseError, UpsertCompanyMetricVariables>): UseDataConnectMutationResult<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;
```

### Variables
The `UpsertCompanyMetric` Mutation requires an argument of type `UpsertCompanyMetricVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
```
### Return Type
Recall that calling the `UpsertCompanyMetric` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertCompanyMetric` Mutation is of type `UpsertCompanyMetricData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertCompanyMetricData {
  companyMetric_upsert: CompanyMetric_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertCompanyMetric`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertCompanyMetricVariables } from '@dataconnect/generated';
import { useUpsertCompanyMetric } from '@dataconnect/generated/react'

export default function UpsertCompanyMetricComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertCompanyMetric();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertCompanyMetric(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCompanyMetric(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCompanyMetric(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertCompanyMetric` Mutation requires an argument of type `UpsertCompanyMetricVariables`:
  const upsertCompanyMetricVars: UpsertCompanyMetricVariables = {
    id: ..., // optional
    companyId: ..., 
    readinessScore: ..., 
    complianceRate: ..., 
    riskLevel: ..., 
    efficiencyRate: ..., 
    trustScore: ..., 
    updatedAt: ..., 
  };
  mutation.mutate(upsertCompanyMetricVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., companyId: ..., readinessScore: ..., complianceRate: ..., riskLevel: ..., efficiencyRate: ..., trustScore: ..., updatedAt: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertCompanyMetricVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.companyMetric_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertIntelligenceSignal
You can execute the `UpsertIntelligenceSignal` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertIntelligenceSignal(options?: useDataConnectMutationOptions<UpsertIntelligenceSignalData, FirebaseError, UpsertIntelligenceSignalVariables>): UseDataConnectMutationResult<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertIntelligenceSignal(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertIntelligenceSignalData, FirebaseError, UpsertIntelligenceSignalVariables>): UseDataConnectMutationResult<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;
```

### Variables
The `UpsertIntelligenceSignal` Mutation requires an argument of type `UpsertIntelligenceSignalVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertIntelligenceSignalVariables {
  id?: UUIDString | null;
  title: string;
  content: string;
  severity: string;
  timestamp: TimestampString;
}
```
### Return Type
Recall that calling the `UpsertIntelligenceSignal` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertIntelligenceSignal` Mutation is of type `UpsertIntelligenceSignalData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertIntelligenceSignalData {
  intelligenceSignal: IntelligenceSignal_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertIntelligenceSignal`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertIntelligenceSignalVariables } from '@dataconnect/generated';
import { useUpsertIntelligenceSignal } from '@dataconnect/generated/react'

export default function UpsertIntelligenceSignalComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertIntelligenceSignal();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertIntelligenceSignal(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertIntelligenceSignal(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertIntelligenceSignal(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertIntelligenceSignal` Mutation requires an argument of type `UpsertIntelligenceSignalVariables`:
  const upsertIntelligenceSignalVars: UpsertIntelligenceSignalVariables = {
    id: ..., // optional
    title: ..., 
    content: ..., 
    severity: ..., 
    timestamp: ..., 
  };
  mutation.mutate(upsertIntelligenceSignalVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., title: ..., content: ..., severity: ..., timestamp: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertIntelligenceSignalVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.intelligenceSignal);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateDemoData
You can execute the `CreateDemoData` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateDemoData(options?: useDataConnectMutationOptions<CreateDemoDataData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoDataData, undefined>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateDemoData(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDemoDataData, FirebaseError, void>): UseDataConnectMutationResult<CreateDemoDataData, undefined>;
```

### Variables
The `CreateDemoData` Mutation has no variables.
### Return Type
Recall that calling the `CreateDemoData` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateDemoData` Mutation is of type `CreateDemoDataData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateDemoDataData {
  user_insertMany: User_Key[];
  comment_insertMany: Comment_Key[];
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateDemoData`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useCreateDemoData } from '@dataconnect/generated/react'

export default function CreateDemoDataComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateDemoData();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateDemoData(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateDemoData(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateDemoData(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  mutation.mutate();

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  // Since this Mutation accepts no variables, you must pass `undefined` where you would normally pass the variables.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(undefined, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_insertMany);
    console.log(mutation.data.comment_insertMany);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

