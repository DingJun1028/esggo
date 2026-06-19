# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useListAllTasks, useGetTaskById, useCreateTask, useDeleteTask, useUpdateTaskStatus, useListAuditRecords, useCreateAuditRecord, useUpdateAuditRecord, useDeleteAuditRecord, useListIntelligenceModules } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useListAllTasks();

const { data, isPending, isSuccess, isError, error } = useGetTaskById(getTaskByIdVars);

const { data, isPending, isSuccess, isError, error } = useCreateTask(createTaskVars);

const { data, isPending, isSuccess, isError, error } = useDeleteTask(deleteTaskVars);

const { data, isPending, isSuccess, isError, error } = useUpdateTaskStatus(updateTaskStatusVars);

const { data, isPending, isSuccess, isError, error } = useListAuditRecords();

const { data, isPending, isSuccess, isError, error } = useCreateAuditRecord(createAuditRecordVars);

const { data, isPending, isSuccess, isError, error } = useUpdateAuditRecord(updateAuditRecordVars);

const { data, isPending, isSuccess, isError, error } = useDeleteAuditRecord(deleteAuditRecordVars);

const { data, isPending, isSuccess, isError, error } = useListIntelligenceModules();

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
import { listAllTasks, getTaskById, createTask, deleteTask, updateTaskStatus, listAuditRecords, createAuditRecord, updateAuditRecord, deleteAuditRecord, listIntelligenceModules } from '@dataconnect/generated';


// Operation ListAllTasks: 
const { data } = await ListAllTasks(dataConnect);

// Operation GetTaskById:  For variables, look at type GetTaskByIdVars in ../index.d.ts
const { data } = await GetTaskById(dataConnect, getTaskByIdVars);

// Operation CreateTask:  For variables, look at type CreateTaskVars in ../index.d.ts
const { data } = await CreateTask(dataConnect, createTaskVars);

// Operation DeleteTask:  For variables, look at type DeleteTaskVars in ../index.d.ts
const { data } = await DeleteTask(dataConnect, deleteTaskVars);

// Operation UpdateTaskStatus:  For variables, look at type UpdateTaskStatusVars in ../index.d.ts
const { data } = await UpdateTaskStatus(dataConnect, updateTaskStatusVars);

// Operation ListAuditRecords: 
const { data } = await ListAuditRecords(dataConnect);

// Operation CreateAuditRecord:  For variables, look at type CreateAuditRecordVars in ../index.d.ts
const { data } = await CreateAuditRecord(dataConnect, createAuditRecordVars);

// Operation UpdateAuditRecord:  For variables, look at type UpdateAuditRecordVars in ../index.d.ts
const { data } = await UpdateAuditRecord(dataConnect, updateAuditRecordVars);

// Operation DeleteAuditRecord:  For variables, look at type DeleteAuditRecordVars in ../index.d.ts
const { data } = await DeleteAuditRecord(dataConnect, deleteAuditRecordVars);

// Operation ListIntelligenceModules: 
const { data } = await ListIntelligenceModules(dataConnect);


```