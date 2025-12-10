import { rootApi } from '../../../shared/api/rootApi';
import type { TodoType } from '../model/todoType';

export const getTodos = async (token?: string) => {
  return await rootApi.get<TodoType[]>('/todos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addTodo = async (todo: TodoType, token?: string) => {
  return await rootApi.post<TodoType>('/todos', todo, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
};
