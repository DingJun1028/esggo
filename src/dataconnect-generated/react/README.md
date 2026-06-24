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
  - [*ListScrapedArticles*](#listscrapedarticles)
  - [*ListRoadmapMilestones*](#listroadmapmilestones)
  - [*GetCompanyProfile*](#getcompanyprofile)
  - [*GetReportById*](#getreportbyid)
  - [*ListReports*](#listreports)
  - [*ListCompanyMetricsByCategory*](#listcompanymetricsbycategory)
  - [*ListEternalMemories*](#listeternalmemories)
  - [*ListSwarmAgentTasks*](#listswarmagenttasks)
  - [*ListRegulatoryPolicies*](#listregulatorypolicies)
- [**Mutations**](#mutations)
  - [*UpsertTask*](#upserttask)
  - [*UpsertRoadmapMilestone*](#upsertroadmapmilestone)
  - [*UpsertCompanyProfile*](#upsertcompanyprofile)
  - [*UpsertReport*](#upsertreport)
  - [*UpsertCompanyMetric*](#upsertcompanymetric)
  - [*UpsertScrapedArticle*](#upsertscrapedarticle)
  - [*UpsertEternalMemory*](#upserteternalmemory)
  - [*UpsertSwarmAgentTask*](#upsertswarmagenttask)
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
    status: string;
    priority: string;
    assignee?: string | null;
    department?: string | null;
    griReference?: string | null;
    dueDate?: DateString | null;
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
    user: {
      uid: string;
    } & User_Key;
      title: string;
      description?: string | null;
      completed: boolean;
      status: string;
      priority: string;
      assignee?: string | null;
      department?: string | null;
      griReference?: string | null;
      dueDate?: DateString | null;
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
    standard?: string | null;
    description?: string | null;
    contentHash: string;
    zkpStatus: string;
    createdAt: TimestampString;
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

## ListScrapedArticles
You can execute the `ListScrapedArticles` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListScrapedArticles(dc: DataConnect, options?: useDataConnectQueryOptions<ListScrapedArticlesData>): UseDataConnectQueryResult<ListScrapedArticlesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListScrapedArticles(options?: useDataConnectQueryOptions<ListScrapedArticlesData>): UseDataConnectQueryResult<ListScrapedArticlesData, undefined>;
```

### Variables
The `ListScrapedArticles` Query has no variables.
### Return Type
Recall that calling the `ListScrapedArticles` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListScrapedArticles` Query is of type `ListScrapedArticlesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListScrapedArticlesData {
  scrapedArticles: ({
    id: UUIDString;
    title: string;
    summary?: string | null;
    url: string;
    source: string;
    publishedAt?: DateString | null;
    category: string;
    tags?: string | null;
    impactLevel: string;
    scrapedAt: TimestampString;
  } & ScrapedArticle_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListScrapedArticles`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListScrapedArticles } from '@dataconnect/generated/react'

export default function ListScrapedArticlesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListScrapedArticles();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListScrapedArticles(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListScrapedArticles(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListScrapedArticles(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.scrapedArticles);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListRoadmapMilestones
You can execute the `ListRoadmapMilestones` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListRoadmapMilestones(dc: DataConnect, options?: useDataConnectQueryOptions<ListRoadmapMilestonesData>): UseDataConnectQueryResult<ListRoadmapMilestonesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListRoadmapMilestones(options?: useDataConnectQueryOptions<ListRoadmapMilestonesData>): UseDataConnectQueryResult<ListRoadmapMilestonesData, undefined>;
```

### Variables
The `ListRoadmapMilestones` Query has no variables.
### Return Type
Recall that calling the `ListRoadmapMilestones` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListRoadmapMilestones` Query is of type `ListRoadmapMilestonesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListRoadmapMilestonesData {
  roadmapMilestones: ({
    id: UUIDString;
    title: string;
    targetYear: number;
    category: string;
    status: string;
    targetValue?: number | null;
    unit?: string | null;
    sbtiAligned: boolean;
  } & RoadmapMilestone_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListRoadmapMilestones`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListRoadmapMilestones } from '@dataconnect/generated/react'

export default function ListRoadmapMilestonesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListRoadmapMilestones();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListRoadmapMilestones(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListRoadmapMilestones(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListRoadmapMilestones(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.roadmapMilestones);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetCompanyProfile
You can execute the `GetCompanyProfile` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetCompanyProfile(dc: DataConnect, vars: GetCompanyProfileVariables, options?: useDataConnectQueryOptions<GetCompanyProfileData>): UseDataConnectQueryResult<GetCompanyProfileData, GetCompanyProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetCompanyProfile(vars: GetCompanyProfileVariables, options?: useDataConnectQueryOptions<GetCompanyProfileData>): UseDataConnectQueryResult<GetCompanyProfileData, GetCompanyProfileVariables>;
```

### Variables
The `GetCompanyProfile` Query requires an argument of type `GetCompanyProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetCompanyProfileVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetCompanyProfile` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetCompanyProfile` Query is of type `GetCompanyProfileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetCompanyProfileData {
  companyProfile?: {
    id: UUIDString;
    name: string;
    industry?: string | null;
    headquarters?: string | null;
    vision?: string | null;
    mission?: string | null;
    employeeCount?: number | null;
    revenueTwd?: number | null;
    capitalTwd?: number | null;
    user?: {
      uid: string;
    } & User_Key;
  } & CompanyProfile_Key;
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetCompanyProfile`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetCompanyProfileVariables } from '@dataconnect/generated';
import { useGetCompanyProfile } from '@dataconnect/generated/react'

export default function GetCompanyProfileComponent() {
  // The `useGetCompanyProfile` Query hook requires an argument of type `GetCompanyProfileVariables`:
  const getCompanyProfileVars: GetCompanyProfileVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetCompanyProfile(getCompanyProfileVars);
  // Variables can be defined inline as well.
  const query = useGetCompanyProfile({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetCompanyProfile(dataConnect, getCompanyProfileVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetCompanyProfile(getCompanyProfileVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetCompanyProfile(dataConnect, getCompanyProfileVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.companyProfile);
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
    title: string;
    progress: number;
    status: string;
    language: string;
    templateId: string;
    createdAt: TimestampString;
    company: {
      id: UUIDString;
      name: string;
      user?: {
        uid: string;
      } & User_Key;
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
    title: string;
    progress: number;
    status: string;
    language: string;
    templateId: string;
    createdAt: TimestampString;
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

## ListCompanyMetricsByCategory
You can execute the `ListCompanyMetricsByCategory` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListCompanyMetricsByCategory(dc: DataConnect, vars: ListCompanyMetricsByCategoryVariables, options?: useDataConnectQueryOptions<ListCompanyMetricsByCategoryData>): UseDataConnectQueryResult<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCompanyMetricsByCategory(vars: ListCompanyMetricsByCategoryVariables, options?: useDataConnectQueryOptions<ListCompanyMetricsByCategoryData>): UseDataConnectQueryResult<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;
```

### Variables
The `ListCompanyMetricsByCategory` Query requires an argument of type `ListCompanyMetricsByCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListCompanyMetricsByCategoryVariables {
  companyId: UUIDString;
  category: string;
}
```
### Return Type
Recall that calling the `ListCompanyMetricsByCategory` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCompanyMetricsByCategory` Query is of type `ListCompanyMetricsByCategoryData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListCompanyMetricsByCategoryData {
  companyMetrics: ({
    id: UUIDString;
    metricName: string;
    metricValue?: number | null;
    unit?: string | null;
    category: string;
    verified: boolean;
    griStandard?: string | null;
    updatedAt: TimestampString;
  } & CompanyMetric_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCompanyMetricsByCategory`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListCompanyMetricsByCategoryVariables } from '@dataconnect/generated';
import { useListCompanyMetricsByCategory } from '@dataconnect/generated/react'

export default function ListCompanyMetricsByCategoryComponent() {
  // The `useListCompanyMetricsByCategory` Query hook requires an argument of type `ListCompanyMetricsByCategoryVariables`:
  const listCompanyMetricsByCategoryVars: ListCompanyMetricsByCategoryVariables = {
    companyId: ..., 
    category: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCompanyMetricsByCategory(listCompanyMetricsByCategoryVars);
  // Variables can be defined inline as well.
  const query = useListCompanyMetricsByCategory({ companyId: ..., category: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCompanyMetricsByCategory(dataConnect, listCompanyMetricsByCategoryVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyMetricsByCategory(listCompanyMetricsByCategoryVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCompanyMetricsByCategory(dataConnect, listCompanyMetricsByCategoryVars, options);

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

## ListEternalMemories
You can execute the `ListEternalMemories` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListEternalMemories(dc: DataConnect, options?: useDataConnectQueryOptions<ListEternalMemoriesData>): UseDataConnectQueryResult<ListEternalMemoriesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListEternalMemories(options?: useDataConnectQueryOptions<ListEternalMemoriesData>): UseDataConnectQueryResult<ListEternalMemoriesData, undefined>;
```

### Variables
The `ListEternalMemories` Query has no variables.
### Return Type
Recall that calling the `ListEternalMemories` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListEternalMemories` Query is of type `ListEternalMemoriesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListEternalMemoriesData {
  eternalMemories: ({
    id: UUIDString;
    type: string;
    content: string;
    tags?: string | null;
    hashLock: string;
    consolidated: boolean;
    createdAt: TimestampString;
  } & EternalMemory_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListEternalMemories`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListEternalMemories } from '@dataconnect/generated/react'

export default function ListEternalMemoriesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListEternalMemories();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListEternalMemories(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListEternalMemories(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListEternalMemories(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.eternalMemories);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListSwarmAgentTasks
You can execute the `ListSwarmAgentTasks` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListSwarmAgentTasks(dc: DataConnect, options?: useDataConnectQueryOptions<ListSwarmAgentTasksData>): UseDataConnectQueryResult<ListSwarmAgentTasksData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListSwarmAgentTasks(options?: useDataConnectQueryOptions<ListSwarmAgentTasksData>): UseDataConnectQueryResult<ListSwarmAgentTasksData, undefined>;
```

### Variables
The `ListSwarmAgentTasks` Query has no variables.
### Return Type
Recall that calling the `ListSwarmAgentTasks` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListSwarmAgentTasks` Query is of type `ListSwarmAgentTasksData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListSwarmAgentTasksData {
  swarmAgentTasks: ({
    id: UUIDString;
    title: string;
    taskType: string;
    status: string;
    agentId?: string | null;
    progress: number;
    skillKey?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & SwarmAgentTask_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListSwarmAgentTasks`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListSwarmAgentTasks } from '@dataconnect/generated/react'

export default function ListSwarmAgentTasksComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListSwarmAgentTasks();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListSwarmAgentTasks(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListSwarmAgentTasks(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListSwarmAgentTasks(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.swarmAgentTasks);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListRegulatoryPolicies
You can execute the `ListRegulatoryPolicies` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListRegulatoryPolicies(dc: DataConnect, options?: useDataConnectQueryOptions<ListRegulatoryPoliciesData>): UseDataConnectQueryResult<ListRegulatoryPoliciesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListRegulatoryPolicies(options?: useDataConnectQueryOptions<ListRegulatoryPoliciesData>): UseDataConnectQueryResult<ListRegulatoryPoliciesData, undefined>;
```

### Variables
The `ListRegulatoryPolicies` Query has no variables.
### Return Type
Recall that calling the `ListRegulatoryPolicies` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListRegulatoryPolicies` Query is of type `ListRegulatoryPoliciesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListRegulatoryPoliciesData {
  regulatoryPolicies: ({
    id: string;
    standard: string;
    code: string;
    name: string;
    description?: string | null;
    rulesJson: string;
  } & RegulatoryPolicy_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListRegulatoryPolicies`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListRegulatoryPolicies } from '@dataconnect/generated/react'

export default function ListRegulatoryPoliciesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListRegulatoryPolicies();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListRegulatoryPolicies(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListRegulatoryPolicies(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListRegulatoryPolicies(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.regulatoryPolicies);
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

## UpsertTask
You can execute the `UpsertTask` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertTask(options?: useDataConnectMutationOptions<UpsertTaskData, FirebaseError, UpsertTaskVariables>): UseDataConnectMutationResult<UpsertTaskData, UpsertTaskVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertTaskData, FirebaseError, UpsertTaskVariables>): UseDataConnectMutationResult<UpsertTaskData, UpsertTaskVariables>;
```

### Variables
The `UpsertTask` Mutation requires an argument of type `UpsertTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertTaskVariables {
  id?: UUIDString | null;
  title: string;
  description?: string | null;
  completed: boolean;
  status: string;
  priority: string;
  assignee?: string | null;
  department?: string | null;
  griReference?: string | null;
  dueDate?: DateString | null;
}
```
### Return Type
Recall that calling the `UpsertTask` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertTask` Mutation is of type `UpsertTaskData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertTaskData {
  task_upsert: Task_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertTask`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertTaskVariables } from '@dataconnect/generated';
import { useUpsertTask } from '@dataconnect/generated/react'

export default function UpsertTaskComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertTask();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertTask(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertTask(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertTask(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertTask` Mutation requires an argument of type `UpsertTaskVariables`:
  const upsertTaskVars: UpsertTaskVariables = {
    id: ..., // optional
    title: ..., 
    description: ..., // optional
    completed: ..., 
    status: ..., 
    priority: ..., 
    assignee: ..., // optional
    department: ..., // optional
    griReference: ..., // optional
    dueDate: ..., // optional
  };
  mutation.mutate(upsertTaskVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., title: ..., description: ..., completed: ..., status: ..., priority: ..., assignee: ..., department: ..., griReference: ..., dueDate: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertTaskVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.task_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertRoadmapMilestone
You can execute the `UpsertRoadmapMilestone` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertRoadmapMilestone(options?: useDataConnectMutationOptions<UpsertRoadmapMilestoneData, FirebaseError, UpsertRoadmapMilestoneVariables>): UseDataConnectMutationResult<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertRoadmapMilestone(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertRoadmapMilestoneData, FirebaseError, UpsertRoadmapMilestoneVariables>): UseDataConnectMutationResult<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;
```

### Variables
The `UpsertRoadmapMilestone` Mutation requires an argument of type `UpsertRoadmapMilestoneVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertRoadmapMilestoneVariables {
  id?: UUIDString | null;
  title: string;
  targetYear: number;
  category: string;
  status: string;
  targetValue?: number | null;
  unit?: string | null;
  sbtiAligned: boolean;
}
```
### Return Type
Recall that calling the `UpsertRoadmapMilestone` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertRoadmapMilestone` Mutation is of type `UpsertRoadmapMilestoneData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertRoadmapMilestoneData {
  roadmapMilestone_upsert: RoadmapMilestone_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertRoadmapMilestone`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertRoadmapMilestoneVariables } from '@dataconnect/generated';
import { useUpsertRoadmapMilestone } from '@dataconnect/generated/react'

export default function UpsertRoadmapMilestoneComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertRoadmapMilestone();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertRoadmapMilestone(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertRoadmapMilestone(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertRoadmapMilestone(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertRoadmapMilestone` Mutation requires an argument of type `UpsertRoadmapMilestoneVariables`:
  const upsertRoadmapMilestoneVars: UpsertRoadmapMilestoneVariables = {
    id: ..., // optional
    title: ..., 
    targetYear: ..., 
    category: ..., 
    status: ..., 
    targetValue: ..., // optional
    unit: ..., // optional
    sbtiAligned: ..., 
  };
  mutation.mutate(upsertRoadmapMilestoneVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., title: ..., targetYear: ..., category: ..., status: ..., targetValue: ..., unit: ..., sbtiAligned: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertRoadmapMilestoneVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.roadmapMilestone_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertCompanyProfile
You can execute the `UpsertCompanyProfile` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertCompanyProfile(options?: useDataConnectMutationOptions<UpsertCompanyProfileData, FirebaseError, UpsertCompanyProfileVariables>): UseDataConnectMutationResult<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertCompanyProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertCompanyProfileData, FirebaseError, UpsertCompanyProfileVariables>): UseDataConnectMutationResult<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;
```

### Variables
The `UpsertCompanyProfile` Mutation requires an argument of type `UpsertCompanyProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertCompanyProfileVariables {
  id?: UUIDString | null;
  name: string;
  industry?: string | null;
  vision?: string | null;
  mission?: string | null;
  employeeCount?: number | null;
  revenueTwd?: number | null;
  capitalTwd?: number | null;
}
```
### Return Type
Recall that calling the `UpsertCompanyProfile` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertCompanyProfile` Mutation is of type `UpsertCompanyProfileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertCompanyProfileData {
  companyProfile_upsert: CompanyProfile_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertCompanyProfile`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertCompanyProfileVariables } from '@dataconnect/generated';
import { useUpsertCompanyProfile } from '@dataconnect/generated/react'

export default function UpsertCompanyProfileComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertCompanyProfile();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertCompanyProfile(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCompanyProfile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertCompanyProfile(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertCompanyProfile` Mutation requires an argument of type `UpsertCompanyProfileVariables`:
  const upsertCompanyProfileVars: UpsertCompanyProfileVariables = {
    id: ..., // optional
    name: ..., 
    industry: ..., // optional
    vision: ..., // optional
    mission: ..., // optional
    employeeCount: ..., // optional
    revenueTwd: ..., // optional
    capitalTwd: ..., // optional
  };
  mutation.mutate(upsertCompanyProfileVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., industry: ..., vision: ..., mission: ..., employeeCount: ..., revenueTwd: ..., capitalTwd: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertCompanyProfileVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.companyProfile_upsert);
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
}
```
### Return Type
Recall that calling the `UpsertReport` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertReport` Mutation is of type `UpsertReportData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertReportData {
  report_upsert: Report_Key;
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
  };
  mutation.mutate(upsertReportVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., companyId: ..., templateId: ..., title: ..., language: ..., progress: ..., status: ..., });

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
    console.log(mutation.data.report_upsert);
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
  metricName: string;
  metricValue?: number | null;
  unit?: string | null;
  category: string;
  verified: boolean;
  griStandard?: string | null;
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
    metricName: ..., 
    metricValue: ..., // optional
    unit: ..., // optional
    category: ..., 
    verified: ..., 
    griStandard: ..., // optional
  };
  mutation.mutate(upsertCompanyMetricVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., companyId: ..., metricName: ..., metricValue: ..., unit: ..., category: ..., verified: ..., griStandard: ..., });

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

## UpsertScrapedArticle
You can execute the `UpsertScrapedArticle` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertScrapedArticle(options?: useDataConnectMutationOptions<UpsertScrapedArticleData, FirebaseError, UpsertScrapedArticleVariables>): UseDataConnectMutationResult<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertScrapedArticle(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertScrapedArticleData, FirebaseError, UpsertScrapedArticleVariables>): UseDataConnectMutationResult<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;
```

### Variables
The `UpsertScrapedArticle` Mutation requires an argument of type `UpsertScrapedArticleVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertScrapedArticleVariables {
  id?: UUIDString | null;
  title: string;
  summary?: string | null;
  url: string;
  source: string;
  publishedAt?: DateString | null;
  category: string;
  tags?: string | null;
  impactLevel: string;
}
```
### Return Type
Recall that calling the `UpsertScrapedArticle` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertScrapedArticle` Mutation is of type `UpsertScrapedArticleData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertScrapedArticleData {
  scrapedArticle_upsert: ScrapedArticle_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertScrapedArticle`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertScrapedArticleVariables } from '@dataconnect/generated';
import { useUpsertScrapedArticle } from '@dataconnect/generated/react'

export default function UpsertScrapedArticleComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertScrapedArticle();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertScrapedArticle(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertScrapedArticle(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertScrapedArticle(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertScrapedArticle` Mutation requires an argument of type `UpsertScrapedArticleVariables`:
  const upsertScrapedArticleVars: UpsertScrapedArticleVariables = {
    id: ..., // optional
    title: ..., 
    summary: ..., // optional
    url: ..., 
    source: ..., 
    publishedAt: ..., // optional
    category: ..., 
    tags: ..., // optional
    impactLevel: ..., 
  };
  mutation.mutate(upsertScrapedArticleVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., title: ..., summary: ..., url: ..., source: ..., publishedAt: ..., category: ..., tags: ..., impactLevel: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertScrapedArticleVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.scrapedArticle_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertEternalMemory
You can execute the `UpsertEternalMemory` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertEternalMemory(options?: useDataConnectMutationOptions<UpsertEternalMemoryData, FirebaseError, UpsertEternalMemoryVariables>): UseDataConnectMutationResult<UpsertEternalMemoryData, UpsertEternalMemoryVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertEternalMemory(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertEternalMemoryData, FirebaseError, UpsertEternalMemoryVariables>): UseDataConnectMutationResult<UpsertEternalMemoryData, UpsertEternalMemoryVariables>;
```

### Variables
The `UpsertEternalMemory` Mutation requires an argument of type `UpsertEternalMemoryVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertEternalMemoryVariables {
  id?: UUIDString | null;
  type: string;
  content: string;
  tags?: string | null;
  hashLock: string;
  consolidated: boolean;
}
```
### Return Type
Recall that calling the `UpsertEternalMemory` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertEternalMemory` Mutation is of type `UpsertEternalMemoryData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertEternalMemoryData {
  eternalMemory_upsert: EternalMemory_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertEternalMemory`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertEternalMemoryVariables } from '@dataconnect/generated';
import { useUpsertEternalMemory } from '@dataconnect/generated/react'

export default function UpsertEternalMemoryComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertEternalMemory();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertEternalMemory(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertEternalMemory(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertEternalMemory(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertEternalMemory` Mutation requires an argument of type `UpsertEternalMemoryVariables`:
  const upsertEternalMemoryVars: UpsertEternalMemoryVariables = {
    id: ..., // optional
    type: ..., 
    content: ..., 
    tags: ..., // optional
    hashLock: ..., 
    consolidated: ..., 
  };
  mutation.mutate(upsertEternalMemoryVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., type: ..., content: ..., tags: ..., hashLock: ..., consolidated: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertEternalMemoryVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.eternalMemory_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertSwarmAgentTask
You can execute the `UpsertSwarmAgentTask` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertSwarmAgentTask(options?: useDataConnectMutationOptions<UpsertSwarmAgentTaskData, FirebaseError, UpsertSwarmAgentTaskVariables>): UseDataConnectMutationResult<UpsertSwarmAgentTaskData, UpsertSwarmAgentTaskVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertSwarmAgentTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertSwarmAgentTaskData, FirebaseError, UpsertSwarmAgentTaskVariables>): UseDataConnectMutationResult<UpsertSwarmAgentTaskData, UpsertSwarmAgentTaskVariables>;
```

### Variables
The `UpsertSwarmAgentTask` Mutation requires an argument of type `UpsertSwarmAgentTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpsertSwarmAgentTaskVariables {
  id?: UUIDString | null;
  title: string;
  taskType: string;
  status: string;
  agentId?: string | null;
  progress: number;
  skillKey?: string | null;
}
```
### Return Type
Recall that calling the `UpsertSwarmAgentTask` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertSwarmAgentTask` Mutation is of type `UpsertSwarmAgentTaskData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertSwarmAgentTaskData {
  swarmAgentTask_upsert: SwarmAgentTask_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertSwarmAgentTask`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertSwarmAgentTaskVariables } from '@dataconnect/generated';
import { useUpsertSwarmAgentTask } from '@dataconnect/generated/react'

export default function UpsertSwarmAgentTaskComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertSwarmAgentTask();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertSwarmAgentTask(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertSwarmAgentTask(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertSwarmAgentTask(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertSwarmAgentTask` Mutation requires an argument of type `UpsertSwarmAgentTaskVariables`:
  const upsertSwarmAgentTaskVars: UpsertSwarmAgentTaskVariables = {
    id: ..., // optional
    title: ..., 
    taskType: ..., 
    status: ..., 
    agentId: ..., // optional
    progress: ..., 
    skillKey: ..., // optional
  };
  mutation.mutate(upsertSwarmAgentTaskVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., title: ..., taskType: ..., status: ..., agentId: ..., progress: ..., skillKey: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertSwarmAgentTaskVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.swarmAgentTask_upsert);
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

