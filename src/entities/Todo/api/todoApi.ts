import { rootApi } from '../../../shared/api/rootApi';
import { rtkApi } from '../../../shared/api/rtkAPI';
import { type TodosStore } from '../model/store/todosStore';
import type {
  CheckTodoType,
  CreateTodoType,
  EditTodoType,
  TodoType,
} from '../model/todoType';

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

    getAllTodos: builder.query<TodoType[], void>({
      query: () => `/todos`,
      providesTags: ['Todo'],
      // чтобы не выкидывать кэш сразу, если компонент размонтировался
      keepUnusedDataFor: 60, // сек, подстрой
    }),

    getTodoById: builder.query<TodoType, string | null>({
      query: id => `/todos/${id}`,
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

    deleteTodo: builder.mutation<TodoType, string>({
      query: id => ({
        url: `/todos/${id}`,
        method: `DELETE`,
      }),
      invalidatesTags: ['Todo'],
    }),

    editTodo: builder.mutation<TodoType, EditTodoType>({
      query: todo => ({
        url: `/todos/${todo._id}`,
        method: `PATCH`,
        body: {
          title: todo.title,
          description: todo.description,
        },
      }),
      invalidatesTags: ['Todo'],
    }),

    checkTodo: builder.mutation<TodoType, CheckTodoType>({
      query: todo => ({
        url: `/todos/${todo._id}`,
        method: `PATCH`,
        body: { completed: todo.completed },
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTodosQuery,
  useGetAllTodosQuery,
  useGetTodoByIdQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
  useCheckTodoMutation,
} = todoApiRTK;
