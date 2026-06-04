# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useUpsertUser, useCreateTask, useUpdateTask, useDeleteTask, useListTasks, useListUsers, useListUserTasks, useGetTaskById, useSearchTask } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useUpsertUser(upsertUserVars);

const { data, isPending, isSuccess, isError, error } = useCreateTask(createTaskVars);

const { data, isPending, isSuccess, isError, error } = useUpdateTask(updateTaskVars);

const { data, isPending, isSuccess, isError, error } = useDeleteTask(deleteTaskVars);

const { data, isPending, isSuccess, isError, error } = useListTasks();

const { data, isPending, isSuccess, isError, error } = useListUsers();

const { data, isPending, isSuccess, isError, error } = useListUserTasks();

const { data, isPending, isSuccess, isError, error } = useGetTaskById(getTaskByIdVars);

const { data, isPending, isSuccess, isError, error } = useSearchTask(searchTaskVars);

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
import { upsertUser, createTask, updateTask, deleteTask, listTasks, listUsers, listUserTasks, getTaskById, searchTask } from '@dataconnect/generated';


// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation CreateTask:  For variables, look at type CreateTaskVars in ../index.d.ts
const { data } = await CreateTask(dataConnect, createTaskVars);

// Operation UpdateTask:  For variables, look at type UpdateTaskVars in ../index.d.ts
const { data } = await UpdateTask(dataConnect, updateTaskVars);

// Operation DeleteTask:  For variables, look at type DeleteTaskVars in ../index.d.ts
const { data } = await DeleteTask(dataConnect, deleteTaskVars);

// Operation ListTasks: 
const { data } = await ListTasks(dataConnect);

// Operation ListUsers: 
const { data } = await ListUsers(dataConnect);

// Operation ListUserTasks: 
const { data } = await ListUserTasks(dataConnect);

// Operation GetTaskById:  For variables, look at type GetTaskByIdVars in ../index.d.ts
const { data } = await GetTaskById(dataConnect, getTaskByIdVars);

// Operation SearchTask:  For variables, look at type SearchTaskVars in ../index.d.ts
const { data } = await SearchTask(dataConnect, searchTaskVars);


```