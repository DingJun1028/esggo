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
    createdAt: TimestampString;
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

## ListIntelligenceModules
You can execute the `ListIntelligenceModules` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listIntelligenceModules(options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceModulesData, undefined>;

interface ListIntelligenceModulesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIntelligenceModulesData, undefined>;
}
export const listIntelligenceModulesRef: ListIntelligenceModulesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listIntelligenceModules(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceModulesData, undefined>;

interface ListIntelligenceModulesRef {
  ...
  (dc: DataConnect): QueryRef<ListIntelligenceModulesData, undefined>;
}
export const listIntelligenceModulesRef: ListIntelligenceModulesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listIntelligenceModulesRef:
```typescript
const name = listIntelligenceModulesRef.operationName;
console.log(name);
```

### Variables
The `ListIntelligenceModules` query has no variables.
### Return Type
Recall that executing the `ListIntelligenceModules` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListIntelligenceModulesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListIntelligenceModules`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listIntelligenceModules } from '@dataconnect/generated';


// Call the `listIntelligenceModules()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listIntelligenceModules();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listIntelligenceModules(dataConnect);

console.log(data.intelligenceModules);

// Or, you can use the `Promise` API.
listIntelligenceModules().then((response) => {
  const data = response.data;
  console.log(data.intelligenceModules);
});
```

### Using `ListIntelligenceModules`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listIntelligenceModulesRef } from '@dataconnect/generated';


// Call the `listIntelligenceModulesRef()` function to get a reference to the query.
const ref = listIntelligenceModulesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listIntelligenceModulesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.intelligenceModules);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.intelligenceModules);
});
```

## ListIntelligenceSources
You can execute the `ListIntelligenceSources` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listIntelligenceSources(options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceSourcesData, undefined>;

interface ListIntelligenceSourcesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIntelligenceSourcesData, undefined>;
}
export const listIntelligenceSourcesRef: ListIntelligenceSourcesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listIntelligenceSources(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceSourcesData, undefined>;

interface ListIntelligenceSourcesRef {
  ...
  (dc: DataConnect): QueryRef<ListIntelligenceSourcesData, undefined>;
}
export const listIntelligenceSourcesRef: ListIntelligenceSourcesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listIntelligenceSourcesRef:
```typescript
const name = listIntelligenceSourcesRef.operationName;
console.log(name);
```

### Variables
The `ListIntelligenceSources` query has no variables.
### Return Type
Recall that executing the `ListIntelligenceSources` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListIntelligenceSourcesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListIntelligenceSources`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listIntelligenceSources } from '@dataconnect/generated';


// Call the `listIntelligenceSources()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listIntelligenceSources();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listIntelligenceSources(dataConnect);

console.log(data.intelligenceSources);

// Or, you can use the `Promise` API.
listIntelligenceSources().then((response) => {
  const data = response.data;
  console.log(data.intelligenceSources);
});
```

### Using `ListIntelligenceSources`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listIntelligenceSourcesRef } from '@dataconnect/generated';


// Call the `listIntelligenceSourcesRef()` function to get a reference to the query.
const ref = listIntelligenceSourcesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listIntelligenceSourcesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.intelligenceSources);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.intelligenceSources);
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

## GetReportSections
You can execute the `GetReportSections` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReportSections(vars: GetReportSectionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetReportSectionsData, GetReportSectionsVariables>;

interface GetReportSectionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReportSectionsVariables): QueryRef<GetReportSectionsData, GetReportSectionsVariables>;
}
export const getReportSectionsRef: GetReportSectionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReportSections(dc: DataConnect, vars: GetReportSectionsVariables, options?: ExecuteQueryOptions): QueryPromise<GetReportSectionsData, GetReportSectionsVariables>;

interface GetReportSectionsRef {
  ...
  (dc: DataConnect, vars: GetReportSectionsVariables): QueryRef<GetReportSectionsData, GetReportSectionsVariables>;
}
export const getReportSectionsRef: GetReportSectionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReportSectionsRef:
```typescript
const name = getReportSectionsRef.operationName;
console.log(name);
```

### Variables
The `GetReportSections` query requires an argument of type `GetReportSectionsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReportSectionsVariables {
  reportId: UUIDString;
}
```
### Return Type
Recall that executing the `GetReportSections` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReportSectionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `GetReportSections`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReportSections, GetReportSectionsVariables } from '@dataconnect/generated';

// The `GetReportSections` query requires an argument of type `GetReportSectionsVariables`:
const getReportSectionsVars: GetReportSectionsVariables = {
  reportId: ..., 
};

// Call the `getReportSections()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReportSections(getReportSectionsVars);
// Variables can be defined inline as well.
const { data } = await getReportSections({ reportId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReportSections(dataConnect, getReportSectionsVars);

console.log(data.reportSections);

// Or, you can use the `Promise` API.
getReportSections(getReportSectionsVars).then((response) => {
  const data = response.data;
  console.log(data.reportSections);
});
```

### Using `GetReportSections`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReportSectionsRef, GetReportSectionsVariables } from '@dataconnect/generated';

// The `GetReportSections` query requires an argument of type `GetReportSectionsVariables`:
const getReportSectionsVars: GetReportSectionsVariables = {
  reportId: ..., 
};

// Call the `getReportSectionsRef()` function to get a reference to the query.
const ref = getReportSectionsRef(getReportSectionsVars);
// Variables can be defined inline as well.
const ref = getReportSectionsRef({ reportId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReportSectionsRef(dataConnect, getReportSectionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reportSections);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reportSections);
});
```

## ListCompanyMetric
You can execute the `ListCompanyMetric` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCompanyMetric(vars: ListCompanyMetricVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyMetricData, ListCompanyMetricVariables>;

interface ListCompanyMetricRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCompanyMetricVariables): QueryRef<ListCompanyMetricData, ListCompanyMetricVariables>;
}
export const listCompanyMetricRef: ListCompanyMetricRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanyMetric(dc: DataConnect, vars: ListCompanyMetricVariables, options?: ExecuteQueryOptions): QueryPromise<ListCompanyMetricData, ListCompanyMetricVariables>;

interface ListCompanyMetricRef {
  ...
  (dc: DataConnect, vars: ListCompanyMetricVariables): QueryRef<ListCompanyMetricData, ListCompanyMetricVariables>;
}
export const listCompanyMetricRef: ListCompanyMetricRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompanyMetricRef:
```typescript
const name = listCompanyMetricRef.operationName;
console.log(name);
```

### Variables
The `ListCompanyMetric` query requires an argument of type `ListCompanyMetricVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListCompanyMetricVariables {
  companyId: UUIDString;
}
```
### Return Type
Recall that executing the `ListCompanyMetric` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompanyMetricData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListCompanyMetric`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanyMetric, ListCompanyMetricVariables } from '@dataconnect/generated';

// The `ListCompanyMetric` query requires an argument of type `ListCompanyMetricVariables`:
const listCompanyMetricVars: ListCompanyMetricVariables = {
  companyId: ..., 
};

// Call the `listCompanyMetric()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanyMetric(listCompanyMetricVars);
// Variables can be defined inline as well.
const { data } = await listCompanyMetric({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanyMetric(dataConnect, listCompanyMetricVars);

console.log(data.companyMetrics);

// Or, you can use the `Promise` API.
listCompanyMetric(listCompanyMetricVars).then((response) => {
  const data = response.data;
  console.log(data.companyMetrics);
});
```

### Using `ListCompanyMetric`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompanyMetricRef, ListCompanyMetricVariables } from '@dataconnect/generated';

// The `ListCompanyMetric` query requires an argument of type `ListCompanyMetricVariables`:
const listCompanyMetricVars: ListCompanyMetricVariables = {
  companyId: ..., 
};

// Call the `listCompanyMetricRef()` function to get a reference to the query.
const ref = listCompanyMetricRef(listCompanyMetricVars);
// Variables can be defined inline as well.
const ref = listCompanyMetricRef({ companyId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompanyMetricRef(dataConnect, listCompanyMetricVars);

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

## ListIntelligenceSignals
You can execute the `ListIntelligenceSignals` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listIntelligenceSignals(options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceSignalsData, undefined>;

interface ListIntelligenceSignalsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListIntelligenceSignalsData, undefined>;
}
export const listIntelligenceSignalsRef: ListIntelligenceSignalsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listIntelligenceSignals(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListIntelligenceSignalsData, undefined>;

interface ListIntelligenceSignalsRef {
  ...
  (dc: DataConnect): QueryRef<ListIntelligenceSignalsData, undefined>;
}
export const listIntelligenceSignalsRef: ListIntelligenceSignalsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listIntelligenceSignalsRef:
```typescript
const name = listIntelligenceSignalsRef.operationName;
console.log(name);
```

### Variables
The `ListIntelligenceSignals` query has no variables.
### Return Type
Recall that executing the `ListIntelligenceSignals` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListIntelligenceSignalsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListIntelligenceSignals`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listIntelligenceSignals } from '@dataconnect/generated';


// Call the `listIntelligenceSignals()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listIntelligenceSignals();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listIntelligenceSignals(dataConnect);

console.log(data.intelligenceSignals);

// Or, you can use the `Promise` API.
listIntelligenceSignals().then((response) => {
  const data = response.data;
  console.log(data.intelligenceSignals);
});
```

### Using `ListIntelligenceSignals`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listIntelligenceSignalsRef } from '@dataconnect/generated';


// Call the `listIntelligenceSignalsRef()` function to get a reference to the query.
const ref = listIntelligenceSignalsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listIntelligenceSignalsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.intelligenceSignals);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.intelligenceSignals);
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

## CreateTask
You can execute the `CreateTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTaskRef:
```typescript
const name = createTaskRef.operationName;
console.log(name);
```

### Variables
The `CreateTask` mutation requires an argument of type `CreateTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTaskVariables {
  title: string;
  description?: string | null;
  createdAt: TimestampString;
}
```
### Return Type
Recall that executing the `CreateTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTaskData {
  task: Task_Key;
}
```
### Using `CreateTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTask, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  description: ..., // optional
  createdAt: ..., 
};

// Call the `createTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTask(createTaskVars);
// Variables can be defined inline as well.
const { data } = await createTask({ title: ..., description: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTask(dataConnect, createTaskVars);

console.log(data.task);

// Or, you can use the `Promise` API.
createTask(createTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

### Using `CreateTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTaskRef, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  description: ..., // optional
  createdAt: ..., 
};

// Call the `createTaskRef()` function to get a reference to the mutation.
const ref = createTaskRef(createTaskVars);
// Variables can be defined inline as well.
const ref = createTaskRef({ title: ..., description: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTaskRef(dataConnect, createTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

## DeleteTask
You can execute the `DeleteTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface DeleteTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
}
export const deleteTaskRef: DeleteTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface DeleteTaskRef {
  ...
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
}
export const deleteTaskRef: DeleteTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTaskRef:
```typescript
const name = deleteTaskRef.operationName;
console.log(name);
```

### Variables
The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTaskVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTaskData {
  task?: Task_Key | null;
}
```
### Using `DeleteTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTask, DeleteTaskVariables } from '@dataconnect/generated';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  id: ..., 
};

// Call the `deleteTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTask(deleteTaskVars);
// Variables can be defined inline as well.
const { data } = await deleteTask({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTask(dataConnect, deleteTaskVars);

console.log(data.task);

// Or, you can use the `Promise` API.
deleteTask(deleteTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

### Using `DeleteTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTaskRef, DeleteTaskVariables } from '@dataconnect/generated';

// The `DeleteTask` mutation requires an argument of type `DeleteTaskVariables`:
const deleteTaskVars: DeleteTaskVariables = {
  id: ..., 
};

// Call the `deleteTaskRef()` function to get a reference to the mutation.
const ref = deleteTaskRef(deleteTaskVars);
// Variables can be defined inline as well.
const ref = deleteTaskRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTaskRef(dataConnect, deleteTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

## UpdateTaskStatus
You can execute the `UpdateTaskStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateTaskStatus(vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

interface UpdateTaskStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateTaskStatus(dc: DataConnect, vars: UpdateTaskStatusVariables): MutationPromise<UpdateTaskStatusData, UpdateTaskStatusVariables>;

interface UpdateTaskStatusRef {
  ...
  (dc: DataConnect, vars: UpdateTaskStatusVariables): MutationRef<UpdateTaskStatusData, UpdateTaskStatusVariables>;
}
export const updateTaskStatusRef: UpdateTaskStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateTaskStatusRef:
```typescript
const name = updateTaskStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateTaskStatus` mutation requires an argument of type `UpdateTaskStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateTaskStatusVariables {
  id: UUIDString;
  completed: boolean;
}
```
### Return Type
Recall that executing the `UpdateTaskStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateTaskStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateTaskStatusData {
  task?: Task_Key | null;
}
```
### Using `UpdateTaskStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateTaskStatus, UpdateTaskStatusVariables } from '@dataconnect/generated';

// The `UpdateTaskStatus` mutation requires an argument of type `UpdateTaskStatusVariables`:
const updateTaskStatusVars: UpdateTaskStatusVariables = {
  id: ..., 
  completed: ..., 
};

// Call the `updateTaskStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateTaskStatus(updateTaskStatusVars);
// Variables can be defined inline as well.
const { data } = await updateTaskStatus({ id: ..., completed: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateTaskStatus(dataConnect, updateTaskStatusVars);

console.log(data.task);

// Or, you can use the `Promise` API.
updateTaskStatus(updateTaskStatusVars).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

### Using `UpdateTaskStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateTaskStatusRef, UpdateTaskStatusVariables } from '@dataconnect/generated';

// The `UpdateTaskStatus` mutation requires an argument of type `UpdateTaskStatusVariables`:
const updateTaskStatusVars: UpdateTaskStatusVariables = {
  id: ..., 
  completed: ..., 
};

// Call the `updateTaskStatusRef()` function to get a reference to the mutation.
const ref = updateTaskStatusRef(updateTaskStatusVars);
// Variables can be defined inline as well.
const ref = updateTaskStatusRef({ id: ..., completed: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateTaskStatusRef(dataConnect, updateTaskStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task);
});
```

## CreateAuditRecord
You can execute the `CreateAuditRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAuditRecord(vars: CreateAuditRecordVariables): MutationPromise<CreateAuditRecordData, CreateAuditRecordVariables>;

interface CreateAuditRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAuditRecordVariables): MutationRef<CreateAuditRecordData, CreateAuditRecordVariables>;
}
export const createAuditRecordRef: CreateAuditRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAuditRecord(dc: DataConnect, vars: CreateAuditRecordVariables): MutationPromise<CreateAuditRecordData, CreateAuditRecordVariables>;

interface CreateAuditRecordRef {
  ...
  (dc: DataConnect, vars: CreateAuditRecordVariables): MutationRef<CreateAuditRecordData, CreateAuditRecordVariables>;
}
export const createAuditRecordRef: CreateAuditRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAuditRecordRef:
```typescript
const name = createAuditRecordRef.operationName;
console.log(name);
```

### Variables
The `CreateAuditRecord` mutation requires an argument of type `CreateAuditRecordVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `CreateAuditRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAuditRecordData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAuditRecordData {
  auditRecord: AuditRecord_Key;
}
```
### Using `CreateAuditRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAuditRecord, CreateAuditRecordVariables } from '@dataconnect/generated';

// The `CreateAuditRecord` mutation requires an argument of type `CreateAuditRecordVariables`:
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

// Call the `createAuditRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAuditRecord(createAuditRecordVars);
// Variables can be defined inline as well.
const { data } = await createAuditRecord({ title: ..., dataType: ..., source: ..., category: ..., standard: ..., description: ..., contentHash: ..., zkpStatus: ..., createdAt: ..., metadata: ..., proofSignature: ..., verifierKey: ..., algorithm: ..., salt: ..., proofJson: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAuditRecord(dataConnect, createAuditRecordVars);

console.log(data.auditRecord);

// Or, you can use the `Promise` API.
createAuditRecord(createAuditRecordVars).then((response) => {
  const data = response.data;
  console.log(data.auditRecord);
});
```

### Using `CreateAuditRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAuditRecordRef, CreateAuditRecordVariables } from '@dataconnect/generated';

// The `CreateAuditRecord` mutation requires an argument of type `CreateAuditRecordVariables`:
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

// Call the `createAuditRecordRef()` function to get a reference to the mutation.
const ref = createAuditRecordRef(createAuditRecordVars);
// Variables can be defined inline as well.
const ref = createAuditRecordRef({ title: ..., dataType: ..., source: ..., category: ..., standard: ..., description: ..., contentHash: ..., zkpStatus: ..., createdAt: ..., metadata: ..., proofSignature: ..., verifierKey: ..., algorithm: ..., salt: ..., proofJson: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAuditRecordRef(dataConnect, createAuditRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditRecord);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditRecord);
});
```

## UpdateAuditRecord
You can execute the `UpdateAuditRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateAuditRecord(vars: UpdateAuditRecordVariables): MutationPromise<UpdateAuditRecordData, UpdateAuditRecordVariables>;

interface UpdateAuditRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAuditRecordVariables): MutationRef<UpdateAuditRecordData, UpdateAuditRecordVariables>;
}
export const updateAuditRecordRef: UpdateAuditRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAuditRecord(dc: DataConnect, vars: UpdateAuditRecordVariables): MutationPromise<UpdateAuditRecordData, UpdateAuditRecordVariables>;

interface UpdateAuditRecordRef {
  ...
  (dc: DataConnect, vars: UpdateAuditRecordVariables): MutationRef<UpdateAuditRecordData, UpdateAuditRecordVariables>;
}
export const updateAuditRecordRef: UpdateAuditRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAuditRecordRef:
```typescript
const name = updateAuditRecordRef.operationName;
console.log(name);
```

### Variables
The `UpdateAuditRecord` mutation requires an argument of type `UpdateAuditRecordVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpdateAuditRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAuditRecordData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAuditRecordData {
  auditRecord?: AuditRecord_Key | null;
}
```
### Using `UpdateAuditRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAuditRecord, UpdateAuditRecordVariables } from '@dataconnect/generated';

// The `UpdateAuditRecord` mutation requires an argument of type `UpdateAuditRecordVariables`:
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

// Call the `updateAuditRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAuditRecord(updateAuditRecordVars);
// Variables can be defined inline as well.
const { data } = await updateAuditRecord({ id: ..., title: ..., dataType: ..., source: ..., category: ..., standard: ..., description: ..., contentHash: ..., zkpStatus: ..., metadata: ..., proofSignature: ..., verifierKey: ..., algorithm: ..., salt: ..., proofJson: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAuditRecord(dataConnect, updateAuditRecordVars);

console.log(data.auditRecord);

// Or, you can use the `Promise` API.
updateAuditRecord(updateAuditRecordVars).then((response) => {
  const data = response.data;
  console.log(data.auditRecord);
});
```

### Using `UpdateAuditRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAuditRecordRef, UpdateAuditRecordVariables } from '@dataconnect/generated';

// The `UpdateAuditRecord` mutation requires an argument of type `UpdateAuditRecordVariables`:
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

// Call the `updateAuditRecordRef()` function to get a reference to the mutation.
const ref = updateAuditRecordRef(updateAuditRecordVars);
// Variables can be defined inline as well.
const ref = updateAuditRecordRef({ id: ..., title: ..., dataType: ..., source: ..., category: ..., standard: ..., description: ..., contentHash: ..., zkpStatus: ..., metadata: ..., proofSignature: ..., verifierKey: ..., algorithm: ..., salt: ..., proofJson: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAuditRecordRef(dataConnect, updateAuditRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditRecord);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditRecord);
});
```

## DeleteAuditRecord
You can execute the `DeleteAuditRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAuditRecord(vars: DeleteAuditRecordVariables): MutationPromise<DeleteAuditRecordData, DeleteAuditRecordVariables>;

interface DeleteAuditRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAuditRecordVariables): MutationRef<DeleteAuditRecordData, DeleteAuditRecordVariables>;
}
export const deleteAuditRecordRef: DeleteAuditRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAuditRecord(dc: DataConnect, vars: DeleteAuditRecordVariables): MutationPromise<DeleteAuditRecordData, DeleteAuditRecordVariables>;

interface DeleteAuditRecordRef {
  ...
  (dc: DataConnect, vars: DeleteAuditRecordVariables): MutationRef<DeleteAuditRecordData, DeleteAuditRecordVariables>;
}
export const deleteAuditRecordRef: DeleteAuditRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAuditRecordRef:
```typescript
const name = deleteAuditRecordRef.operationName;
console.log(name);
```

### Variables
The `DeleteAuditRecord` mutation requires an argument of type `DeleteAuditRecordVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAuditRecordVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAuditRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAuditRecordData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAuditRecordData {
  auditRecord?: AuditRecord_Key | null;
}
```
### Using `DeleteAuditRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAuditRecord, DeleteAuditRecordVariables } from '@dataconnect/generated';

// The `DeleteAuditRecord` mutation requires an argument of type `DeleteAuditRecordVariables`:
const deleteAuditRecordVars: DeleteAuditRecordVariables = {
  id: ..., 
};

// Call the `deleteAuditRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAuditRecord(deleteAuditRecordVars);
// Variables can be defined inline as well.
const { data } = await deleteAuditRecord({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAuditRecord(dataConnect, deleteAuditRecordVars);

console.log(data.auditRecord);

// Or, you can use the `Promise` API.
deleteAuditRecord(deleteAuditRecordVars).then((response) => {
  const data = response.data;
  console.log(data.auditRecord);
});
```

### Using `DeleteAuditRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAuditRecordRef, DeleteAuditRecordVariables } from '@dataconnect/generated';

// The `DeleteAuditRecord` mutation requires an argument of type `DeleteAuditRecordVariables`:
const deleteAuditRecordVars: DeleteAuditRecordVariables = {
  id: ..., 
};

// Call the `deleteAuditRecordRef()` function to get a reference to the mutation.
const ref = deleteAuditRecordRef(deleteAuditRecordVars);
// Variables can be defined inline as well.
const ref = deleteAuditRecordRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAuditRecordRef(dataConnect, deleteAuditRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.auditRecord);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.auditRecord);
});
```

## UpsertIntelligenceModule
You can execute the `UpsertIntelligenceModule` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertIntelligenceModule(vars: UpsertIntelligenceModuleVariables): MutationPromise<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;

interface UpsertIntelligenceModuleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertIntelligenceModuleVariables): MutationRef<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;
}
export const upsertIntelligenceModuleRef: UpsertIntelligenceModuleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertIntelligenceModule(dc: DataConnect, vars: UpsertIntelligenceModuleVariables): MutationPromise<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;

interface UpsertIntelligenceModuleRef {
  ...
  (dc: DataConnect, vars: UpsertIntelligenceModuleVariables): MutationRef<UpsertIntelligenceModuleData, UpsertIntelligenceModuleVariables>;
}
export const upsertIntelligenceModuleRef: UpsertIntelligenceModuleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertIntelligenceModuleRef:
```typescript
const name = upsertIntelligenceModuleRef.operationName;
console.log(name);
```

### Variables
The `UpsertIntelligenceModule` mutation requires an argument of type `UpsertIntelligenceModuleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertIntelligenceModule` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertIntelligenceModuleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertIntelligenceModuleData {
  intelligenceModule: IntelligenceModule_Key;
}
```
### Using `UpsertIntelligenceModule`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertIntelligenceModule, UpsertIntelligenceModuleVariables } from '@dataconnect/generated';

// The `UpsertIntelligenceModule` mutation requires an argument of type `UpsertIntelligenceModuleVariables`:
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

// Call the `upsertIntelligenceModule()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertIntelligenceModule(upsertIntelligenceModuleVars);
// Variables can be defined inline as well.
const { data } = await upsertIntelligenceModule({ id: ..., titleZh: ..., titleEn: ..., descriptionZh: ..., descriptionEn: ..., iconName: ..., color: ..., details: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertIntelligenceModule(dataConnect, upsertIntelligenceModuleVars);

console.log(data.intelligenceModule);

// Or, you can use the `Promise` API.
upsertIntelligenceModule(upsertIntelligenceModuleVars).then((response) => {
  const data = response.data;
  console.log(data.intelligenceModule);
});
```

### Using `UpsertIntelligenceModule`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertIntelligenceModuleRef, UpsertIntelligenceModuleVariables } from '@dataconnect/generated';

// The `UpsertIntelligenceModule` mutation requires an argument of type `UpsertIntelligenceModuleVariables`:
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

// Call the `upsertIntelligenceModuleRef()` function to get a reference to the mutation.
const ref = upsertIntelligenceModuleRef(upsertIntelligenceModuleVars);
// Variables can be defined inline as well.
const ref = upsertIntelligenceModuleRef({ id: ..., titleZh: ..., titleEn: ..., descriptionZh: ..., descriptionEn: ..., iconName: ..., color: ..., details: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertIntelligenceModuleRef(dataConnect, upsertIntelligenceModuleVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.intelligenceModule);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.intelligenceModule);
});
```

## UpsertIntelligenceSource
You can execute the `UpsertIntelligenceSource` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertIntelligenceSource(vars: UpsertIntelligenceSourceVariables): MutationPromise<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;

interface UpsertIntelligenceSourceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertIntelligenceSourceVariables): MutationRef<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;
}
export const upsertIntelligenceSourceRef: UpsertIntelligenceSourceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertIntelligenceSource(dc: DataConnect, vars: UpsertIntelligenceSourceVariables): MutationPromise<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;

interface UpsertIntelligenceSourceRef {
  ...
  (dc: DataConnect, vars: UpsertIntelligenceSourceVariables): MutationRef<UpsertIntelligenceSourceData, UpsertIntelligenceSourceVariables>;
}
export const upsertIntelligenceSourceRef: UpsertIntelligenceSourceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertIntelligenceSourceRef:
```typescript
const name = upsertIntelligenceSourceRef.operationName;
console.log(name);
```

### Variables
The `UpsertIntelligenceSource` mutation requires an argument of type `UpsertIntelligenceSourceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertIntelligenceSourceVariables {
  id?: UUIDString | null;
  category: string;
  name: string;
  type: string;
  status: string;
}
```
### Return Type
Recall that executing the `UpsertIntelligenceSource` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertIntelligenceSourceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertIntelligenceSourceData {
  intelligenceSource: IntelligenceSource_Key;
}
```
### Using `UpsertIntelligenceSource`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertIntelligenceSource, UpsertIntelligenceSourceVariables } from '@dataconnect/generated';

// The `UpsertIntelligenceSource` mutation requires an argument of type `UpsertIntelligenceSourceVariables`:
const upsertIntelligenceSourceVars: UpsertIntelligenceSourceVariables = {
  id: ..., // optional
  category: ..., 
  name: ..., 
  type: ..., 
  status: ..., 
};

// Call the `upsertIntelligenceSource()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertIntelligenceSource(upsertIntelligenceSourceVars);
// Variables can be defined inline as well.
const { data } = await upsertIntelligenceSource({ id: ..., category: ..., name: ..., type: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertIntelligenceSource(dataConnect, upsertIntelligenceSourceVars);

console.log(data.intelligenceSource);

// Or, you can use the `Promise` API.
upsertIntelligenceSource(upsertIntelligenceSourceVars).then((response) => {
  const data = response.data;
  console.log(data.intelligenceSource);
});
```

### Using `UpsertIntelligenceSource`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertIntelligenceSourceRef, UpsertIntelligenceSourceVariables } from '@dataconnect/generated';

// The `UpsertIntelligenceSource` mutation requires an argument of type `UpsertIntelligenceSourceVariables`:
const upsertIntelligenceSourceVars: UpsertIntelligenceSourceVariables = {
  id: ..., // optional
  category: ..., 
  name: ..., 
  type: ..., 
  status: ..., 
};

// Call the `upsertIntelligenceSourceRef()` function to get a reference to the mutation.
const ref = upsertIntelligenceSourceRef(upsertIntelligenceSourceVars);
// Variables can be defined inline as well.
const ref = upsertIntelligenceSourceRef({ id: ..., category: ..., name: ..., type: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertIntelligenceSourceRef(dataConnect, upsertIntelligenceSourceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.intelligenceSource);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.intelligenceSource);
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
  createdAt: TimestampString;
  lastSavedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `UpsertReport` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertReportData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertReportData {
  report: Report_Key;
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
  createdAt: ..., 
  lastSavedAt: ..., // optional
};

// Call the `upsertReport()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertReport(upsertReportVars);
// Variables can be defined inline as well.
const { data } = await upsertReport({ id: ..., companyId: ..., templateId: ..., title: ..., language: ..., progress: ..., status: ..., createdAt: ..., lastSavedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertReport(dataConnect, upsertReportVars);

console.log(data.report);

// Or, you can use the `Promise` API.
upsertReport(upsertReportVars).then((response) => {
  const data = response.data;
  console.log(data.report);
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
  createdAt: ..., 
  lastSavedAt: ..., // optional
};

// Call the `upsertReportRef()` function to get a reference to the mutation.
const ref = upsertReportRef(upsertReportVars);
// Variables can be defined inline as well.
const ref = upsertReportRef({ id: ..., companyId: ..., templateId: ..., title: ..., language: ..., progress: ..., status: ..., createdAt: ..., lastSavedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertReportRef(dataConnect, upsertReportVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.report);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.report);
});
```

## UpsertReportSection
You can execute the `UpsertReportSection` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertReportSection(vars: UpsertReportSectionVariables): MutationPromise<UpsertReportSectionData, UpsertReportSectionVariables>;

interface UpsertReportSectionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertReportSectionVariables): MutationRef<UpsertReportSectionData, UpsertReportSectionVariables>;
}
export const upsertReportSectionRef: UpsertReportSectionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertReportSection(dc: DataConnect, vars: UpsertReportSectionVariables): MutationPromise<UpsertReportSectionData, UpsertReportSectionVariables>;

interface UpsertReportSectionRef {
  ...
  (dc: DataConnect, vars: UpsertReportSectionVariables): MutationRef<UpsertReportSectionData, UpsertReportSectionVariables>;
}
export const upsertReportSectionRef: UpsertReportSectionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertReportSectionRef:
```typescript
const name = upsertReportSectionRef.operationName;
console.log(name);
```

### Variables
The `UpsertReportSection` mutation requires an argument of type `UpsertReportSectionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
Recall that executing the `UpsertReportSection` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertReportSectionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertReportSectionData {
  reportSection: ReportSection_Key;
}
```
### Using `UpsertReportSection`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertReportSection, UpsertReportSectionVariables } from '@dataconnect/generated';

// The `UpsertReportSection` mutation requires an argument of type `UpsertReportSectionVariables`:
const upsertReportSectionVars: UpsertReportSectionVariables = {
  id: ..., // optional
  reportId: ..., 
  sectionId: ..., 
  title: ..., 
  content: ..., // optional
  isDone: ..., 
  lastUpdated: ..., 
};

// Call the `upsertReportSection()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertReportSection(upsertReportSectionVars);
// Variables can be defined inline as well.
const { data } = await upsertReportSection({ id: ..., reportId: ..., sectionId: ..., title: ..., content: ..., isDone: ..., lastUpdated: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertReportSection(dataConnect, upsertReportSectionVars);

console.log(data.reportSection);

// Or, you can use the `Promise` API.
upsertReportSection(upsertReportSectionVars).then((response) => {
  const data = response.data;
  console.log(data.reportSection);
});
```

### Using `UpsertReportSection`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertReportSectionRef, UpsertReportSectionVariables } from '@dataconnect/generated';

// The `UpsertReportSection` mutation requires an argument of type `UpsertReportSectionVariables`:
const upsertReportSectionVars: UpsertReportSectionVariables = {
  id: ..., // optional
  reportId: ..., 
  sectionId: ..., 
  title: ..., 
  content: ..., // optional
  isDone: ..., 
  lastUpdated: ..., 
};

// Call the `upsertReportSectionRef()` function to get a reference to the mutation.
const ref = upsertReportSectionRef(upsertReportSectionVars);
// Variables can be defined inline as well.
const ref = upsertReportSectionRef({ id: ..., reportId: ..., sectionId: ..., title: ..., content: ..., isDone: ..., lastUpdated: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertReportSectionRef(dataConnect, upsertReportSectionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reportSection);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reportSection);
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
  readinessScore: number;
  complianceRate: number;
  riskLevel: number;
  efficiencyRate: number;
  trustScore: number;
  updatedAt: TimestampString;
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
  readinessScore: ..., 
  complianceRate: ..., 
  riskLevel: ..., 
  efficiencyRate: ..., 
  trustScore: ..., 
  updatedAt: ..., 
};

// Call the `upsertCompanyMetric()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertCompanyMetric(upsertCompanyMetricVars);
// Variables can be defined inline as well.
const { data } = await upsertCompanyMetric({ id: ..., companyId: ..., readinessScore: ..., complianceRate: ..., riskLevel: ..., efficiencyRate: ..., trustScore: ..., updatedAt: ..., });

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
  readinessScore: ..., 
  complianceRate: ..., 
  riskLevel: ..., 
  efficiencyRate: ..., 
  trustScore: ..., 
  updatedAt: ..., 
};

// Call the `upsertCompanyMetricRef()` function to get a reference to the mutation.
const ref = upsertCompanyMetricRef(upsertCompanyMetricVars);
// Variables can be defined inline as well.
const ref = upsertCompanyMetricRef({ id: ..., companyId: ..., readinessScore: ..., complianceRate: ..., riskLevel: ..., efficiencyRate: ..., trustScore: ..., updatedAt: ..., });

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

## UpsertIntelligenceSignal
You can execute the `UpsertIntelligenceSignal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertIntelligenceSignal(vars: UpsertIntelligenceSignalVariables): MutationPromise<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;

interface UpsertIntelligenceSignalRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertIntelligenceSignalVariables): MutationRef<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;
}
export const upsertIntelligenceSignalRef: UpsertIntelligenceSignalRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertIntelligenceSignal(dc: DataConnect, vars: UpsertIntelligenceSignalVariables): MutationPromise<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;

interface UpsertIntelligenceSignalRef {
  ...
  (dc: DataConnect, vars: UpsertIntelligenceSignalVariables): MutationRef<UpsertIntelligenceSignalData, UpsertIntelligenceSignalVariables>;
}
export const upsertIntelligenceSignalRef: UpsertIntelligenceSignalRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertIntelligenceSignalRef:
```typescript
const name = upsertIntelligenceSignalRef.operationName;
console.log(name);
```

### Variables
The `UpsertIntelligenceSignal` mutation requires an argument of type `UpsertIntelligenceSignalVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertIntelligenceSignalVariables {
  id?: UUIDString | null;
  title: string;
  content: string;
  severity: string;
  timestamp: TimestampString;
}
```
### Return Type
Recall that executing the `UpsertIntelligenceSignal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertIntelligenceSignalData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertIntelligenceSignalData {
  intelligenceSignal: IntelligenceSignal_Key;
}
```
### Using `UpsertIntelligenceSignal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertIntelligenceSignal, UpsertIntelligenceSignalVariables } from '@dataconnect/generated';

// The `UpsertIntelligenceSignal` mutation requires an argument of type `UpsertIntelligenceSignalVariables`:
const upsertIntelligenceSignalVars: UpsertIntelligenceSignalVariables = {
  id: ..., // optional
  title: ..., 
  content: ..., 
  severity: ..., 
  timestamp: ..., 
};

// Call the `upsertIntelligenceSignal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertIntelligenceSignal(upsertIntelligenceSignalVars);
// Variables can be defined inline as well.
const { data } = await upsertIntelligenceSignal({ id: ..., title: ..., content: ..., severity: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertIntelligenceSignal(dataConnect, upsertIntelligenceSignalVars);

console.log(data.intelligenceSignal);

// Or, you can use the `Promise` API.
upsertIntelligenceSignal(upsertIntelligenceSignalVars).then((response) => {
  const data = response.data;
  console.log(data.intelligenceSignal);
});
```

### Using `UpsertIntelligenceSignal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertIntelligenceSignalRef, UpsertIntelligenceSignalVariables } from '@dataconnect/generated';

// The `UpsertIntelligenceSignal` mutation requires an argument of type `UpsertIntelligenceSignalVariables`:
const upsertIntelligenceSignalVars: UpsertIntelligenceSignalVariables = {
  id: ..., // optional
  title: ..., 
  content: ..., 
  severity: ..., 
  timestamp: ..., 
};

// Call the `upsertIntelligenceSignalRef()` function to get a reference to the mutation.
const ref = upsertIntelligenceSignalRef(upsertIntelligenceSignalVars);
// Variables can be defined inline as well.
const ref = upsertIntelligenceSignalRef({ id: ..., title: ..., content: ..., severity: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertIntelligenceSignalRef(dataConnect, upsertIntelligenceSignalVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.intelligenceSignal);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.intelligenceSignal);
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

