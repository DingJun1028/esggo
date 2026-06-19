# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `esg-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListUserEvidence*](#listuserevidence)
  - [*ListDashboardMetrics*](#listdashboardmetrics)
  - [*ListOcrReviewItems*](#listocrreviewitems)
  - [*GetCurrentUser*](#getcurrentuser)
- [**Mutations**](#mutations)
  - [*CreateEvidence*](#createevidence)
  - [*CreateDashboardMetric*](#createdashboardmetric)
  - [*UpdateOcrReviewItem*](#updateocrreviewitem)
  - [*UpsertUser*](#upsertuser)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `esg-connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@esggo/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@esggo/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@esggo/dataconnect';

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

Below are examples of how to use the `esg-connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListUserEvidence
You can execute the `ListUserEvidence` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserEvidence(options?: ExecuteQueryOptions): QueryPromise<ListUserEvidenceData, undefined>;

interface ListUserEvidenceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUserEvidenceData, undefined>;
}
export const listUserEvidenceRef: ListUserEvidenceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserEvidence(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUserEvidenceData, undefined>;

interface ListUserEvidenceRef {
  ...
  (dc: DataConnect): QueryRef<ListUserEvidenceData, undefined>;
}
export const listUserEvidenceRef: ListUserEvidenceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserEvidenceRef:
```typescript
const name = listUserEvidenceRef.operationName;
console.log(name);
```

### Variables
The `ListUserEvidence` query has no variables.
### Return Type
Recall that executing the `ListUserEvidence` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserEvidenceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListUserEvidence`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserEvidence } from '@esggo/dataconnect';


// Call the `listUserEvidence()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserEvidence();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserEvidence(dataConnect);

console.log(data.evidences);

// Or, you can use the `Promise` API.
listUserEvidence().then((response) => {
  const data = response.data;
  console.log(data.evidences);
});
```

### Using `ListUserEvidence`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserEvidenceRef } from '@esggo/dataconnect';


// Call the `listUserEvidenceRef()` function to get a reference to the query.
const ref = listUserEvidenceRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserEvidenceRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.evidences);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.evidences);
});
```

## ListDashboardMetrics
You can execute the `ListDashboardMetrics` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listDashboardMetrics(options?: ExecuteQueryOptions): QueryPromise<ListDashboardMetricsData, undefined>;

interface ListDashboardMetricsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListDashboardMetricsData, undefined>;
}
export const listDashboardMetricsRef: ListDashboardMetricsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDashboardMetrics(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListDashboardMetricsData, undefined>;

interface ListDashboardMetricsRef {
  ...
  (dc: DataConnect): QueryRef<ListDashboardMetricsData, undefined>;
}
export const listDashboardMetricsRef: ListDashboardMetricsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDashboardMetricsRef:
```typescript
const name = listDashboardMetricsRef.operationName;
console.log(name);
```

### Variables
The `ListDashboardMetrics` query has no variables.
### Return Type
Recall that executing the `ListDashboardMetrics` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDashboardMetricsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListDashboardMetrics`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDashboardMetrics } from '@esggo/dataconnect';


// Call the `listDashboardMetrics()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDashboardMetrics();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDashboardMetrics(dataConnect);

console.log(data.dashboardMetrics);

// Or, you can use the `Promise` API.
listDashboardMetrics().then((response) => {
  const data = response.data;
  console.log(data.dashboardMetrics);
});
```

### Using `ListDashboardMetrics`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDashboardMetricsRef } from '@esggo/dataconnect';


// Call the `listDashboardMetricsRef()` function to get a reference to the query.
const ref = listDashboardMetricsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDashboardMetricsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.dashboardMetrics);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.dashboardMetrics);
});
```

## ListOcrReviewItems
You can execute the `ListOcrReviewItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listOcrReviewItems(options?: ExecuteQueryOptions): QueryPromise<ListOcrReviewItemsData, undefined>;

interface ListOcrReviewItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListOcrReviewItemsData, undefined>;
}
export const listOcrReviewItemsRef: ListOcrReviewItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listOcrReviewItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListOcrReviewItemsData, undefined>;

interface ListOcrReviewItemsRef {
  ...
  (dc: DataConnect): QueryRef<ListOcrReviewItemsData, undefined>;
}
export const listOcrReviewItemsRef: ListOcrReviewItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listOcrReviewItemsRef:
```typescript
const name = listOcrReviewItemsRef.operationName;
console.log(name);
```

### Variables
The `ListOcrReviewItems` query has no variables.
### Return Type
Recall that executing the `ListOcrReviewItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListOcrReviewItemsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListOcrReviewItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listOcrReviewItems } from '@esggo/dataconnect';


// Call the `listOcrReviewItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listOcrReviewItems();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listOcrReviewItems(dataConnect);

console.log(data.ocrReviewItems);

// Or, you can use the `Promise` API.
listOcrReviewItems().then((response) => {
  const data = response.data;
  console.log(data.ocrReviewItems);
});
```

### Using `ListOcrReviewItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listOcrReviewItemsRef } from '@esggo/dataconnect';


// Call the `listOcrReviewItemsRef()` function to get a reference to the query.
const ref = listOcrReviewItemsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listOcrReviewItemsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.ocrReviewItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.ocrReviewItems);
});
```

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserRef:
```typescript
const name = getCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCurrentUserData {
  user?: {
    id: string;
    displayName?: string | null;
    email?: string | null;
    createdAt: TimestampString;
  } & User_Key;
}
```
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@esggo/dataconnect';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@esggo/dataconnect';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
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

Below are examples of how to use the `esg-connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateEvidence
You can execute the `CreateEvidence` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createEvidence(vars: CreateEvidenceVariables): MutationPromise<CreateEvidenceData, CreateEvidenceVariables>;

interface CreateEvidenceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEvidenceVariables): MutationRef<CreateEvidenceData, CreateEvidenceVariables>;
}
export const createEvidenceRef: CreateEvidenceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEvidence(dc: DataConnect, vars: CreateEvidenceVariables): MutationPromise<CreateEvidenceData, CreateEvidenceVariables>;

interface CreateEvidenceRef {
  ...
  (dc: DataConnect, vars: CreateEvidenceVariables): MutationRef<CreateEvidenceData, CreateEvidenceVariables>;
}
export const createEvidenceRef: CreateEvidenceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEvidenceRef:
```typescript
const name = createEvidenceRef.operationName;
console.log(name);
```

### Variables
The `CreateEvidence` mutation requires an argument of type `CreateEvidenceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEvidenceVariables {
  title: string;
  content: string;
  source: string;
  confidenceScore: number;
}
```
### Return Type
Recall that executing the `CreateEvidence` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEvidenceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEvidenceData {
  evidence_insert: Evidence_Key;
}
```
### Using `CreateEvidence`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEvidence, CreateEvidenceVariables } from '@esggo/dataconnect';

// The `CreateEvidence` mutation requires an argument of type `CreateEvidenceVariables`:
const createEvidenceVars: CreateEvidenceVariables = {
  title: ..., 
  content: ..., 
  source: ..., 
  confidenceScore: ..., 
};

// Call the `createEvidence()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEvidence(createEvidenceVars);
// Variables can be defined inline as well.
const { data } = await createEvidence({ title: ..., content: ..., source: ..., confidenceScore: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEvidence(dataConnect, createEvidenceVars);

console.log(data.evidence_insert);

// Or, you can use the `Promise` API.
createEvidence(createEvidenceVars).then((response) => {
  const data = response.data;
  console.log(data.evidence_insert);
});
```

### Using `CreateEvidence`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEvidenceRef, CreateEvidenceVariables } from '@esggo/dataconnect';

// The `CreateEvidence` mutation requires an argument of type `CreateEvidenceVariables`:
const createEvidenceVars: CreateEvidenceVariables = {
  title: ..., 
  content: ..., 
  source: ..., 
  confidenceScore: ..., 
};

// Call the `createEvidenceRef()` function to get a reference to the mutation.
const ref = createEvidenceRef(createEvidenceVars);
// Variables can be defined inline as well.
const ref = createEvidenceRef({ title: ..., content: ..., source: ..., confidenceScore: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEvidenceRef(dataConnect, createEvidenceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.evidence_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.evidence_insert);
});
```

## CreateDashboardMetric
You can execute the `CreateDashboardMetric` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDashboardMetric(vars: CreateDashboardMetricVariables): MutationPromise<CreateDashboardMetricData, CreateDashboardMetricVariables>;

interface CreateDashboardMetricRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDashboardMetricVariables): MutationRef<CreateDashboardMetricData, CreateDashboardMetricVariables>;
}
export const createDashboardMetricRef: CreateDashboardMetricRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDashboardMetric(dc: DataConnect, vars: CreateDashboardMetricVariables): MutationPromise<CreateDashboardMetricData, CreateDashboardMetricVariables>;

interface CreateDashboardMetricRef {
  ...
  (dc: DataConnect, vars: CreateDashboardMetricVariables): MutationRef<CreateDashboardMetricData, CreateDashboardMetricVariables>;
}
export const createDashboardMetricRef: CreateDashboardMetricRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDashboardMetricRef:
```typescript
const name = createDashboardMetricRef.operationName;
console.log(name);
```

### Variables
The `CreateDashboardMetric` mutation requires an argument of type `CreateDashboardMetricVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDashboardMetricVariables {
  title: string;
  value: number;
  unit: string;
  trend: string;
  percentageChange: number;
}
```
### Return Type
Recall that executing the `CreateDashboardMetric` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDashboardMetricData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDashboardMetricData {
  dashboardMetric_insert: DashboardMetric_Key;
}
```
### Using `CreateDashboardMetric`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDashboardMetric, CreateDashboardMetricVariables } from '@esggo/dataconnect';

// The `CreateDashboardMetric` mutation requires an argument of type `CreateDashboardMetricVariables`:
const createDashboardMetricVars: CreateDashboardMetricVariables = {
  title: ..., 
  value: ..., 
  unit: ..., 
  trend: ..., 
  percentageChange: ..., 
};

// Call the `createDashboardMetric()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDashboardMetric(createDashboardMetricVars);
// Variables can be defined inline as well.
const { data } = await createDashboardMetric({ title: ..., value: ..., unit: ..., trend: ..., percentageChange: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDashboardMetric(dataConnect, createDashboardMetricVars);

console.log(data.dashboardMetric_insert);

// Or, you can use the `Promise` API.
createDashboardMetric(createDashboardMetricVars).then((response) => {
  const data = response.data;
  console.log(data.dashboardMetric_insert);
});
```

### Using `CreateDashboardMetric`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDashboardMetricRef, CreateDashboardMetricVariables } from '@esggo/dataconnect';

// The `CreateDashboardMetric` mutation requires an argument of type `CreateDashboardMetricVariables`:
const createDashboardMetricVars: CreateDashboardMetricVariables = {
  title: ..., 
  value: ..., 
  unit: ..., 
  trend: ..., 
  percentageChange: ..., 
};

// Call the `createDashboardMetricRef()` function to get a reference to the mutation.
const ref = createDashboardMetricRef(createDashboardMetricVars);
// Variables can be defined inline as well.
const ref = createDashboardMetricRef({ title: ..., value: ..., unit: ..., trend: ..., percentageChange: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDashboardMetricRef(dataConnect, createDashboardMetricVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dashboardMetric_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dashboardMetric_insert);
});
```

## UpdateOcrReviewItem
You can execute the `UpdateOcrReviewItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateOcrReviewItem(vars: UpdateOcrReviewItemVariables): MutationPromise<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;

interface UpdateOcrReviewItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateOcrReviewItemVariables): MutationRef<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;
}
export const updateOcrReviewItemRef: UpdateOcrReviewItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateOcrReviewItem(dc: DataConnect, vars: UpdateOcrReviewItemVariables): MutationPromise<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;

interface UpdateOcrReviewItemRef {
  ...
  (dc: DataConnect, vars: UpdateOcrReviewItemVariables): MutationRef<UpdateOcrReviewItemData, UpdateOcrReviewItemVariables>;
}
export const updateOcrReviewItemRef: UpdateOcrReviewItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateOcrReviewItemRef:
```typescript
const name = updateOcrReviewItemRef.operationName;
console.log(name);
```

### Variables
The `UpdateOcrReviewItem` mutation requires an argument of type `UpdateOcrReviewItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateOcrReviewItemVariables {
  id: UUIDString;
  status?: string | null;
  extractedValue?: string | null;
}
```
### Return Type
Recall that executing the `UpdateOcrReviewItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateOcrReviewItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateOcrReviewItemData {
  ocrReviewItem_updateMany: number;
}
```
### Using `UpdateOcrReviewItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateOcrReviewItem, UpdateOcrReviewItemVariables } from '@esggo/dataconnect';

// The `UpdateOcrReviewItem` mutation requires an argument of type `UpdateOcrReviewItemVariables`:
const updateOcrReviewItemVars: UpdateOcrReviewItemVariables = {
  id: ..., 
  status: ..., // optional
  extractedValue: ..., // optional
};

// Call the `updateOcrReviewItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateOcrReviewItem(updateOcrReviewItemVars);
// Variables can be defined inline as well.
const { data } = await updateOcrReviewItem({ id: ..., status: ..., extractedValue: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateOcrReviewItem(dataConnect, updateOcrReviewItemVars);

console.log(data.ocrReviewItem_updateMany);

// Or, you can use the `Promise` API.
updateOcrReviewItem(updateOcrReviewItemVars).then((response) => {
  const data = response.data;
  console.log(data.ocrReviewItem_updateMany);
});
```

### Using `UpdateOcrReviewItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateOcrReviewItemRef, UpdateOcrReviewItemVariables } from '@esggo/dataconnect';

// The `UpdateOcrReviewItem` mutation requires an argument of type `UpdateOcrReviewItemVariables`:
const updateOcrReviewItemVars: UpdateOcrReviewItemVariables = {
  id: ..., 
  status: ..., // optional
  extractedValue: ..., // optional
};

// Call the `updateOcrReviewItemRef()` function to get a reference to the mutation.
const ref = updateOcrReviewItemRef(updateOcrReviewItemVars);
// Variables can be defined inline as well.
const ref = updateOcrReviewItemRef({ id: ..., status: ..., extractedValue: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateOcrReviewItemRef(dataConnect, updateOcrReviewItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.ocrReviewItem_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.ocrReviewItem_updateMany);
});
```

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars?: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars?: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars?: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation has an optional argument of type `UpsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  displayName?: string | null;
  email?: string | null;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@esggo/dataconnect';

// The `UpsertUser` mutation has an optional argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  displayName: ..., // optional
  email: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ displayName: ..., email: ..., });
// Since all variables are optional for this mutation, you can omit the `UpsertUserVariables` argument.
const { data } = await upsertUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@esggo/dataconnect';

// The `UpsertUser` mutation has an optional argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  displayName: ..., // optional
  email: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ displayName: ..., email: ..., });
// Since all variables are optional for this mutation, you can omit the `UpsertUserVariables` argument.
const ref = upsertUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

