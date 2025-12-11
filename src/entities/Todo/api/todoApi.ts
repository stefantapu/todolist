import { rootApi } from '../../../shared/api/rootApi';
import type { CreateTodoType, TodoType } from '../model/todoType';

export const getTodos = async () => {
  return await rootApi.get<TodoType[]>('/todos');
};

export const addTodoFromServer = async (todo: CreateTodoType) => {
  return await rootApi.post<TodoType>('/todos', todo);
};
