import { rootApi } from '../../../shared/api/rootApi';
import type { TodosStore } from '../model/store/todosStore';
import type { CreateTodoType, TodoType } from '../model/todoType';

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
  // send an object body to match typical PATCH expectations
  return await rootApi.patch<TodoType>(`/todos/${id}`, { completed });
};
