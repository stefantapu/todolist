import { rootApi } from '../../../shared/api/rootApi';
import type { CreateTodoType, TodoType } from '../model/todoType';

export const getTodos = async (token?: string) => {
  return await rootApi.get<TodoType[]>('/todos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addTodoFromServer = async (
  todo: CreateTodoType,
  token?: string
) => {
  return await rootApi.post<TodoType>('/todos', todo, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};
