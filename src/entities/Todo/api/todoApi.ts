import { rootApi } from '../../../shared/api/rootApi';
import { rtkApi } from '../../../shared/api/rtkAPI';
import { type TodosStore } from '../model/store/todosStore';
import type { CreateTodoType, TodoType } from '../model/todoType';

const getQueryParams = (filters: TodosStore['filters']) => {
  let queryParams = `?page=${filters.page}&limit=${filters.limit}`;

  if (filters.completed !== 'all') {
    queryParams += `&completed=${filters.completed}`;
  }
  if (filters.search) {
    queryParams += `&search=${filters.search}`;
  }
  return queryParams;
};

export const getTodos = async (filters: TodosStore['filters']) => {
  let queryParams = `?page=${filters.page}&limit=${filters.limit}`;

  if (filters.completed !== 'all') {
    queryParams += `&completed=${filters.completed}`;
  }
  if (filters.search) {
    queryParams += `&search=${filters.search}`;
  }
  return await rootApi.get<TodoType[]>(`/todos${queryParams}`);
};

export const getNextPage = async (filters: TodosStore['filters']) => {
  let queryParams = `?page=${filters.page + 1}&limit=${filters.limit}`;
  if (filters.search) {
    queryParams += `&search=${filters.search}`;
  }
  return await rootApi.get<TodoType[]>(`/todos${queryParams}`);
};

export const getTodoById = async (id: string) => {
  return await rootApi.get<TodoType>(`/todos/${id}`);
};

export const createTodo = async (todo: CreateTodoType) => {
  return await rootApi.post<TodoType>('/todos', todo);
};

export const deleteTodo = async (id: string) => {
  return await rootApi.delete('/todos/' + id);
};

export const editTodoTitleAndDescription = async (todo: CreateTodoType, id: string) => {
  return await rootApi.patch<TodoType>(`/todos/${id}`, todo);
};

export const editTodoCompleted = async (completed: boolean, id: string) => {
  return await rootApi.patch<TodoType>(`/todos/${id}`, { completed });
};

// Define a service using a base URL and expected endpoints
export const todoApiRTK = rtkApi.injectEndpoints({
  endpoints: builder => ({
    getTodos: builder.query<TodoType[], TodosStore['filters']>({
      query: filters => {
        const queryParams = getQueryParams(filters);
        return `/todos${queryParams}`;
      },
      providesTags: ['Todo'],
    }),
    addTodo: builder.mutation<TodoType, CreateTodoType>({
      query: todo => ({
        url: `/todos/`,
        method: `POST`,
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTodosQuery, useAddTodoMutation } = todoApiRTK;
