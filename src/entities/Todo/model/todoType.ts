export type TodoType = {
  _id: string;
  title: string;
  order: number;
  completed: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoType = Pick<TodoType, 'title' | 'description'>;
export type EditTodoType = Pick<TodoType, 'title' | 'description' | '_id'>;
export type CheckTodoType = Pick<TodoType, 'completed' | '_id'>;
