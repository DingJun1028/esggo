# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useListAllTasks, useGetTaskById, useUpsertTask, useListAuditRecords, useListScrapedArticles, useListRoadmapMilestones, useUpsertRoadmapMilestone, useGetCompanyProfile, useUpsertCompanyProfile, useGetReportById } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useListAllTasks();

const { data, isPending, isSuccess, isError, error } = useGetTaskById(getTaskByIdVars);

const { data, isPending, isSuccess, isError, error } = useUpsertTask(upsertTaskVars);

const { data, isPending, isSuccess, isError, error } = useListAuditRecords();

const { data, isPending, isSuccess, isError, error } = useListScrapedArticles();

const { data, isPending, isSuccess, isError, error } = useListRoadmapMilestones();

const { data, isPending, isSuccess, isError, error } = useUpsertRoadmapMilestone(upsertRoadmapMilestoneVars);

const { data, isPending, isSuccess, isError, error } = useGetCompanyProfile(getCompanyProfileVars);

const { data, isPending, isSuccess, isError, error } = useUpsertCompanyProfile(upsertCompanyProfileVars);

const { data, isPending, isSuccess, isError, error } = useGetReportById(getReportByIdVars);

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
import { listAllTasks, getTaskById, upsertTask, listAuditRecords, listScrapedArticles, listRoadmapMilestones, upsertRoadmapMilestone, getCompanyProfile, upsertCompanyProfile, getReportById } from '@dataconnect/generated';


// Operation ListAllTasks: 
const { data } = await ListAllTasks(dataConnect);

// Operation GetTaskById:  For variables, look at type GetTaskByIdVars in ../index.d.ts
const { data } = await GetTaskById(dataConnect, getTaskByIdVars);

// Operation UpsertTask:  For variables, look at type UpsertTaskVars in ../index.d.ts
const { data } = await UpsertTask(dataConnect, upsertTaskVars);

// Operation ListAuditRecords: 
const { data } = await ListAuditRecords(dataConnect);

// Operation ListScrapedArticles: 
const { data } = await ListScrapedArticles(dataConnect);

// Operation ListRoadmapMilestones: 
const { data } = await ListRoadmapMilestones(dataConnect);

// Operation UpsertRoadmapMilestone:  For variables, look at type UpsertRoadmapMilestoneVars in ../index.d.ts
const { data } = await UpsertRoadmapMilestone(dataConnect, upsertRoadmapMilestoneVars);

// Operation GetCompanyProfile:  For variables, look at type GetCompanyProfileVars in ../index.d.ts
const { data } = await GetCompanyProfile(dataConnect, getCompanyProfileVars);

// Operation UpsertCompanyProfile:  For variables, look at type UpsertCompanyProfileVars in ../index.d.ts
const { data } = await UpsertCompanyProfile(dataConnect, upsertCompanyProfileVars);

// Operation GetReportById:  For variables, look at type GetReportByIdVars in ../index.d.ts
const { data } = await GetReportById(dataConnect, getReportByIdVars);


```