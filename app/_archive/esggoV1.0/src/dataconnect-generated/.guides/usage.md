# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useListUserEvidence, useListDashboardMetrics, useListOcrReviewItems, useGetCurrentUser, useCreateEvidence, useCreateDashboardMetric, useUpdateOcrReviewItem, useUpsertUser } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useListUserEvidence();

const { data, isPending, isSuccess, isError, error } = useListDashboardMetrics();

const { data, isPending, isSuccess, isError, error } = useListOcrReviewItems();

const { data, isPending, isSuccess, isError, error } = useGetCurrentUser();

const { data, isPending, isSuccess, isError, error } = useCreateEvidence(createEvidenceVars);

const { data, isPending, isSuccess, isError, error } = useCreateDashboardMetric(createDashboardMetricVars);

const { data, isPending, isSuccess, isError, error } = useUpdateOcrReviewItem(updateOcrReviewItemVars);

const { data, isPending, isSuccess, isError, error } = useUpsertUser(upsertUserVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listUserEvidence, listDashboardMetrics, listOcrReviewItems, getCurrentUser, createEvidence, createDashboardMetric, updateOcrReviewItem, upsertUser } from '@dataconnect/generated';


// Operation ListUserEvidence: 
const { data } = await ListUserEvidence(dataConnect);

// Operation ListDashboardMetrics: 
const { data } = await ListDashboardMetrics(dataConnect);

// Operation ListOcrReviewItems: 
const { data } = await ListOcrReviewItems(dataConnect);

// Operation GetCurrentUser: 
const { data } = await GetCurrentUser(dataConnect);

// Operation CreateEvidence:  For variables, look at type CreateEvidenceVars in ../index.d.ts
const { data } = await CreateEvidence(dataConnect, createEvidenceVars);

// Operation CreateDashboardMetric:  For variables, look at type CreateDashboardMetricVars in ../index.d.ts
const { data } = await CreateDashboardMetric(dataConnect, createDashboardMetricVars);

// Operation UpdateOcrReviewItem:  For variables, look at type UpdateOcrReviewItemVars in ../index.d.ts
const { data } = await UpdateOcrReviewItem(dataConnect, updateOcrReviewItemVars);

// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);


```