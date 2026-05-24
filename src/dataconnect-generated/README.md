# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
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
- [**Mutations**](#mutations)
  - [*UpsertTask*](#upserttask)
  - [*UpsertRoadmapMilestone*](#upsertroadmapmilestone)
  - [*UpsertCompanyProfile*](#upsertcompanyprofile)
  - [*UpsertReport*](#upsertreport)
  - [*UpsertCompanyMetric*](#upsertcompanymetric)
  - [*UpsertScrapedArticle*](#upsertscrapedarticle)
  - [*CreateDemoData*](#createdemodata)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAllTasks
You can execute the `ListAllTasks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllTasks(options?: ExecuteQueryOptions): QueryPromise<ListAllTasksData, undefined>;

interface ListAllTasksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllTasksData, undefined>;
}
export const listAllTasksRef: ListAllTasksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllTasks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllTasksData, undefined>;

interface ListAllTasksRef {
  ...
  (dc: DataConnect): QueryRef<ListAllTasksData, undefined>;
}
export const listAllTasksRef: ListAllTasksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllTasksRef:
```typescript
const name = listAllTasksRef.operationName;
console.log(name);
```

### Variables
The `ListAllTasks` query has no variables.
### Return Type
Recall that executing the `ListAllTasks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllTasksData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListAllTasks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllTasks } from '@dataconnect/generated';


// Call the `listAllTasks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllTasks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllTasks(dataConnect);

console.log(data.tasks);

// Or, you can use the `Promise` API.
listAllTasks().then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

### Using `ListAllTasks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllTasksRef } from '@dataconnect/generated';


// Call the `listAllTasksRef()` function to get a reference to the query.
const ref = listAllTasksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllTasksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tasks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

## GetTaskById
You can execute the `GetTaskById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getTaskById(vars: GetTaskByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskByIdData, GetTaskByIdVariables>;

interface GetTaskByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTaskByIdVariables): QueryRef<GetTaskByIdData, GetTaskByIdVariables>;
}
export const getTaskByIdRef: GetTaskByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getTaskById(dc: DataConnect, vars: GetTaskByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetTaskByIdData, GetTaskByIdVariables>;

interface GetTaskByIdRef {
  ...
  (dc: DataConnect, vars: GetTaskByIdVariables): QueryRef<GetTaskByIdData, GetTaskByIdVariables>;
}
export const getTaskByIdRef: GetTaskByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getTaskByIdRef:
```typescript
const name = getTaskByIdRef.operationName;
console.log(name);
```

### Variables
The `GetTaskById` query requires an argument of type `GetTaskByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetTaskByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetTaskById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetTaskByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetTaskByIdData {
  task?: {
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
  } & Task_Key;
}
```
### Using `GetTaskById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getTaskById, GetTaskByIdVariables } from '@dataconnect/generated';

// The `GetTaskById` query requires an argument of type `GetTaskByIdVariables`:
const getTaskByIdVars: GetTaskByIdVariables = {
  id: ..., 
};

// Call the `getTaskById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getTaskById(getTaskByIdVars);
// Variables can be defined inline as well.
const { data } = await getTaskById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getTaskById(dataConnect, getTaskByIdVars);

console.log(data.task);

// Or, you can use the `Promise` API.
getTaskById(getTaskByIdVars).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

### Using `GetTaskById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getTaskByIdRef, GetTaskByIdVariables } from '@dataconnect/generated';

// The `GetTaskById` query requires an argument of type `GetTaskByIdVariables`:
const getTaskByIdVars: GetTaskByIdVariables = {
  id: ..., 
};

// Call the `getTaskByIdRef()` function to get a reference to the query.
const ref = getTaskByIdRef(getTaskByIdVars);
// Variables can be defined inline as well.
const ref = getTaskByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getTaskByIdRef(dataConnect, getTaskByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.task);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

## ListAuditRecords
You can execute the `ListAuditRecords` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAuditRecords(options?: ExecuteQueryOptions): QueryPromise<ListAuditRecordsData, undefined>;

interface ListAuditRecordsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAuditRecordsData, undefined>;
}
export const listAuditRecordsRef: ListAuditRecordsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAuditRecords(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAuditRecordsData, undefined>;

interface ListAuditRecordsRef {
  ...
  (dc: DataConnect): QueryRef<ListAuditRecordsData, undefined>;
}
export const listAuditRecordsRef: ListAuditRecordsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAuditRecordsRef:
```typescript
const name = listAuditRecordsRef.operationName;
console.log(name);
```

### Variables
The `ListAuditRecords` query has no variables.
### Return Type
Recall that executing the `ListAuditRecords` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAuditRecordsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListAuditRecords`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAuditRecords } from '@dataconnect/generated';


// Call the `listAuditRecords()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAuditRecords();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAuditRecords(dataConnect);

console.log(data.auditRecords);

// Or, you can use the `Promise` API.
listAuditRecords().then((response) => {
  const data = response.data;
  console.log(data.auditRecords);
});
```

### Using `ListAuditRecords`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAuditRecordsRef } from '@dataconnect/generated';


// Call the `listAuditRecordsRef()` function to get a reference to the query.
const ref = listAuditRecordsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAuditRecordsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.auditRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.auditRecords);
});
```

## ListScrapedArticles
You can execute the `ListScrapedArticles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listScrapedArticles(options?: ExecuteQueryOptions): QueryPromise<ListScrapedArticlesData, undefined>;

interface ListScrapedArticlesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListScrapedArticlesData, undefined>;
}
export const listScrapedArticlesRef: ListScrapedArticlesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listScrapedArticles(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListScrapedArticlesData, undefined>;

interface ListScrapedArticlesRef {
  ...
  (dc: DataConnect): QueryRef<ListScrapedArticlesData, undefined>;
}
export const listScrapedArticlesRef: ListScrapedArticlesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listScrapedArticlesRef:
```typescript
const name = listScrapedArticlesRef.operationName;
console.log(name);
```

### Variables
The `ListScrapedArticles` query has no variables.
### Return Type
Recall that executing the `ListScrapedArticles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListScrapedArticlesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListScrapedArticles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listScrapedArticles } from '@dataconnect/generated';


// Call the `listScrapedArticles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listScrapedArticles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listScrapedArticles(dataConnect);

console.log(data.scrapedArticles);

// Or, you can use the `Promise` API.
listScrapedArticles().then((response) => {
  const data = response.data;
  console.log(data.scrapedArticles);
});
```

### Using `ListScrapedArticles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listScrapedArticlesRef } from '@dataconnect/generated';


// Call the `listScrapedArticlesRef()` function to get a reference to the query.
const ref = listScrapedArticlesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listScrapedArticlesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.scrapedArticles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.scrapedArticles);
});
```

## ListRoadmapMilestones
You can execute the `ListRoadmapMilestones` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listRoadmapMilestones(options?: ExecuteQueryOptions): QueryPromise<ListRoadmapMilestonesData, undefined>;

interface ListRoadmapMilestonesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListRoadmapMilestonesData, undefined>;
}
export const listRoadmapMilestonesRef: ListRoadmapMilestonesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listRoadmapMilestones(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListRoadmapMilestonesData, undefined>;

interface ListRoadmapMilestonesRef {
  ...
  (dc: DataConnect): QueryRef<ListRoadmapMilestonesData, undefined>;
}
export const listRoadmapMilestonesRef: ListRoadmapMilestonesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listRoadmapMilestonesRef:
```typescript
const name = listRoadmapMilestonesRef.operationName;
console.log(name);
```

### Variables
The `ListRoadmapMilestones` query has no variables.
### Return Type
Recall that executing the `ListRoadmapMilestones` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListRoadmapMilestonesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListRoadmapMilestones`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listRoadmapMilestones } from '@dataconnect/generated';


// Call the `listRoadmapMilestones()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listRoadmapMilestones();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listRoadmapMilestones(dataConnect);

console.log(data.roadmapMilestones);

// Or, you can use the `Promise` API.
listRoadmapMilestones().then((response) => {
  const data = response.data;
  console.log(data.roadmapMilestones);
});
```

### Using `ListRoadmapMilestones`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listRoadmapMilestonesRef } from '@dataconnect/generated';


// Call the `listRoadmapMilestonesRef()` function to get a reference to the query.
const ref = listRoadmapMilestonesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listRoadmapMilestonesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.roadmapMilestones);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.roadmapMilestones);
});
```

## GetCompanyProfile
You can execute the `GetCompanyProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCompanyProfile(vars: GetCompanyProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyProfileData, GetCompanyProfileVariables>;

interface GetCompanyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCompanyProfileVariables): QueryRef<GetCompanyProfileData, GetCompanyProfileVariables>;
}
export const getCompanyProfileRef: GetCompanyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCompanyProfile(dc: DataConnect, vars: GetCompanyProfileVariables, options?: ExecuteQueryOptions): QueryPromise<GetCompanyProfileData, GetCompanyProfileVariables>;

interface GetCompanyProfileRef {
  ...
  (dc: DataConnect, vars: GetCompanyProfileVariables): QueryRef<GetCompanyProfileData, GetCompanyProfileVariables>;
}
export const getCompanyProfileRef: GetCompanyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCompanyProfileRef:
```typescript
const name = getCompanyProfileRef.operationName;
console.log(name);
```

### Variables
The `GetCompanyProfile` query requires an argument of type `GetCompanyProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCompanyProfileVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetCompanyProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCompanyProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
  } & CompanyProfile_Key;
}
```
### Using `GetCompanyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCompanyProfile, GetCompanyProfileVariables } from '@dataconnect/generated';

// The `GetCompanyProfile` query requires an argument of type `GetCompanyProfileVariables`:
const getCompanyProfileVars: GetCompanyProfileVariables = {
  id: ..., 
};

// Call the `getCompanyProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCompanyProfile(getCompanyProfileVars);
// Variables can be defined inline as well.
const { data } = await getCompanyProfile({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCompanyProfile(dataConnect, getCompanyProfileVars);

console.log(data.companyProfile);

// Or, you can use the `Promise` API.
getCompanyProfile(getCompanyProfileVars).then((response) => {
  const data = response.data;
  console.log(data.companyProfile);
});
```

### Using `GetCompanyProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCompanyProfileRef, GetCompanyProfileVariables } from '@dataconnect/generated';

// The `GetCompanyProfile` query requires an argument of type `GetCompanyProfileVariables`:
const getCompanyProfileVars: GetCompanyProfileVariables = {
  id: ..., 
};

// Call the `getCompanyProfileRef()` function to get a reference to the query.
const ref = getCompanyProfileRef(getCompanyProfileVars);
// Variables can be defined inline as well.
const ref = getCompanyProfileRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCompanyProfileRef(dataConnect, getCompanyProfileVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.companyProfile);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.companyProfile);
});
```

## GetReportById
You can execute the `GetReportById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReportById(vars: GetReportByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetReportByIdData, GetReportByIdVariables>;

interface GetReportByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReportByIdVariables): QueryRef<GetReportByIdData, GetReportByIdVariables>;
}
export const getReportByIdRef: GetReportByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReportById(dc: DataConnect, vars: GetReportByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetReportByIdData, GetReportByIdVariables>;

interface GetReportByIdRef {
  ...
  (dc: DataConnect, vars: GetReportByIdVariables): QueryRef<GetReportByIdData, GetReportByIdVariables>;
}
export const getReportByIdRef: GetReportByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReportByIdRef:
```typescript
const name = getReportByIdRef.operationName;
console.log(name);
```

### Variables
The `GetReportById` query requires an argument of type `GetReportByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReportByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetReportById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReportByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
    } & CompanyProfile_Key;
  } & Report_Key;
}
```
### Using `GetReportById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReportById, GetReportByIdVariables } from '@dataconnect/generated';

// The `GetReportById` query requires an argument of type `GetReportByIdVariables`:
const getReportByIdVars: GetReportByIdVariables = {
  id: ..., 
};

// Call the `getReportById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReportById(getReportByIdVars);
// Variables can be defined inline as well.
const { data } = await getReportById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReportById(dataConnect, getReportByIdVars);

console.log(data.report);

// Or, you can use the `Promise` API.
getReportById(getReportByIdVars).then((response) => {
  const data = response.data;
  console.log(data.report);
});
```

### Using `GetReportById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReportByIdRef, GetReportByIdVariables } from '@dataconnect/generated';

// The `GetReportById` query requires an argument of type `GetReportByIdVariables`:
const getReportByIdVars: GetReportByIdVariables = {
  id: ..., 
};

// Call the `getReportByIdRef()` function to get a reference to the query.
const ref = getReportByIdRef(getReportByIdVars);
// Variables can be defined inline as well.
const ref = getReportByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReportByIdRef(dataConnect, getReportByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.report);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.report);
});
```

## ListReports
You can execute the `ListReports` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listReports(options?: ExecuteQueryOptions): QueryPromise<ListReportsData, undefined>;

interface ListReportsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListReportsData, undefined>;
}
export const listReportsRef: ListReportsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReports(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListReportsData, undefined>;

interface ListReportsRef {
  ...
  (dc: DataConnect): QueryRef<ListReportsData, undefined>;
}
export const listReportsRef: ListReportsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReportsRef:
```typescript
const name = listReportsRef.operationName;
console.log(name);
```

### Variables
The `ListReports` query has no variables.
### Return Type
Recall that executing the `ListReports` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReportsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListReports`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReports } from '@dataconnect/generated';


// Call the `listReports()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReports();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReports(dataConnect);

console.log(data.reports);

// Or, you can use the `Promise` API.
listReports().then((response) => {
  const data = response.data;
  console.log(data.reports);
});
```

### Using `ListReports`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReportsRef } from '@dataconnect/generated';


// Call the `listReportsRef()` function to get a reference to the query.
const ref = listReportsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReportsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reports);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reports);
});
```

## ListCompanyMetricsByCategory
You can execute the `ListCompanyMetricsByCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCompanyMetricsByCategory(vars: ListCompanyMetricsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;

interface ListCompanyMetricsByCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyMetricsByCategoryVariables): QueryRef<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;
}
export const listCompanyMetricsByCategoryRef: ListCompanyMetricsByCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanyMetricsByCategory(dc: DataConnect, vars: ListCompanyMetricsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;

interface ListCompanyMetricsByCategoryRef {
  ...
  (dc: DataConnect, vars: ListCompanyMetricsByCategoryVariables): QueryRef<ListCompanyMetricsByCategoryData, ListCompanyMetricsByCategoryVariables>;
}
export const listCompanyMetricsByCategoryRef: ListCompanyMetricsByCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompanyMetricsByCategoryRef:
```typescript
const name = listCompanyMetricsByCategoryRef.operationName;
console.log(name);
```

### Variables
The `ListCompanyMetricsByCategory` query requires an argument of type `ListCompanyMetricsByCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCompanyMetricsByCategoryVariables {
  companyId: UUIDString;
  category: string;
}
```
### Return Type
Recall that executing the `ListCompanyMetricsByCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompanyMetricsByCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListCompanyMetricsByCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanyMetricsByCategory, ListCompanyMetricsByCategoryVariables } from '@dataconnect/generated';

// The `ListCompanyMetricsByCategory` query requires an argument of type `ListCompanyMetricsByCategoryVariables`:
const listCompanyMetricsByCategoryVars: ListCompanyMetricsByCategoryVariables = {
  companyId: ..., 
  category: ..., 
};

// Call the `listCompanyMetricsByCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanyMetricsByCategory(listCompanyMetricsByCategoryVars);
// Variables can be defined inline as well.
const { data } = await listCompanyMetricsByCategory({ companyId: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanyMetricsByCategory(dataConnect, listCompanyMetricsByCategoryVars);

console.log(data.companyMetrics);

// Or, you can use the `Promise` API.
listCompanyMetricsByCategory(listCompanyMetricsByCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.companyMetrics);
});
```

### Using `ListCompanyMetricsByCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompanyMetricsByCategoryRef, ListCompanyMetricsByCategoryVariables } from '@dataconnect/generated';

// The `ListCompanyMetricsByCategory` query requires an argument of type `ListCompanyMetricsByCategoryVariables`:
const listCompanyMetricsByCategoryVars: ListCompanyMetricsByCategoryVariables = {
  companyId: ..., 
  category: ..., 
};

// Call the `listCompanyMetricsByCategoryRef()` function to get a reference to the query.
const ref = listCompanyMetricsByCategoryRef(listCompanyMetricsByCategoryVars);
// Variables can be defined inline as well.
const ref = listCompanyMetricsByCategoryRef({ companyId: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompanyMetricsByCategoryRef(dataConnect, listCompanyMetricsByCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.companyMetrics);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.companyMetrics);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertTask
You can execute the `UpsertTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertTask(vars: UpsertTaskVariables): MutationPromise<UpsertTaskData, UpsertTaskVariables>;

interface UpsertTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertTaskVariables): MutationRef<UpsertTaskData, UpsertTaskVariables>;
}
export const upsertTaskRef: UpsertTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertTask(dc: DataConnect, vars: UpsertTaskVariables): MutationPromise<UpsertTaskData, UpsertTaskVariables>;

interface UpsertTaskRef {
  ...
  (dc: DataConnect, vars: UpsertTaskVariables): MutationRef<UpsertTaskData, UpsertTaskVariables>;
}
export const upsertTaskRef: UpsertTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertTaskRef:
```typescript
const name = upsertTaskRef.operationName;
console.log(name);
```

### Variables
The `UpsertTask` mutation requires an argument of type `UpsertTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertTaskData {
  task_upsert: Task_Key;
}
```
### Using `UpsertTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertTask, UpsertTaskVariables } from '@dataconnect/generated';

// The `UpsertTask` mutation requires an argument of type `UpsertTaskVariables`:
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

// Call the `upsertTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertTask(upsertTaskVars);
// Variables can be defined inline as well.
const { data } = await upsertTask({ id: ..., title: ..., description: ..., completed: ..., status: ..., priority: ..., assignee: ..., department: ..., griReference: ..., dueDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertTask(dataConnect, upsertTaskVars);

console.log(data.task_upsert);

// Or, you can use the `Promise` API.
upsertTask(upsertTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_upsert);
});
```

### Using `UpsertTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertTaskRef, UpsertTaskVariables } from '@dataconnect/generated';

// The `UpsertTask` mutation requires an argument of type `UpsertTaskVariables`:
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

// Call the `upsertTaskRef()` function to get a reference to the mutation.
const ref = upsertTaskRef(upsertTaskVars);
// Variables can be defined inline as well.
const ref = upsertTaskRef({ id: ..., title: ..., description: ..., completed: ..., status: ..., priority: ..., assignee: ..., department: ..., griReference: ..., dueDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertTaskRef(dataConnect, upsertTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_upsert);
});
```

## UpsertRoadmapMilestone
You can execute the `UpsertRoadmapMilestone` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertRoadmapMilestone(vars: UpsertRoadmapMilestoneVariables): MutationPromise<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;

interface UpsertRoadmapMilestoneRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertRoadmapMilestoneVariables): MutationRef<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;
}
export const upsertRoadmapMilestoneRef: UpsertRoadmapMilestoneRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertRoadmapMilestone(dc: DataConnect, vars: UpsertRoadmapMilestoneVariables): MutationPromise<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;

interface UpsertRoadmapMilestoneRef {
  ...
  (dc: DataConnect, vars: UpsertRoadmapMilestoneVariables): MutationRef<UpsertRoadmapMilestoneData, UpsertRoadmapMilestoneVariables>;
}
export const upsertRoadmapMilestoneRef: UpsertRoadmapMilestoneRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertRoadmapMilestoneRef:
```typescript
const name = upsertRoadmapMilestoneRef.operationName;
console.log(name);
```

### Variables
The `UpsertRoadmapMilestone` mutation requires an argument of type `UpsertRoadmapMilestoneVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertRoadmapMilestone` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertRoadmapMilestoneData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertRoadmapMilestoneData {
  roadmapMilestone_upsert: RoadmapMilestone_Key;
}
```
### Using `UpsertRoadmapMilestone`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertRoadmapMilestone, UpsertRoadmapMilestoneVariables } from '@dataconnect/generated';

// The `UpsertRoadmapMilestone` mutation requires an argument of type `UpsertRoadmapMilestoneVariables`:
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

// Call the `upsertRoadmapMilestone()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertRoadmapMilestone(upsertRoadmapMilestoneVars);
// Variables can be defined inline as well.
const { data } = await upsertRoadmapMilestone({ id: ..., title: ..., targetYear: ..., category: ..., status: ..., targetValue: ..., unit: ..., sbtiAligned: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertRoadmapMilestone(dataConnect, upsertRoadmapMilestoneVars);

console.log(data.roadmapMilestone_upsert);

// Or, you can use the `Promise` API.
upsertRoadmapMilestone(upsertRoadmapMilestoneVars).then((response) => {
  const data = response.data;
  console.log(data.roadmapMilestone_upsert);
});
```

### Using `UpsertRoadmapMilestone`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertRoadmapMilestoneRef, UpsertRoadmapMilestoneVariables } from '@dataconnect/generated';

// The `UpsertRoadmapMilestone` mutation requires an argument of type `UpsertRoadmapMilestoneVariables`:
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

// Call the `upsertRoadmapMilestoneRef()` function to get a reference to the mutation.
const ref = upsertRoadmapMilestoneRef(upsertRoadmapMilestoneVars);
// Variables can be defined inline as well.
const ref = upsertRoadmapMilestoneRef({ id: ..., title: ..., targetYear: ..., category: ..., status: ..., targetValue: ..., unit: ..., sbtiAligned: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertRoadmapMilestoneRef(dataConnect, upsertRoadmapMilestoneVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.roadmapMilestone_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.roadmapMilestone_upsert);
});
```

## UpsertCompanyProfile
You can execute the `UpsertCompanyProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCompanyProfile(vars: UpsertCompanyProfileVariables): MutationPromise<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;

interface UpsertCompanyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompanyProfileVariables): MutationRef<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;
}
export const upsertCompanyProfileRef: UpsertCompanyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCompanyProfile(dc: DataConnect, vars: UpsertCompanyProfileVariables): MutationPromise<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;

interface UpsertCompanyProfileRef {
  ...
  (dc: DataConnect, vars: UpsertCompanyProfileVariables): MutationRef<UpsertCompanyProfileData, UpsertCompanyProfileVariables>;
}
export const upsertCompanyProfileRef: UpsertCompanyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCompanyProfileRef:
```typescript
const name = upsertCompanyProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertCompanyProfile` mutation requires an argument of type `UpsertCompanyProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertCompanyProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCompanyProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCompanyProfileData {
  companyProfile_upsert: CompanyProfile_Key;
}
```
### Using `UpsertCompanyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCompanyProfile, UpsertCompanyProfileVariables } from '@dataconnect/generated';

// The `UpsertCompanyProfile` mutation requires an argument of type `UpsertCompanyProfileVariables`:
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

// Call the `upsertCompanyProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCompanyProfile(upsertCompanyProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertCompanyProfile({ id: ..., name: ..., industry: ..., vision: ..., mission: ..., employeeCount: ..., revenueTwd: ..., capitalTwd: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCompanyProfile(dataConnect, upsertCompanyProfileVars);

console.log(data.companyProfile_upsert);

// Or, you can use the `Promise` API.
upsertCompanyProfile(upsertCompanyProfileVars).then((response) => {
  const data = response.data;
  console.log(data.companyProfile_upsert);
});
```

### Using `UpsertCompanyProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCompanyProfileRef, UpsertCompanyProfileVariables } from '@dataconnect/generated';

// The `UpsertCompanyProfile` mutation requires an argument of type `UpsertCompanyProfileVariables`:
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

// Call the `upsertCompanyProfileRef()` function to get a reference to the mutation.
const ref = upsertCompanyProfileRef(upsertCompanyProfileVars);
// Variables can be defined inline as well.
const ref = upsertCompanyProfileRef({ id: ..., name: ..., industry: ..., vision: ..., mission: ..., employeeCount: ..., revenueTwd: ..., capitalTwd: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCompanyProfileRef(dataConnect, upsertCompanyProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.companyProfile_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.companyProfile_upsert);
});
```

## UpsertReport
You can execute the `UpsertReport` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertReport(vars: UpsertReportVariables): MutationPromise<UpsertReportData, UpsertReportVariables>;

interface UpsertReportRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertReportVariables): MutationRef<UpsertReportData, UpsertReportVariables>;
}
export const upsertReportRef: UpsertReportRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertReport(dc: DataConnect, vars: UpsertReportVariables): MutationPromise<UpsertReportData, UpsertReportVariables>;

interface UpsertReportRef {
  ...
  (dc: DataConnect, vars: UpsertReportVariables): MutationRef<UpsertReportData, UpsertReportVariables>;
}
export const upsertReportRef: UpsertReportRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertReportRef:
```typescript
const name = upsertReportRef.operationName;
console.log(name);
```

### Variables
The `UpsertReport` mutation requires an argument of type `UpsertReportVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertReport` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertReportData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertReportData {
  report_upsert: Report_Key;
}
```
### Using `UpsertReport`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertReport, UpsertReportVariables } from '@dataconnect/generated';

// The `UpsertReport` mutation requires an argument of type `UpsertReportVariables`:
const upsertReportVars: UpsertReportVariables = {
  id: ..., // optional
  companyId: ..., 
  templateId: ..., 
  title: ..., 
  language: ..., 
  progress: ..., 
  status: ..., 
};

// Call the `upsertReport()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertReport(upsertReportVars);
// Variables can be defined inline as well.
const { data } = await upsertReport({ id: ..., companyId: ..., templateId: ..., title: ..., language: ..., progress: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertReport(dataConnect, upsertReportVars);

console.log(data.report_upsert);

// Or, you can use the `Promise` API.
upsertReport(upsertReportVars).then((response) => {
  const data = response.data;
  console.log(data.report_upsert);
});
```

### Using `UpsertReport`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertReportRef, UpsertReportVariables } from '@dataconnect/generated';

// The `UpsertReport` mutation requires an argument of type `UpsertReportVariables`:
const upsertReportVars: UpsertReportVariables = {
  id: ..., // optional
  companyId: ..., 
  templateId: ..., 
  title: ..., 
  language: ..., 
  progress: ..., 
  status: ..., 
};

// Call the `upsertReportRef()` function to get a reference to the mutation.
const ref = upsertReportRef(upsertReportVars);
// Variables can be defined inline as well.
const ref = upsertReportRef({ id: ..., companyId: ..., templateId: ..., title: ..., language: ..., progress: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertReportRef(dataConnect, upsertReportVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.report_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.report_upsert);
});
```

## UpsertCompanyMetric
You can execute the `UpsertCompanyMetric` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertCompanyMetric(vars: UpsertCompanyMetricVariables): MutationPromise<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;

interface UpsertCompanyMetricRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertCompanyMetricVariables): MutationRef<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;
}
export const upsertCompanyMetricRef: UpsertCompanyMetricRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertCompanyMetric(dc: DataConnect, vars: UpsertCompanyMetricVariables): MutationPromise<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;

interface UpsertCompanyMetricRef {
  ...
  (dc: DataConnect, vars: UpsertCompanyMetricVariables): MutationRef<UpsertCompanyMetricData, UpsertCompanyMetricVariables>;
}
export const upsertCompanyMetricRef: UpsertCompanyMetricRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertCompanyMetricRef:
```typescript
const name = upsertCompanyMetricRef.operationName;
console.log(name);
```

### Variables
The `UpsertCompanyMetric` mutation requires an argument of type `UpsertCompanyMetricVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertCompanyMetric` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertCompanyMetricData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertCompanyMetricData {
  companyMetric_upsert: CompanyMetric_Key;
}
```
### Using `UpsertCompanyMetric`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertCompanyMetric, UpsertCompanyMetricVariables } from '@dataconnect/generated';

// The `UpsertCompanyMetric` mutation requires an argument of type `UpsertCompanyMetricVariables`:
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

// Call the `upsertCompanyMetric()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCompanyMetric(upsertCompanyMetricVars);
// Variables can be defined inline as well.
const { data } = await upsertCompanyMetric({ id: ..., companyId: ..., metricName: ..., metricValue: ..., unit: ..., category: ..., verified: ..., griStandard: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertCompanyMetric(dataConnect, upsertCompanyMetricVars);

console.log(data.companyMetric_upsert);

// Or, you can use the `Promise` API.
upsertCompanyMetric(upsertCompanyMetricVars).then((response) => {
  const data = response.data;
  console.log(data.companyMetric_upsert);
});
```

### Using `UpsertCompanyMetric`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertCompanyMetricRef, UpsertCompanyMetricVariables } from '@dataconnect/generated';

// The `UpsertCompanyMetric` mutation requires an argument of type `UpsertCompanyMetricVariables`:
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

// Call the `upsertCompanyMetricRef()` function to get a reference to the mutation.
const ref = upsertCompanyMetricRef(upsertCompanyMetricVars);
// Variables can be defined inline as well.
const ref = upsertCompanyMetricRef({ id: ..., companyId: ..., metricName: ..., metricValue: ..., unit: ..., category: ..., verified: ..., griStandard: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertCompanyMetricRef(dataConnect, upsertCompanyMetricVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.companyMetric_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.companyMetric_upsert);
});
```

## UpsertScrapedArticle
You can execute the `UpsertScrapedArticle` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertScrapedArticle(vars: UpsertScrapedArticleVariables): MutationPromise<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;

interface UpsertScrapedArticleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertScrapedArticleVariables): MutationRef<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;
}
export const upsertScrapedArticleRef: UpsertScrapedArticleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertScrapedArticle(dc: DataConnect, vars: UpsertScrapedArticleVariables): MutationPromise<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;

interface UpsertScrapedArticleRef {
  ...
  (dc: DataConnect, vars: UpsertScrapedArticleVariables): MutationRef<UpsertScrapedArticleData, UpsertScrapedArticleVariables>;
}
export const upsertScrapedArticleRef: UpsertScrapedArticleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertScrapedArticleRef:
```typescript
const name = upsertScrapedArticleRef.operationName;
console.log(name);
```

### Variables
The `UpsertScrapedArticle` mutation requires an argument of type `UpsertScrapedArticleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertScrapedArticle` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertScrapedArticleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertScrapedArticleData {
  scrapedArticle_upsert: ScrapedArticle_Key;
}
```
### Using `UpsertScrapedArticle`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertScrapedArticle, UpsertScrapedArticleVariables } from '@dataconnect/generated';

// The `UpsertScrapedArticle` mutation requires an argument of type `UpsertScrapedArticleVariables`:
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

// Call the `upsertScrapedArticle()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertScrapedArticle(upsertScrapedArticleVars);
// Variables can be defined inline as well.
const { data } = await upsertScrapedArticle({ id: ..., title: ..., summary: ..., url: ..., source: ..., publishedAt: ..., category: ..., tags: ..., impactLevel: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertScrapedArticle(dataConnect, upsertScrapedArticleVars);

console.log(data.scrapedArticle_upsert);

// Or, you can use the `Promise` API.
upsertScrapedArticle(upsertScrapedArticleVars).then((response) => {
  const data = response.data;
  console.log(data.scrapedArticle_upsert);
});
```

### Using `UpsertScrapedArticle`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertScrapedArticleRef, UpsertScrapedArticleVariables } from '@dataconnect/generated';

// The `UpsertScrapedArticle` mutation requires an argument of type `UpsertScrapedArticleVariables`:
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

// Call the `upsertScrapedArticleRef()` function to get a reference to the mutation.
const ref = upsertScrapedArticleRef(upsertScrapedArticleVars);
// Variables can be defined inline as well.
const ref = upsertScrapedArticleRef({ id: ..., title: ..., summary: ..., url: ..., source: ..., publishedAt: ..., category: ..., tags: ..., impactLevel: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertScrapedArticleRef(dataConnect, upsertScrapedArticleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.scrapedArticle_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.scrapedArticle_upsert);
});
```

## CreateDemoData
You can execute the `CreateDemoData` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDemoData(): MutationPromise<CreateDemoDataData, undefined>;

interface CreateDemoDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateDemoDataData, undefined>;
}
export const createDemoDataRef: CreateDemoDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDemoData(dc: DataConnect): MutationPromise<CreateDemoDataData, undefined>;

interface CreateDemoDataRef {
  ...
  (dc: DataConnect): MutationRef<CreateDemoDataData, undefined>;
}
export const createDemoDataRef: CreateDemoDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDemoDataRef:
```typescript
const name = createDemoDataRef.operationName;
console.log(name);
```

### Variables
The `CreateDemoData` mutation has no variables.
### Return Type
Recall that executing the `CreateDemoData` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDemoDataData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDemoDataData {
  user_insertMany: User_Key[];
  comment_insertMany: Comment_Key[];
}
```
### Using `CreateDemoData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDemoData } from '@dataconnect/generated';


// Call the `createDemoData()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDemoData();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDemoData(dataConnect);

console.log(data.user_insertMany);
console.log(data.comment_insertMany);

// Or, you can use the `Promise` API.
createDemoData().then((response) => {
  const data = response.data;
  console.log(data.user_insertMany);
  console.log(data.comment_insertMany);
});
```

### Using `CreateDemoData`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDemoDataRef } from '@dataconnect/generated';


// Call the `createDemoDataRef()` function to get a reference to the mutation.
const ref = createDemoDataRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDemoDataRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insertMany);
console.log(data.comment_insertMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insertMany);
  console.log(data.comment_insertMany);
});
```

