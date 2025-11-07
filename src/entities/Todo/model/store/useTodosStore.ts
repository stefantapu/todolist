import { create } from 'zustand';
import { mockTodos } from '../mockTodos';
import { devtools } from 'zustand/middleware';
import type { TodoType } from '../todoType';

type TodosState = {
  todos: TodoType[];
  addTodo: (newTodo: TodoType) => void;
  setTodos: (todos: TodoType[]) => void;
};

export const useTodosStore = create<TodosState>()(
  devtools(set => {
    return {
      todos: mockTodos,
      addTodo: (newTodo: TodoType) =>
        set(state => ({ todos: [newTodo, ...state.todos] })),
      setTodos: (todos: TodoType[]) => set({ todos }),
    };
  })
);
