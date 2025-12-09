import { rootApi } from '../../../shared/api/rootApi';
import type { TodoType } from '../model/todoType';

export const getTodos = async () => {
  return await rootApi.get<TodoType[]>('/todos');
};
