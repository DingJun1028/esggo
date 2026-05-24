# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAllBusinesses*](#listallbusinesses)
  - [*GetBusinessDetails*](#getbusinessdetails)
- [**Mutations**](#mutations)
  - [*CreateBusiness*](#createbusiness)

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

## ListAllBusinesses
You can execute the `ListAllBusinesses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllBusinesses(options?: ExecuteQueryOptions): QueryPromise<ListAllBusinessesData, undefined>;

interface ListAllBusinessesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllBusinessesData, undefined>;
}
export const listAllBusinessesRef: ListAllBusinessesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllBusinesses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllBusinessesData, undefined>;

interface ListAllBusinessesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllBusinessesData, undefined>;
}
export const listAllBusinessesRef: ListAllBusinessesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllBusinessesRef:
```typescript
const name = listAllBusinessesRef.operationName;
console.log(name);
```

### Variables
The `ListAllBusinesses` query has no variables.
### Return Type
Recall that executing the `ListAllBusinesses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllBusinessesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllBusinessesData {
  businesses: ({
    id: UUIDString;
    name: string;
    industry: string;
    createdAt: TimestampString;
  } & Business_Key)[];
}
```
### Using `ListAllBusinesses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllBusinesses } from '@dataconnect/generated';


// Call the `listAllBusinesses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllBusinesses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllBusinesses(dataConnect);

console.log(data.businesses);

// Or, you can use the `Promise` API.
listAllBusinesses().then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

### Using `ListAllBusinesses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllBusinessesRef } from '@dataconnect/generated';


// Call the `listAllBusinessesRef()` function to get a reference to the query.
const ref = listAllBusinessesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllBusinessesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

## GetBusinessDetails
You can execute the `GetBusinessDetails` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getBusinessDetails(vars: GetBusinessDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessDetailsData, GetBusinessDetailsVariables>;

interface GetBusinessDetailsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessDetailsVariables): QueryRef<GetBusinessDetailsData, GetBusinessDetailsVariables>;
}
export const getBusinessDetailsRef: GetBusinessDetailsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusinessDetails(dc: DataConnect, vars: GetBusinessDetailsVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessDetailsData, GetBusinessDetailsVariables>;

interface GetBusinessDetailsRef {
  ...
  (dc: DataConnect, vars: GetBusinessDetailsVariables): QueryRef<GetBusinessDetailsData, GetBusinessDetailsVariables>;
}
export const getBusinessDetailsRef: GetBusinessDetailsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessDetailsRef:
```typescript
const name = getBusinessDetailsRef.operationName;
console.log(name);
```

### Variables
The `GetBusinessDetails` query requires an argument of type `GetBusinessDetailsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBusinessDetailsVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetBusinessDetails` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessDetailsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBusinessDetailsData {
  business?: {
    id: UUIDString;
    name: string;
    description?: string | null;
    overallEsgScore: number;
  } & Business_Key;
}
```
### Using `GetBusinessDetails`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusinessDetails, GetBusinessDetailsVariables } from '@dataconnect/generated';

// The `GetBusinessDetails` query requires an argument of type `GetBusinessDetailsVariables`:
const getBusinessDetailsVars: GetBusinessDetailsVariables = {
  id: ..., 
};

// Call the `getBusinessDetails()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusinessDetails(getBusinessDetailsVars);
// Variables can be defined inline as well.
const { data } = await getBusinessDetails({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusinessDetails(dataConnect, getBusinessDetailsVars);

console.log(data.business);

// Or, you can use the `Promise` API.
getBusinessDetails(getBusinessDetailsVars).then((response) => {
  const data = response.data;
  console.log(data.business);
});
```

### Using `GetBusinessDetails`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessDetailsRef, GetBusinessDetailsVariables } from '@dataconnect/generated';

// The `GetBusinessDetails` query requires an argument of type `GetBusinessDetailsVariables`:
const getBusinessDetailsVars: GetBusinessDetailsVariables = {
  id: ..., 
};

// Call the `getBusinessDetailsRef()` function to get a reference to the query.
const ref = getBusinessDetailsRef(getBusinessDetailsVars);
// Variables can be defined inline as well.
const ref = getBusinessDetailsRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessDetailsRef(dataConnect, getBusinessDetailsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.business);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.business);
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

## CreateBusiness
You can execute the `CreateBusiness` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createBusiness(vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

interface CreateBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
}
export const createBusinessRef: CreateBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBusiness(dc: DataConnect, vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

interface CreateBusinessRef {
  ...
  (dc: DataConnect, vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
}
export const createBusinessRef: CreateBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBusinessRef:
```typescript
const name = createBusinessRef.operationName;
console.log(name);
```

### Variables
The `CreateBusiness` mutation requires an argument of type `CreateBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBusinessVariables {
  name: string;
  industry: string;
  overallEsgScore: number;
}
```
### Return Type
Recall that executing the `CreateBusiness` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBusinessData {
  business_insert: Business_Key;
}
```
### Using `CreateBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBusiness, CreateBusinessVariables } from '@dataconnect/generated';

// The `CreateBusiness` mutation requires an argument of type `CreateBusinessVariables`:
const createBusinessVars: CreateBusinessVariables = {
  name: ..., 
  industry: ..., 
  overallEsgScore: ..., 
};

// Call the `createBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBusiness(createBusinessVars);
// Variables can be defined inline as well.
const { data } = await createBusiness({ name: ..., industry: ..., overallEsgScore: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBusiness(dataConnect, createBusinessVars);

console.log(data.business_insert);

// Or, you can use the `Promise` API.
createBusiness(createBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.business_insert);
});
```

### Using `CreateBusiness`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBusinessRef, CreateBusinessVariables } from '@dataconnect/generated';

// The `CreateBusiness` mutation requires an argument of type `CreateBusinessVariables`:
const createBusinessVars: CreateBusinessVariables = {
  name: ..., 
  industry: ..., 
  overallEsgScore: ..., 
};

// Call the `createBusinessRef()` function to get a reference to the mutation.
const ref = createBusinessRef(createBusinessVars);
// Variables can be defined inline as well.
const ref = createBusinessRef({ name: ..., industry: ..., overallEsgScore: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBusinessRef(dataConnect, createBusinessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.business_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.business_insert);
});
```

